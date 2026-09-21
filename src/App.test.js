import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock CodeEditor since @uiw/react-textarea-code-editor uses ESM-only rehype
jest.mock('@uiw/react-textarea-code-editor', () => {
  return function MockCodeEditor(props) {
    return (
      <textarea
        data-testid="mock-code-editor"
        value={props.value}
        onChange={props.onChange}
      />
    );
  };
});

// Mock getVersion and sendRunRequest
jest.mock('./framework/requests/getVersion', () => () => Promise.resolve('3.0.0'));
jest.mock('./framework/requests/sendRunRequest', () => () => Promise.resolve('Hello output'));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ stargazers_count: 195 }),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders Malluscript Playground brand title', async () => {
  await act(async () => {
    render(<App />);
  });
  expect(screen.getByText(/Malluscript Playground/i)).toBeInTheDocument();
});

test('renders Output Console header and Run button', async () => {
  await act(async () => {
    render(<App />);
  });
  expect(screen.getByText(/Console Output/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
});

test('dynamically renders fetched GitHub star count in header', async () => {
  await act(async () => {
    render(<App />);
  });
  await waitFor(() => {
    expect(screen.getByText('195')).toBeInTheDocument();
  });
});
