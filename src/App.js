import CodeEditor from '@uiw/react-textarea-code-editor';
import { useEffect, useState } from 'react';
import sendRunRequest from './framework/requests/sendRunRequest';
import { Alert, Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import getVersion from './framework/requests/getVersion';

export default function App() {
  const [code, setCode] = useState(
    `കാണിക്കുക "hello world!"; `
  );

  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [version, setVersion] = useState("");
  const [versionError, setVersionError] = useState("");

  useEffect(() => {
    const storedCode = sessionStorage.getItem("code")
    if (storedCode != null) {
      setCode(storedCode)
    }
  }, [])

  useEffect(() => {
    async function fetchVersion() {
      setVersionError("")
      const response = await getVersion();
      setVersion(response)
    }
    fetchVersion();

  }, [])

  async function sendRequest() {
    setError("");
    setOutput("");

    const response = await sendRunRequest(code, input)  
    setOutput(response)
  }

  function storeCode(event) {
    sessionStorage.setItem("code", event.target.value);
    setCode(event.target.value);
  }

  return (
    <Box>
      <Box textAlign={"center"}>
        <Typography variant='h3'>
          Malluscript Online Interpreter
        </Typography>
        <Typography variant='subtitle'>{version}</Typography>
        {versionError !== "" ?
          <Alert variant="filled" severity="error">
            {versionError}
          </Alert> : ''}
      </Box>
      <Box m={0.3} border={1} borderColor={"black"}>
        <Grid container>
          <Grid xs={12} item>
            <Box sx={{ backgroundColor: "#161b22" }}>
              <Box color="#061010">
                <Button variant='outlined' onClick={sendRequest}><PlayArrowIcon /></Button>
              </Box>
              <CodeEditor
                value={code}
                language="c"
                placeholder="Please enter Malluscript code."
                onChange={storeCode}
                padding={15}
                style={{
                  fontSize: 16,
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  maxHeight:300,
                  overflowY:"scroll"
                }}
                minHeight={300}
                minLength={300}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box ml={1} mr={1}>
        <Grid container spacing={2}>
          <Grid md={4} xs={12} item>
            <Typography variant='h6'> Input </Typography>
            <Box border={1} borderColor={"black"}>
              <TextField inputProps={{ style: { color: "white" } }} sx={{ height: "100%", width: "100%" }} multiline variant='filled' rows={10} onInput={(e) => setInput(e.target.value)} />
            </Box>
          </Grid>
          <Grid md={8} xs={12} item>
            <Typography variant='h6'> Output </Typography>
            <Box height={"89.3%"} sx={{ backgroundColor: "black", whiteSpace: "pre-line" }} color={"green"} border={'black'}>
              {error === "" ? output : <Alert variant="outlined" severity="error">
                {error}
              </Alert>}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box mt={0.7} textAlign={'center'}>
        <Link href='https://github.com/sreyas-sreelal/malluscript'>
          <Typography variant='subtitle'>Github Repository</Typography>
        </Link>
      </Box>
    </Box>
  );
}
