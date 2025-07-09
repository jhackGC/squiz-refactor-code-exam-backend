import express from "express";
import { getWarnings } from "./floods/amoc";
import { Downloader } from "./floods/Downloader";
import { getAmocToStateId } from "./getAmocToStateId";
import { FloodWarningParser } from "./parser/floodWarning";

require("./logger.ts");

const app = express();
const port = 3000;

const ERRORMESSAGE = "Something went wrong";

app.get("/", async (req, res) => {
  // Issues: Security -> no rate limiting is applied
  // Solution: Implement rate limiting to prevent abuse (DDoS attacks) use middleware or library
  try {
    const data = await getWarnings();

    // Maps the state to the amoc id
    // Issues: the query input param is not validated, nor sanitized
    // Solution: use middleware or library to validate and sanitize input
    const state = getAmocToStateId(req.query.state?.toString() || "");

    let results = [];
    for (let key in data) {
      if (key.startsWith(state)) {
        results.push(key.replace(/\.amoc\.xml/, ""));
      }
    }

    res.send(results);
  } catch (error) {
    console.log(error);
    res.send(ERRORMESSAGE);
  }
});

/* 
  Endpoint to get the warning by id and download it
*/
app.get("/warning/:id", async (req, res) => {
  try {
    // Issues: Security -> no rate limiting is applied
    // Solution: Implement rate limiting to prevent abuse (DDoS attacks) use middleware or library
    const downloader = new Downloader();

    // Issues: the query input param is not validated, nor sanitized, use middleware or library
    const xmlid = req.params.id;

    const warning = await downloader.download(xmlid);
    const warningParser = new FloodWarningParser(warning);
    const text = await downloader.downloadText(xmlid);

    res.send({ ...(await warningParser.getWarning()), text: text || "" });
  } catch (error) {
    console.log(error);
    res.send(ERRORMESSAGE);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
