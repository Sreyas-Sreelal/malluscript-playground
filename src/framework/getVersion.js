export default async function getVersion()  {
    return await fetch("http://localhost:7000/getversion");
}