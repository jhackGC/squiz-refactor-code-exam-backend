# Notes

## Clarify requirements

- we access the BOM FTP server per request, that would give us the latest/updated file list in every call, depending on business needs we may or not require such approach, we may not need this up to date information in each request, so, as discussed below in performance, we may need to find a balance between the need for updated information and reasonable usage of the BOM service.

# Code base / Maintanability

# Performance

## Sync operations

Sync operations block the event loop

## external API usage issues

Each request to the BOM endpoint executes an API call to their FTP server, that is not optimal for when we have more a than a few requests per minute.

For 1000x more requests we need to find a way to store the results from the API to reduce its usage, we may easily get banned or blocked for abusing the BOM service.

# Error management and monitoring

# Security

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
