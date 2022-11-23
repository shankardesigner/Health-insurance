// import storage from "./storage";
// import rootConstants from "../constants";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function authHeader(jsonType = true) {
  // const authDataString = (await storage.getItem(
  //   rootConstants.AUTH_STORE_KEY
  // )) as string;
  // const authData = JSON.parse(authDataString);
  // const { accessToken, tokenType } = authData;
  // const authorization = `${capitalizeFirstLetter(tokenType)} ${accessToken}`;
  const type = jsonType ? { "Content-Type": "application/json" } : {};
  // return { Authorization: authorization, ...type };

  return { ...type };
}
export default authHeader;
