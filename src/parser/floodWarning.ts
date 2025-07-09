import { Downloader } from "../floods/Downloader";
import { parseXml } from "./parser";

export class FloodWarningParser {
  // Issues: The constructor accepts any type, which is not type-safe.
  // Solution: Define a specific type for xmlString, and check for existence.

  constructor(private xmlString: any) {}

  async getWarning() {
    const obj: any = await new Promise((resolve, reject) => {
      // Issues: No error handling for the XML parsing
      // No input checking for xmlString, could be empty or invalid
      parseXml(this.xmlString, (data) => {
        resolve(data);
      });
    });

    let productType = (obj.amoc["product-type"] || [])[0];

    // Issues: The switch statement does not have break statements, leading to fall-through behavior.
    // Solution: Add break statements to each case to prevent fall-through.

    switch (productType) {
      case "A":
        productType = "Advice";
      case "B":
        productType = "Bundle";
      case "C":
        productType = "Climate";
      case "D":
        productType = "Metadata";
      case "E":
        productType = "Analysis";
      case "F":
        productType = "Forecast";
      case "M":
        productType = "Numerical Weather Prediction";
      case "O":
        productType = "Observation";
      case "Q":
        productType = "Reference";
      case "R":
        productType = "Radar";
      case "S":
        productType = "Special";
      case "T":
        productType = "Satellite";
      case "W":
        productType = "Warning";
      case "X":
        productType = "Mixed";
    }

    let service = (obj.amoc["service"] || [])[0];

    switch (service) {
      case "COM":
        service = "Commercial Services";
        break;
      case "HFW":
        service = "Flood Warning Service";
        break;
      case "TWS":
        service = "Tsunami Warning Services";
        break;
      case "WAP":
        service = "Analysis and Prediction";
        break;
      case "WSA":
        service = "Aviation Weather Services";
        break;
      case "WSD":
        service = "Defence Weather Services";
        break;
      case "WSF":
        service = "Fire Weather Services";
        break;
      case "WSM":
        service = "Marine Weather Services";
        break;
      case "WSP":
        service = "Public Weather Services";
        break;
      case "WSS":
        service = "Cost Recovery Services";
        break;
      case "WSW":
        service = "Disaster Mitigation";
        break;
    }

    return {
      productType,
      service,
      start: await this.getIssueTime(),
      expiry: await this.getEndTime(),
    };
  }
  async getIssueTime() {
    // Issues: No error handling for the XML parsing
    // No input checking for xmlString, could be empty or invalid
    // Solution: Add error handling and null pointers validation
    const obj: any = await new Promise((resolve, reject) => {
      parseXml(this.xmlString, (data) => {
        resolve(data);
      });
    });

    let issuetime = (obj.amoc["issue-time-utc"] || [])[0];

    return issuetime;
  }

  async getEndTime() {
    // Issues: No error handling for the XML parsing
    // No input checking for xmlString, could be empty or invalid
    // Solution: Add error handling and null pointers validation
    const obj: any = await new Promise((resolve, reject) => {
      parseXml(this.xmlString, (data) => {
        resolve(data);
      });
    });

    let issuetime = (obj.amoc["expiry-time"] || [])[0];

    return issuetime;
  }

  async getWarningText(): Promise<string> {
    // Issues: No error handling for the XML parsing
    // No input checking for xmlString, could be empty or invalid
    // Solution: Add error handling and null pointers validation
    const obj: any = await new Promise((resolve, reject) => {
      parseXml(this.xmlString, (data) => {
        resolve(data);
      });
    });
    const downloader = new Downloader();

    const warningText = await downloader.downloadText(obj.amoc.identifier[0]);

    return warningText;
  }
}
