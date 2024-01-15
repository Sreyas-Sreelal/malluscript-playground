import init, { run_malluscript } from "../malluscript/malluscript_wasm.js";

export default async function sendRunRequest(code, input) {
  await init();
  let data = run_malluscript(code);
  return data;
}