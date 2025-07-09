import { Client } from "basic-ftp";

export async function getWarnings() {
  // Issue: Creates a new FTP client instance on every call, which is inefficient for high-volume scenarios (1000+ connections)
  // Solution: Implement a connection pool to reuse FTP connections with configurable max connections, timeout, and idle cleanup
  const client = new Client();
  client.ftp.verbose = true;

  // Issues: The connection is not pooled
  try {
    // Issues: Security -> the host is hardcoded, and the connection is not secure
    // Solution: use environment variables for configuration, and ensure secure connections
    // Issues: each connection creates a new client instance, reuse connections with a connection pool

    await client.access({
      host: "ftp.bom.gov.au",
      secure: false,
    });

    await client.cd("/anon/gen/fwo/");

    const files = await client.list();

    let warns: any = {};
    for (var file in files) {
      if (files[file].name.endsWith(".amoc.xml")) {
        warns[files[file].name] = true;
      }
    }

    return warns;
  } catch (err) {
    // Issues: no proper logging approach is used
    // Issue: silent failure
    // Issue: no error handling for the FTP connection
    console.log(err);
  }

  client.close();
}

export function getWarning(id: string) {
  //
}
