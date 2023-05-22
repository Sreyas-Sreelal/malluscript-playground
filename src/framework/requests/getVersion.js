import sendRequest from "../sendRequest";

export default async function getVersion()  {
    return await sendRequest("getversion","GET");
}