# latest-checkin-intune
Webtool for checking the latest logins for an intune bound device with the device's name.

### Info
A web application designed for the purpose of fetching the latest logins for example a shared device.
Made this, because there didn't seem to be a black and white way of doing it, considering the Graph API from Microsoft is still in developement.

### Modules 
Module installation<br>
```npm install @azure/identity @microsoft/microsoft-graph-client isomorphic-fetch express```

### Usage
 Add your client and tenant IDs and client secret to appSettings.js.
 Run <strong>node index.js</strong> to launch server to port 1869.
