export default async function sendRequest(endPoint,method,body) {
    return await fetch(process.env.REACT_APP_BACKEND_URL+endPoint, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    });
}