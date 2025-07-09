export function getAmocToStateId(state: string): string {
  // Issues: the state input is not validated
  // Issues: no break leads to fall-through behavior
  // Issues: no default case to handle unexpected input
  switch (state) {
    case "NT":
      return "IDD";
    case "NSW":
      return "IDN";
    case "Qld":
      return "IDQ";
    case "SA":
      return "IDS";
    case "Tas":
      return "IDT";
    case "Vic":
      return "IDV";
    case "WA":
      return "IDW";
    case "ACT":
      return "IDN";
  }

  return "unk";
}
