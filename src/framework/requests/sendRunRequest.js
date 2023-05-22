import sendRequest from "../sendRequest";

export default async function sendRunRequest(code, input) {
  return await sendRequest(
    "execute", 
    "POST", 
    JSON.stringify({ "code": code, "input": input })
  );
}