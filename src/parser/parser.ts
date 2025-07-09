// http://www.bom.gov.au/schema/v1.7/amoc.xsd
var parseString = require("xml2js").parseString;

export function parseXml(xml: string, callback: (result: any) => void) {
  // Issues:
  // - No error handling for the XML parsing
  // - XXE Vulnerability: No input checking for xml, could be empty or invalid (allows XML External Entity attack)
  // Malicious XML could be used to read sensitive files on the server, or include references to external entities, etc.

  // Solution: Add error handling, null pointer validation, and disable external entities to prevent XXE attacks

  // callback is not validated as a function and the param is any type
  parseString(xml, function (err: any, result: any) {
    callback(result);
  });
}
