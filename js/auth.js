export async function checkToken(URL_LOCATION) {

    // Define access token
    const ACCESS_TOKEN = "";

    const parseURL = URL_LOCATION.substring(URL_LOCATION.indexOf("?")+1);
    
    if (parseURL === ACCESS_TOKEN){
        console.log("[AUTH] Successful token attempt!");
        return true;
    } else {
        console.log("[AUTH] Invalid token attempt!");
        return false;
    }
}