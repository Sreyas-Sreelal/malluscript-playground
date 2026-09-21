import CodeEditor from '@uiw/react-textarea-code-editor';
import { useEffect, useState, useRef, useMemo } from 'react';
import sendRunRequest from './framework/requests/sendRunRequest';
import getVersion from './framework/requests/getVersion';
import theme from './theme';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Button,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
  Paper,
  CircularProgress,
  Collapse,
  Container,
  Grid,
  Slide,
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import RotateLeftRoundedIcon from '@mui/icons-material/RotateLeftRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

const SAMPLES = [
  {
    id: 'hello',
    title: 'Hello World (നമസ്കാരം ലോകമേ)',
    desc: 'Basic printing and greeting output in Malayalam',
    code: `// Malluscript Hello World Example
"നമസ്കാരം ലോകമേ!\\n" കാണിക്കുക;
"Malluscript v3.0 WebAssembly Engine Active\\n" കാണിക്കുക;
`
  },
  {
    id: 'math',
    title: 'Variables & Math (കൂട്ടലും കിഴിക്കലും)',
    desc: 'Arithmetic expressions, variables, and string concatenation',
    code: `// Variables & Arithmetic
a = 15;
b = 27;
sum = a + b;
diff = b - a;
prod = a * b;

"a = " + a + ", b = " + b + "\\n" കാണിക്കുക;
"ആകെ തുക (Sum): " + sum + "\\n" കാണിക്കുക;
"വ്യത്യാസം (Difference): " + diff + "\\n" കാണിക്കുക;
"ഗുണനഫലം (Product): " + prod + "\\n" കാണിക്കുക;
`
  },
  {
    id: 'loop',
    title: 'Loop Counter (ആവർത്തനം)',
    desc: 'While-loop using Malluscript grammar and accumulator',
    code: `// Loop Counter (Counts 1 to 5)
i = 1;
ആകെ = 0;

i നെകാൾ 6 വലുതാണ് എങ്കിൽ ആവർത്തിക്കുക {
    "ഘട്ടം: " + i + "\\n" കാണിക്കുക;
    ആകെ = ആകെ + i;
    i = i + 1;
}

"ആകെ മൊത്തം: " + ആകെ + "\\n" കാണിക്കുക;
`
  },
  {
    id: 'prime',
    title: 'Prime Number Test (പ്രൈം നമ്പർ)',
    desc: 'Conditional checking with modulus and boolean flags',
    code: `// Prime Number Verification
നമ്പർ = 17;
i = 2;
പ്രൈം_ആണ് = 1;

i നെകാൾ (നമ്പർ / 2) + 1 വലുതാണ് എങ്കിൽ ആവർത്തിക്കുക {
    നമ്പർ % i ഉം 0 ഉം തുല്യമാണ് എങ്കിൽ {
        പ്രൈം_ആണ് = 0;
    }
    i = i + 1;
}

"പരിശോധിച്ച നമ്പർ: " + നമ്പർ + "\\n" കാണിക്കുക;
പ്രൈം_ആണ് ഉം 1 ഉം തുല്യമാണ് എങ്കിൽ {
    "ഫലം: പ്രൈം നമ്പർ ആണ്!\\n" കാണിക്കുക;
} അതല്ലെങ്കിൽ {
    "ഫലം: പ്രൈം നമ്പർ അല്ല\\n" കാണിക്കുക;
}
`
  },
  {
    id: 'fib',
    title: 'Fibonacci Sequence (ഫിബൊനാച്ചി)',
    desc: 'Generate Fibonacci numbers using iterative state swaps',
    code: `// Fibonacci Sequence Generator
ആദ്യം = 0;
രണ്ടാമത് = 1;
കൗണ്ട് = 8;

"ഫിബൊനാച്ചി ശ്രേണി:\\n" കാണിക്കുക;

0 നെകാൾ കൗണ്ട് വലുതാണ് എങ്കിൽ ആവർത്തിക്കുക {
    ആദ്യം + " " കാണിക്കുക;
    അടുത്തത് = ആദ്യം + രണ്ടാമത്;
    ആദ്യം = രണ്ടാമത്;
    രണ്ടാമത് = അടുത്തത്;
    കൗണ്ട് = കൗണ്ട് - 1;
}
"\\n" കാണിക്കുക;
`
  }
];

const KEYWORD_GROUPS = [
  {
    category: 'വാചകങ്ങൾ (Statements)',
    items: [
      { label: 'കാണിക്കുക;', insert: ' കാണിക്കുക;\n', desc: 'Print output / display value' },
      { label: 'എഴുതുക;', insert: ' എഴുതുക;\n', desc: 'Write output (alternative to കാണിക്കുക)' },
    ]
  },
  {
    category: 'നിബന്ധനകൾ (Conditions)',
    items: [
      { label: 'എങ്കിൽ { }', insert: ' എങ്കിൽ {\n    \n}', desc: 'If block' },
      { label: 'അതല്ലെങ്കിൽ { }', insert: ' അതല്ലെങ്കിൽ {\n    \n}', desc: 'Else block' },
      { label: 'ഉം', insert: ' ഉം ', desc: 'Conjunction particle (and/with)' },
    ]
  },
  {
    category: 'ആവർത്തനം (Loops)',
    items: [
      { label: '... വലുതാണ് എങ്കിൽ ആവർത്തിക്കുക { }', insert: ' നെകാൾ  വലുതാണ് എങ്കിൽ ആവർത്തിക്കുക {\n    \n}', desc: 'While loop' },
    ]
  },
  {
    category: 'താരതമ്യം (Comparisons)',
    items: [
      { label: 'തുല്യമാണ്', insert: ' തുല്യമാണ് ', desc: 'Equals (==)' },
      { label: 'തുല്യമല്ല', insert: ' തുല്യമല്ല ', desc: 'Not equals (!=)' },
      { label: 'നെകാൾ', insert: ' നെകാൾ ', desc: 'Comparison particle ("than")' },
      { label: 'വലുതാണ്', insert: ' വലുതാണ് ', desc: 'Greater than' },
      { label: 'ചെറുതാണ്', insert: ' ചെറുതാണ് ', desc: 'Less than' },
    ]
  },
  {
    category: 'Manglish (മംഗ്ലീഷ്)',
    items: [
      { label: 'kanikuga;', insert: ' kanikuga;\n', desc: 'Print in Manglish' },
      { label: 'enkil { }', insert: ' enkil {\n    \n}', desc: 'If in Manglish' },
      { label: 'athallenkil { }', insert: ' athallenkil {\n    \n}', desc: 'Else in Manglish' },
      { label: 'thulyamann', insert: ' thulyamann ', desc: 'Equals in Manglish' },
    ]
  }
];

export default function App() {
  const [code, setCode] = useState(SAMPLES[0].code);
  const [selectedSample, setSelectedSample] = useState(SAMPLES[0].id);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const [version, setVersion] = useState("");
  const [versionError, setVersionError] = useState("");
  const [execTime, setExecTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [showKeywords, setShowKeywords] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [starCount, setStarCount] = useState(() => {
    return sessionStorage.getItem("malluscript_stars") || "190";
  });
  const [showStarPrompt, setShowStarPrompt] = useState(false);

  const editorContainerRef = useRef(null);

  useEffect(() => {
    const storedCode = sessionStorage.getItem("code");
    if (storedCode != null && storedCode.trim()) {
      setCode(storedCode);
    }
  }, []);

  useEffect(() => {
    async function fetchVersion() {
      setVersionError("");
      try {
        const response = await getVersion();
        setVersion(response);
      } catch (err) {
        setVersionError(String(err));
      }
    }
    fetchVersion();
  }, []);

  // Dynamically fetch live GitHub star count
  useEffect(() => {
    async function fetchStars() {
      try {
        const response = await fetch("https://api.github.com/repos/sreyas-sreelal/malluscript");
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.stargazers_count === "number") {
            const countStr = String(data.stargazers_count);
            setStarCount(countStr);
            sessionStorage.setItem("malluscript_stars", countStr);
          }
        }
      } catch (err) {
        // Fallback silently
      }
    }
    fetchStars();
  }, []);

  // Display star incentive prompt after user spends time exploring
  useEffect(() => {
    const dismissed = localStorage.getItem("malluscript_star_prompt_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowStarPrompt(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Calculate line count and character count for status
  const { lineCount, charCount } = useMemo(() => {
    const lines = code ? code.split('\n').length : 0;
    const chars = code ? code.length : 0;
    return { lineCount: lines, charCount: chars };
  }, [code]);

  async function sendRequest(codeToRun) {
    const targetCode = typeof codeToRun === 'string' ? codeToRun : code;
    if (!targetCode.trim()) return;

    setError("");
    setOutput("");
    setIsRunning(true);
    setHasExecuted(true);

    const start = performance.now();
    try {
      const response = await sendRunRequest(targetCode);
      const elapsed = (performance.now() - start).toFixed(2);
      setExecTime(elapsed);
      setOutput(response);

      // Prompt user to star repo on successful execution
      const dismissed = localStorage.getItem("malluscript_star_prompt_dismissed");
      if (!dismissed) {
        setTimeout(() => setShowStarPrompt(true), 1200);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setIsRunning(false);
    }
  }

  function handleDismissStar(permanent = true) {
    setShowStarPrompt(false);
    if (permanent) {
      localStorage.setItem("malluscript_star_prompt_dismissed", "true");
    }
  }

  function handleStarClick() {
    handleDismissStar(true);
    window.open("https://github.com/sreyas-sreelal/malluscript", "_blank", "noopener,noreferrer");
  }

  function storeCode(event) {
    sessionStorage.setItem("code", event.target.value);
    setCode(event.target.value);
  }

  function handleSelectSample(e) {
    const id = e.target.value;
    setSelectedSample(id);
    const sample = SAMPLES.find(s => s.id === id);
    if (sample) {
      setCode(sample.code);
      sessionStorage.setItem("code", sample.code);
      sendRequest(sample.code);
    }
  }

  function handleReset() {
    const sample = SAMPLES.find(s => s.id === selectedSample) || SAMPLES[0];
    setCode(sample.code);
    sessionStorage.setItem("code", sample.code);
    sendRequest(sample.code);
  }

  function handleClear() {
    setCode("");
    setOutput("");
    setError("");
    setExecTime(null);
    setHasExecuted(false);
    sessionStorage.removeItem("code");
  }

  function handleInsertKeyword(keyword) {
    setCode(prev => {
      const updated = prev + keyword;
      sessionStorage.setItem("code", updated);
      return updated;
    });
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(code);
    setToastMessage("Code copied to clipboard!");
  }

  function handleCopyOutput() {
    const textToCopy = error || output;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setToastMessage("Output copied to clipboard!");
    }
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      sendRequest();
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0c0a09' }}>
        
        {/* Top Workbench Header */}
        <Box
          component="header"
          sx={{
            px: { xs: 2, sm: 3 },
            py: 1.5,
            backgroundColor: '#161210',
            borderBottom: '2px solid #2e2520',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          {/* Brand Mark & Title */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '4px',
                backgroundColor: '#261f1a',
                border: '1px solid #c87a3e',
                boxShadow: '0 2px 0 #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f5efe6',
                fontWeight: 800,
                fontSize: 22,
                fontFamily: "'Anek Malayalam', 'Manjari', sans-serif",
              }}
            >
              മ
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h6"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: '#fcfbf9',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: { xs: '1.05rem', sm: '1.2rem' },
                    letterSpacing: '-0.02em',
                  }}
                >
                  Malluscript Playground
                </Typography>
                <Chip
                  label={`v${version || '3.0.0'} WASM`}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: '#241c17',
                    color: '#dd9257',
                    border: '1px solid #4a3a2e',
                    borderRadius: '3px',
                  }}
                />
              </Stack>
              <Typography variant="caption" sx={{ color: '#a89b8c', display: 'block', letterSpacing: '0.01em' }}>
                Malayalam Scripting Language · Craft WebAssembly Workbench
              </Typography>
            </Box>
          </Stack>

          {/* Quick Actions & Links */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              size="small"
              variant="outlined"
              startIcon={<HelpOutlineRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={() => setGuideOpen(true)}
              sx={{
                fontSize: '0.82rem',
                borderColor: '#382f28',
                color: '#f5efe6',
                backgroundColor: '#1c1613',
                '&:hover': { borderColor: '#c87a3e', backgroundColor: '#261e19' }
              }}
            >
              Syntax Guide
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<GitHubIcon sx={{ fontSize: 16 }} />}
              href="https://github.com/sreyas-sreelal/malluscript"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontSize: '0.82rem',
                borderColor: '#382f28',
                color: '#f5efe6',
                backgroundColor: '#1c1613',
                display: 'inline-flex',
                alignItems: 'center',
                '&:hover': { borderColor: '#c87a3e', backgroundColor: '#261e19' }
              }}
            >
              GitHub
              <Box
                component="span"
                sx={{
                  ml: 0.8,
                  px: 0.7,
                  py: 0.1,
                  borderRadius: '3px',
                  backgroundColor: '#2a2019',
                  color: '#dd9257',
                  border: '1px solid #4d3a2c',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.3,
                }}
              >
                <StarRoundedIcon sx={{ fontSize: 13, color: '#dd9257' }} />
                {starCount}
              </Box>
            </Button>
          </Stack>
        </Box>

        {/* Global Error Banner if version check fails */}
        {versionError && (
          <Alert severity="error" sx={{ borderRadius: 0, backgroundColor: '#2a1513', borderBottom: '1px solid #e05244' }}>
            {versionError}
          </Alert>
        )}

        {/* Main Content Area */}
        <Container maxWidth="xl" sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Action Control Deck */}
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              mb: 1.5,
              borderRadius: '4px',
              border: '1px solid #2e2520',
              backgroundColor: '#181412',
              boxShadow: '0 2px 0 #000000',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            {/* Example Selector */}
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 280, md: 320 } }}>
              <InputLabel id="sample-select-label" sx={{ color: '#a89b8c', '&.Mui-focused': { color: '#dd9257' } }}>
                Select Example Code
              </InputLabel>
              <Select
                labelId="sample-select-label"
                value={selectedSample}
                label="Select Example Code"
                onChange={handleSelectSample}
                sx={{
                  backgroundColor: '#100d0c',
                  fontSize: '0.88rem',
                }}
              >
                {SAMPLES.map(sample => (
                  <MenuItem key={sample.id} value={sample.id}>
                    <Box sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#fcfbf9' }}>
                        {sample.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#a89b8c', display: 'block' }}>
                        {sample.desc}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Action Buttons */}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
              <Button
                variant="contained"
                color="primary"
                startIcon={isRunning ? <CircularProgress size={16} color="inherit" /> : <PlayArrowRoundedIcon />}
                onClick={() => sendRequest()}
                disabled={isRunning}
                sx={{
                  px: 2.4,
                  py: 0.9,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '0.02em',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {isRunning ? 'Executing...' : 'RUN'}
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    px: 0.7,
                    py: 0.2,
                    fontSize: '0.72rem',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: '2px',
                    color: '#f5efe6',
                    display: { xs: 'none', sm: 'inline-block' },
                  }}
                >
                  Ctrl+Enter
                </Box>
              </Button>

              <Tooltip title="Reset code to selected sample defaults">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RotateLeftRoundedIcon sx={{ fontSize: 16 }} />}
                  onClick={handleReset}
                  sx={{ py: 0.8 }}
                >
                  Reset
                </Button>
              </Tooltip>

              <Tooltip title="Clear current editor code">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />}
                  onClick={handleClear}
                  sx={{
                    py: 0.8,
                    borderColor: '#382f28',
                    color: '#e8a598',
                    '&:hover': {
                      borderColor: '#e05244',
                      backgroundColor: 'rgba(224, 82, 68, 0.1)',
                    },
                  }}
                >
                  Clear
                </Button>
              </Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: '#2e2520', display: { xs: 'none', sm: 'block' } }} />

              <Button
                variant="text"
                size="small"
                startIcon={<TuneRoundedIcon sx={{ fontSize: 16 }} />}
                endIcon={showKeywords ? <ExpandLessRoundedIcon sx={{ fontSize: 16 }} /> : <ExpandMoreRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={() => setShowKeywords(prev => !prev)}
                sx={{
                  color: '#a89b8c',
                  fontSize: '0.82rem',
                  '&:hover': { color: '#fcfbf9', backgroundColor: '#241e1a' },
                }}
              >
                {showKeywords ? 'Hide Typecase' : 'Typecase (കട്ടപ്പെട്ടി)'}
              </Button>
            </Stack>
          </Paper>

          {/* The Malayalam Typecase (Letterpress Drawer) */}
          <Collapse in={showKeywords}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                mb: 1.5,
                borderRadius: '4px',
                border: '1px solid #2e2520',
                backgroundColor: '#161210',
                boxShadow: '0 2px 0 #000000',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 6, height: 6, backgroundColor: '#c87a3e', borderRadius: '1px' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#dd9257', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Malayalam Movable Typecase (Click to insert token)
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#7a6e63', display: { xs: 'none', sm: 'block' } }}>
                  Hover blocks for grammatical notes
                </Typography>
              </Box>

              <Grid container spacing={1.2}>
                {KEYWORD_GROUPS.map((group, idx) => (
                  <Grid item xs={12} sm={6} md={idx === 4 ? 12 : 3} lg={idx === 4 ? 2.4 : 2.4} key={idx}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '3px',
                        backgroundColor: '#100d0c',
                        border: '1px solid #261f1a',
                        height: '100%',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#a89b8c', display: 'block', mb: 0.8, fontSize: '0.72rem' }}>
                        {group.category}
                      </Typography>
                      <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
                        {group.items.map((item, itemIdx) => (
                          <Tooltip key={itemIdx} title={item.desc} arrow placement="top">
                            <Chip
                              label={item.label}
                              size="small"
                              onClick={() => handleInsertKeyword(item.insert)}
                              clickable
                              sx={{
                                fontSize: '0.78rem',
                                fontFamily: "'Anek Malayalam', 'JetBrains Mono', monospace",
                                backgroundColor: '#1c1613',
                                border: '1px solid #382e27',
                                color: '#f5efe6',
                                cursor: 'pointer',
                                transition: 'all 0.1s ease',
                                '&:hover': {
                                  backgroundColor: '#2b211b',
                                  borderColor: '#c87a3e',
                                  color: '#dd9257',
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 2px 0 #000000',
                                },
                                '&:active': {
                                  transform: 'translateY(1px)',
                                  boxShadow: 'none',
                                }
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Collapse>

          {/* Workbench Split Workspace */}
          <Grid container spacing={2} sx={{ flex: 1, alignItems: 'stretch' }} onKeyDown={handleKeyDown}>
            
            {/* Left Pane: Manuscript Editor */}
            <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  borderRadius: '4px',
                  border: '1px solid #2e2520',
                  backgroundColor: '#161210',
                  boxShadow: '0 2px 0 #000000',
                  overflow: 'hidden',
                }}
              >
                {/* Editor Header */}
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: '#161210',
                    borderBottom: '1px solid #2e2520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.3,
                        borderRadius: '3px',
                        backgroundColor: '#100d0c',
                        border: '1px solid #382e27',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.8,
                      }}
                    >
                      <CodeRoundedIcon sx={{ fontSize: 15, color: '#c87a3e' }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#fcfbf9', fontFamily: 'monospace' }}>
                        main.ms
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#a89b8c', fontSize: '0.75rem' }}>
                      {lineCount} {lineCount === 1 ? 'line' : 'lines'} · {charCount} chars
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Copy code to clipboard">
                      <IconButton size="small" onClick={handleCopyCode} sx={{ color: '#a89b8c', '&:hover': { color: '#fcfbf9' } }}>
                        <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>

                {/* Editor Surface */}
                <Box
                  ref={editorContainerRef}
                  sx={{
                    flex: 1,
                    backgroundColor: '#0c0a09',
                    minHeight: { xs: 320, md: 460 },
                    maxHeight: { xs: 450, md: 620 },
                    overflow: 'auto',
                    position: 'relative',
                  }}
                >
                  <CodeEditor
                    value={code}
                    language="c"
                    placeholder={'// Write your Malluscript code here... (e.g. "നമസ്കാരം" കാണിക്കുക;)'}
                    onChange={storeCode}
                    padding={18}
                    style={{
                      fontSize: 14.5,
                      backgroundColor: 'transparent',
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Anek Malayalam', 'Manjari', monospace",
                      lineHeight: 1.65,
                      minHeight: '100%',
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Right Pane: Print Readout Console */}
            <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  borderRadius: '4px',
                  border: '1px solid #2e2520',
                  backgroundColor: '#161210',
                  boxShadow: '0 2px 0 #000000',
                  overflow: 'hidden',
                }}
              >
                {/* Terminal Header */}
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: '#161210',
                    borderBottom: '1px solid #2e2520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <TerminalRoundedIcon sx={{ fontSize: 18, color: '#a89b8c' }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#fcfbf9', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Console Output
                      </Typography>
                    </Stack>

                    {/* Status Indicator */}
                    {isRunning ? (
                      <Chip
                        icon={<CircularProgress size={12} color="inherit" />}
                        label="Executing"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(200, 122, 62, 0.2)',
                          color: '#dd9257',
                          border: '1px solid rgba(200, 122, 62, 0.4)',
                          borderRadius: '3px',
                        }}
                      />
                    ) : error ? (
                      <Chip
                        icon={<ErrorOutlineRoundedIcon sx={{ '&&': { color: '#eb776b', fontSize: 14 } }} />}
                        label="Error"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(224, 82, 68, 0.2)',
                          color: '#eb776b',
                          border: '1px solid rgba(224, 82, 68, 0.4)',
                          borderRadius: '3px',
                        }}
                      />
                    ) : hasExecuted ? (
                      <Chip
                        icon={<CheckCircleOutlineRoundedIcon sx={{ '&&': { color: '#7fc489', fontSize: 14 } }} />}
                        label="Success"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(102, 170, 112, 0.2)',
                          color: '#7fc489',
                          border: '1px solid rgba(102, 170, 112, 0.4)',
                          borderRadius: '3px',
                        }}
                      />
                    ) : (
                      <Chip
                        label="Ready"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          backgroundColor: '#201a16',
                          color: '#a89b8c',
                          borderRadius: '3px',
                        }}
                      />
                    )}
                  </Stack>

                  {/* Execution Stats & Actions */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    {execTime && !isRunning && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#dd9257',
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          fontSize: '0.74rem',
                          backgroundColor: '#261c16',
                          px: 0.9,
                          py: 0.2,
                          borderRadius: '3px',
                          border: '1px solid #4a382b',
                        }}
                      >
                        ⚡ {execTime}ms
                      </Typography>
                    )}

                    {(output || error) && (
                      <Tooltip title="Copy console output">
                        <IconButton size="small" onClick={handleCopyOutput} sx={{ color: '#a89b8c', '&:hover': { color: '#fcfbf9' } }}>
                          <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    )}

                    {(output || error) && (
                      <Tooltip title="Clear console output">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setOutput("");
                            setError("");
                            setExecTime(null);
                            setHasExecuted(false);
                          }}
                          sx={{ color: '#a89b8c', '&:hover': { color: '#fcfbf9' } }}
                        >
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Box>

                {/* Print Readout Surface */}
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: '#070605',
                    p: 2,
                    minHeight: { xs: 240, md: 460 },
                    maxHeight: { xs: 350, md: 620 },
                    overflow: 'auto',
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: '#f5efe6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {error ? (
                    <Box sx={{ color: '#eb776b' }}>
                      <Typography variant="caption" sx={{ color: '#eb776b', fontWeight: 700, display: 'block', mb: 0.5, letterSpacing: '0.05em' }}>
                        [പിശക് / RUNTIME ERROR]
                      </Typography>
                      {error}
                    </Box>
                  ) : output ? (
                    <Box sx={{ color: '#fcfbf9' }}>
                      {output}
                    </Box>
                  ) : (
                    <Box sx={{ color: '#54463c', userSelect: 'none', fontStyle: 'italic', display: 'flex', flexDirection: 'column', gap: 1, pt: 1 }}>
                      <Typography variant="body2" sx={{ color: '#7a6a5d', fontFamily: 'inherit' }}>
                        ❯ Malluscript WebAssembly Engine v{version || '3.0.0'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#54463c', fontFamily: 'inherit' }}>
                        ❯ Click <Box component="span" sx={{ color: '#c87a3e', fontWeight: 700 }}>"RUN"</Box> or hit <Box component="span" sx={{ color: '#c87a3e', fontWeight: 700 }}>Ctrl+Enter</Box> to compile and execute your program.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 1.5,
            px: 2,
            borderTop: '1px solid #221c17',
            backgroundColor: '#0c0a09',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#7a6a5d' }}>
            Malluscript is crafted by{' '}
            <Box
              component="a"
              href="https://github.com/sreyas-sreelal"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#c87a3e', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Sreyas Sreelal
            </Box>
            {' · '}Open Source on{' '}
            <Box
              component="a"
              href="https://github.com/sreyas-sreelal/malluscript"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#c87a3e', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              GitHub (★ {starCount})
            </Box>
          </Typography>
        </Box>

        {/* Syntax Manual Modal */}
        <Dialog
          open={guideOpen}
          onClose={() => setGuideOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: '#161210',
              border: '1px solid #3d322a',
              borderRadius: '4px',
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2e2520' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CodeRoundedIcon sx={{ color: '#c87a3e' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#fcfbf9', fontFamily: "'Space Grotesk', sans-serif" }}>
                Malluscript Quick Reference Manual
              </Typography>
            </Stack>
            <Chip label="v3.0.0" size="small" sx={{ backgroundColor: '#241d18', color: '#dd9257', borderRadius: '3px' }} />
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#dd9257', fontWeight: 700, mb: 0.5 }}>
                  1. Printing Output (ഔട്ട്പുട്ട്)
                </Typography>
                <Typography variant="body2" sx={{ color: '#a89b8c', mb: 1 }}>
                  Use <code>കാണിക്കുക;</code> or <code>എഴുതുക;</code> (Manglish: <code>kanikuga;</code>) followed by a semicolon.
                </Typography>
                <Paper sx={{ p: 1.5, backgroundColor: '#0c0a09', border: '1px solid #2e2520', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {`"നമസ്കാരം ലോകമേ!\\n" കാണിക്കുക;`}
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#dd9257', fontWeight: 700, mb: 0.5 }}>
                  2. Variables & Math (വേരിയബിളുകളും ഗണിതവും)
                </Typography>
                <Typography variant="body2" sx={{ color: '#a89b8c', mb: 1 }}>
                  Assign variables with <code>=</code> and use <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code>.
                </Typography>
                <Paper sx={{ p: 1.5, backgroundColor: '#0c0a09', border: '1px solid #2e2520', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {`തുക = 10 + 25;\n"ആകെ: " + തുക + "\\n" കാണിക്കുക;`}
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#dd9257', fontWeight: 700, mb: 0.5 }}>
                  3. Conditions (നിബന്ധനകൾ)
                </Typography>
                <Typography variant="body2" sx={{ color: '#a89b8c', mb: 1 }}>
                  Comparisons use Malayalam particles: <code>തുല്യമാണ്</code> (==), <code>തുല്യമല്ല</code> (!=), <code>എങ്കിൽ</code> (if), <code>അതല്ലെങ്കിൽ</code> (else).
                </Typography>
                <Paper sx={{ p: 1.5, backgroundColor: '#0c0a09', border: '1px solid #2e2520', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {`നമ്പർ ഉം 10 ഉം തുല്യമാണ് എങ്കിൽ {\n    "തുല്യമാണ്!\\n" കാണിക്കുക;\n} അതല്ലെങ്കിൽ {\n    "തുല്യമല്ല!\\n" കാണിക്കുക;\n}`}
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#dd9257', fontWeight: 700, mb: 0.5 }}>
                  4. Loops (ആവർത്തനം)
                </Typography>
                <Typography variant="body2" sx={{ color: '#a89b8c', mb: 1 }}>
                  Loops use <code>... എങ്കിൽ ആവർത്തിക്കുക &#123; &#125;</code> combined with comparison particles like <code>നെകാൾ ... വലുതാണ്</code>.
                </Typography>
                <Paper sx={{ p: 1.5, backgroundColor: '#0c0a09', border: '1px solid #2e2520', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {`i = 1;\ni നെകാൾ 6 വലുതാണ് എങ്കിൽ ആവർത്തിക്കുക {\n    "കൗണ്ട്: " + i + "\\n" കാണിക്കുക;\n    i = i + 1;\n}`}
                </Paper>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #2e2520' }}>
            <Button variant="contained" color="primary" onClick={() => setGuideOpen(false)}>
              Got it!
            </Button>
          </DialogActions>
        </Dialog>

        {/* Toast Notification */}
        <Snackbar
          open={Boolean(toastMessage)}
          autoHideDuration={2500}
          onClose={() => setToastMessage("")}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setToastMessage("")}
            severity="success"
            sx={{
              backgroundColor: '#c87a3e',
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(0,0,0,0.8)',
              borderRadius: '4px',
              '& .MuiAlert-icon': { color: '#ffffff' }
            }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>

        {/* Creative Artisanal Star Stamp ("ഒരു സ്റ്റാർ ഇട്ടേച്ചും പോ അളിയാ! ⭐") */}
        <Slide direction="up" in={showStarPrompt} mountOnEnter unmountOnExit>
          <Paper
            elevation={6}
            sx={{
              position: 'fixed',
              bottom: { xs: 16, sm: 24 },
              right: { xs: 16, sm: 24 },
              zIndex: 1300,
              maxWidth: { xs: 'calc(100% - 32px)', sm: 380 },
              p: 2,
              borderRadius: '4px',
              backgroundColor: '#1a1411',
              border: '2px solid #c87a3e',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.9), 0 0 20px rgba(200, 122, 62, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '3px',
                    backgroundColor: '#2e2017',
                    border: '1px solid #c87a3e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#dd9257',
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fcfbf9', lineHeight: 1.2, fontFamily: "'Anek Malayalam', sans-serif" }}>
                    ഒരു സ്റ്റാർ ഇട്ടേച്ചും പോ അളിയാ! ⭐
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#a89b8c', fontSize: '0.72rem' }}>
                    Support Malayalam Open-Source
                  </Typography>
                </Box>
              </Stack>
              <IconButton
                size="small"
                onClick={() => handleDismissStar(true)}
                sx={{ color: '#a89b8c', ml: 1, '&:hover': { color: '#fcfbf9' } }}
                aria-label="Dismiss recommendation"
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

            <Typography variant="body2" sx={{ color: '#eae2d9', fontSize: '0.84rem', mb: 2, lineHeight: 1.5 }}>
              If you appreciate a programming language built in Malayalam, drop a star on the GitHub repo. It helps the compiler grow and reach more developers!
            </Typography>

            <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
              <Button
                size="small"
                variant="text"
                onClick={() => handleDismissStar(true)}
                sx={{ color: '#a89b8c', fontSize: '0.8rem', '&:hover': { color: '#fcfbf9' } }}
              >
                പിന്നീട് ആവാം / Later
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<StarRoundedIcon sx={{ color: '#ffffff' }} />}
                onClick={handleStarClick}
                sx={{
                  backgroundColor: '#c87a3e',
                  color: '#ffffff',
                  border: '1px solid #dd9257',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 0 #733c14',
                  '&:hover': {
                    backgroundColor: '#b86b32',
                    boxShadow: '0 1px 0 #733c14',
                  },
                }}
              >
                Star on GitHub ({starCount}★)
              </Button>
            </Stack>
          </Paper>
        </Slide>

      </Box>
    </ThemeProvider>
  );
}
