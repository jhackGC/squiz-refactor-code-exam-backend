import { getWarnings } from "./amoc";

// Issues: no mocking framework is used
// Solution: use a mocking framework like jest to mock the getWarnings function
// Issues: no unhappy path tests are defined
// Solution: add tests for error scenarios, such as network failures or invalid data formats
describe("getting data", () => {
  it("should download data", async () => {
    const warnings = await getWarnings();

    expect(Object.keys(warnings).length).toBeGreaterThan(1);
  });

  it("should download data", async () => {
    const warnings = await getWarnings();

    expect(Object.keys(warnings)).toContain("IDQ11307.amoc.xml");
  });
});
