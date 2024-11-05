# latest-checkin-intune
Webtool for checking the latest logins for an intune bound device with the device's name.

### Info
A web application designed for the purpose of fetching the latest logins for example a shared device.
Made this, because there didn't seem to be a black and white way of doing it, considering the Graph API from Microsoft is still in developement.

### Modules 
Module installation 
```npm install```<br>
Modules used: ```@azure/identity @microsoft/microsoft-graph-client isomorphic-fetch express```

### Modifiers
 <strong>Token authentication</strong><br>
 - auth.js allows basic token authentication directly from the URL (<strong>e.g: ?token=abc123456def</strong>) ```ACCESS_TOKEN```

 <strong>Client-, tenant- and secret key</strong><br>
 - appSettings.js requires app identifiers in order to function ```clientId, tenantId, clientSecret```
 
 <strong>Request timeout and length of request</strong><br>
 - graph.js contains timeout and minimum length variables ```COOLDOWN_TIME, MINIMUM_LENGTH```


### Usage
 Add your client and tenant IDs and client secret to appSettings.js.<br>
 Run <strong>node index.js</strong> to launch server to port <strong>1869</strong>.