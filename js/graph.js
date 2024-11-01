// Import modules
import "isomorphic-fetch";
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';

// Define variables
let _settings = undefined;
let _clientSecret = undefined;
let _appClient = undefined;

// Initialize Graph authentication (app only)
export async function initializeGraph(settings) {

    // Check that settings are defined and define them
    if (!settings){throw new Error("Settings are undefined.");}
    _settings = settings;

    // Define client secret
    if (!_clientSecret) {
        _clientSecret = new ClientSecretCredential(
            _settings.tenantId,
            _settings.clientId,
            _settings.clientSecret,
        );
    }

    // Define app client
    if (!_appClient) {
        const authProvider = new TokenCredentialAuthenticationProvider(
            _clientSecret,
            {
                scopes: ["https://graph.microsoft.com/.default"],
            }
        );

        _appClient = Client.initWithMiddleware({
            authProvider: authProvider,
        });
    }
}

// First part
// Function for fetching logon
export async function fetchLogon(DEVICE_SERIAL) {
    let result = [];
    const device = await deviceFetchCall(DEVICE_SERIAL);
    if (device) {
        const userIds = device.usersLoggedOn.map(user => user.userId);
        const userNames = await fetchUserName(userIds);

        console.log("Device name:", device.deviceName);
        for (const user of device.usersLoggedOn) {
            const userName = userNames[user.userId] || "UNKNOWN USER";
            console.log("User:", userName, "Last Logon:", user.lastLogOnDateTime);

            result.push({
                userName: userNames[user.userId] || "UNKNOWN USER",
                lastLogOnDateTime: user.lastLogOnDateTime,
            });
        }
    } else {
        console.log("Device not found. Check serial number.");
    }

    JSON.stringify(result);
    return result;
}

// Second part
// Search with _appClient for a device name, device id and the user id
async function deviceFetchCall(SERIAL) {
    console.log("Searching device with serial", SERIAL);
    const result = await _appClient
        .api("/deviceManagement/managedDevices")
        .version("beta")
        .filter(`contains(deviceName, '${SERIAL}')`)
        .select(["deviceName", "id", "usersLoggedOn"])
        .get();

    return result.value && result.value.length > 0 ? result.value[0] : null;
}

// Third part
// Fetch username from the unusable user id
async function fetchUserName(USERIDS) {
    console.log("Parsing userids", USERIDS);
    const userNames = {};
    // Loop through every found userid to search for displayname
    for (const USERID of USERIDS) {
        try {
            const user = await _appClient
                .api(`/users/${USERID}`)
                .select(["displayName", "userPrincipalName"])
                .get();

            userNames[USERID] = user.displayName || user.userPrincipalName || "UNKNOWN USER";
        }
        catch (error) {
            console.log("Error fetching user for ID:", USERID, error);
            userNames[USERID] = "UNKNOWN USER";
        }
    } 
    return userNames;
}