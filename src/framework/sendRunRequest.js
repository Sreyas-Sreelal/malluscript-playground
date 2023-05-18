export default async function sendRunRequest(code,input)  {
    return await fetch("http://localhost:7000/execute", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "code": code, "input": input })
    });
}