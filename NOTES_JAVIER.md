# Notes

# Main issues:

1 - Scalability and performance
2 - Security
3 - Error handling and monitoring
4 - Code quality and maintanability
5 - Testing

# Clarify requirements

- We access the BOM FTP server per request, that would give us the latest/updated file list in every call, depending on business needs we may or not require such approach, we may not need this up to date information in each request, so, as discussed below in performance, we may need to find a balance between the need for updated information and reasonable usage of the BOM service. There is always a tradeoff, and that would define the architecture and design

**_ this is a summary o issues found, for more details look at the comments in the code _**

# 1 - Performance

## Resource usage

- every download leaves a file in the local storage, and after being sent back to the user it stays there, it needs to be removed or cleaned with some maintenance strategy, offline process or similar

## FTP connections

- The connections to the BOM FTP service should be pooled for efficiency (comments in the code), currently lots of memory leak as every API request creates an FTP conn.

## Sync operations

"Get detail" file blocking operation. VERY IMPORTANT - CRITICAL

When the warning detail file has been saved locally, we retrieve it from the local file system to return to the user synchronously, this operation can block the event loop as any other sync operation in a single threaded context like NodeJS

## External API usage issues

### calls to list files

Each request to the BOM endpoint for file listing executes an API call to their FTP server, that is not optimal for when we have more a than a few requests per minute.

For 1000x more requests we need to find a way to store the results from the API to reduce its usage, we may easily get banned or blocked for abusing the BOM service.

We need a mechanism to avoid calling the FTP server for every request we get, e.g. caching our responses to the client (the same request will return the same response for a period of time, e.g. list all files will return the same response for 5 minutes, after that the cache gets refreshed, making abother call to the FTP server to list the files)

Or setup an offline process that brings the data from the BOM FTP server every 5 minutes and then our endpoint calls that fast database or cache instead of calling the BOM API.

The retrieval is inneficient also, it downloads entire file lists in every call, we could find a strategy to filter the list

### calls to download files

Same as above, each calls the BOM API and downloads the file locally, we could use a local storage of files and cache their access.

### solution for caching

We can put caches for our API responses (CDN), and another to cache calls to BOM, proventing BOM overload (e.g. Redis or DynamoDB, any indexed fast DB)

## Rate Limiting & Throttling

Limit or slow down the processing of our endpoint requests

# 2 - Security

- Input params are not validated or sanitised
- Requests are not limited or IP checked
- File writing does not have permissions checks, and writes freely to current directoy (where the server is running), we should use a cloud storage with some access policy or similar.
- File writing/creation involves string concatenation, could allow injected malicious names and open to file system exploits.

- Packages need to be updated, I run a checking tool and there are many new version, mostly major ones:
  @types/express ^4.17.13 → ^5.0.3
  @types/jest ^26.0.24 → ^30.0.0
  basic-ftp ^4.6.6 → ^5.0.5
  express ^4.17.1 → ^5.1.0
  jest ^27.0.6 → ^30.0.4
  nodemon ^2.0.12 → ^3.1.10
  ts-jest ^27.0.3 → ^29.4.0
  ts-node ^10.1.0 → ^10.9.2
  typescript ^4.3.5 → ^5.8.3
  xml2js ^0.4.23 → ^0.6.2

- plenty of security concerns in the dependencies, probably they will be fixed once updated
  > npm audit
  > 29 vulnerabilities (4 low, 10 moderate, 13 high, 2 critical)

# 3 - Error management and monitoring

- Errors only log to console, and many are silent, they just return "", no good feedback (generic messages).
- No fallbacks like re try when fail, etc.
- No monitoring of server health, no metrics data collection to check performance, no notifications when failing (e.g. email, etc.)

# 4 - Code base / Maintanability

- Usage of any in many places, or no type definitions at all, we need type safety.
- Switch statements without break causing fallback issues (e.g. FloodWarningParser), missing error handling for invalid inputs in switches
- High coupling, classes instsantiates dependencies (e.g. Downloader), we could use DI (NestJS)
- variable naming is inconsistent or incomplete (start, expiry vars in FloodWarningParser)

# 5 - Testing

- We only have unit tests
- no integration tests (we need to test the integration with the caches, DBs, file system or cloud storage, etc, all the downstream services we use)
- no error paths tested (getAmocToStateId.spec)
- no API testing
- no stress testing
- tests coupled with real dependencies, no dependency mocking (amoc.spec.ts) we dont want to test dependencies, just our code
