# oauth.websample1

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7a56644ad31e4cb5895f732cf07a86ce)](https://www.codacy.com/gh/gary-archer/oauth.websample1/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=gary-archer/oauth.websample1&amp;utm_campaign=Badge_Grade)

[![Known Vulnerabilities](https://snyk.io/test/github/gary-archer/oauth.websample1/badge.svg?targetFile=spa/package.json)](https://snyk.io/test/github/gary-archer/oauth.websample1?targetFile=spa/package.json&x=1)

[![Known Vulnerabilities](https://snyk.io/test/github/gary-archer/oauth.websample1/badge.svg?targetFile=api/package.json)](https://snyk.io/test/github/gary-archer/oauth.websample1?targetFile=api/package.json&x=1)

### Overview

* The initial SPA sample, using OAuth and Open Id Connect, referenced in my blog at https://authguidance.com
* **The goal of this sample is to integrate a Web UI and API with an external Authorization Server** 

### Details

* See the [Sample 1 Overview](https://authguidance.com/2017/09/24/basicspa-overview/) for details of behaviour
* See the [Sample 1 Instructions](https://authguidance.com/2017/09/25/basicspa-execution/) for infrastructure setup and how to run the code

### Programming Languages

* TypeScript is used for the SPA
* NodeJS with TypeScript is used for the API

### Middleware Used

* Express is used to host both the API and the SPA content
* Okta is used as the default Authorization Server
* The [Oidc-Client Library](https://github.com/IdentityModel/oidc-client-js) is used to implement SPA logins and token handling
* The [OpenId-Client Library](https://github.com/panva/node-openid-client) is used to handle calls from the API to the Authorization Server
