import { Client } from "basic-ftp";

import fs from "fs";

export class Downloader {
  async download(key: string) {
    // Issues: Architecture -> don't call the FTP server on every request, instead use a cache.
    // Solution: Implement a caching mechanism to store downloaded files for a certain period
    // Issues: high coupling, classes instantiates dependencies (new Client()), we could use DI
    const client = new Client();
    client.ftp.verbose = true;
    try {
      // Issues: Security -> the host is hardcoded, and the connection is not secure
      // Solution: use environment variables for configuration, and ensure secure connections
      await client.access({
        host: "ftp.bom.gov.au",
        secure: false,
      });

      await client.cd("/anon/gen/fwo/");

      const files = await client.list();

      for (var file in files) {
        if (files[file].name.endsWith(".amoc.xml")) {
          if (`${key}.amoc.xml` == files[file].name) {
            await client.download(`./${key}.xml`, files[file].name);
          }
        }
      }
      client.close();

      const data = this.readData(key);

      return data;
    } catch (err) {
      // Issues: no proper logging approach is used
      // Solution: use a logging library for better logging
      console.log(key + " file not found");
      // Issues: silent failure
      // Solution: re throw an error or return a specific message to be handled upstream
      return "";
    }
  }

  readData(key: string): string {
    // Issues: Synchronous file read can block the event loop
    // Solution: Use asynchronous file read to avoid blocking the event loop
    return fs.readFileSync(`./${key}.xml`, { encoding: "utf-8" });
  }

  async downloadText(key: string) {
    const client = new Client();
    client.ftp.verbose = true;
    let warningText = "";
    try {
      // same issues as in amoc.ts
      // Issues: Security -> the host is hardcoded, and the connection is not secure
      await client.access({
        host: "ftp.bom.gov.au",
        secure: false,
      });

      await client.cd("/anon/gen/fwo/");

      await client.download(`./${key}.txt`, key + ".txt");

      // Issues: Synchronous file read can block the event loop
      warningText = fs.readFileSync(`./${key}.txt`, {
        encoding: "utf-8",
      });
    } catch (err) {
      // Issues: no proper logging approach is used
      // Solution: use a logging library for better logging
      // Issues: silent failure
      // Solution: re throw an error or return a specific message to be handled upstream
      console.log(key + " file not found");

      // Issue: the flow returns in case of an error, and the connection is not closed
      // Solution: ensure the connection is closed in a finally block
      return "";
    }

    client.close();

    return warningText;
  }
}
