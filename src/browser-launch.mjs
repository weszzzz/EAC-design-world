import { existsSync } from 'node:fs';

// Chromium-family browser resolution shared by recording, template rendering and
// export. EAC_BROWSER always wins; otherwise the first browser that actually
// exists is used, Windows keeps its Edge channel, and every other platform
// falls back to the Chromium bundled with Playwright.
const CANDIDATES = [
  process.env.EAC_BROWSER,
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/microsoft-edge',
];

export function browserExecutablePath() {
  return CANDIDATES.find(candidate => candidate && existsSync(candidate)) ?? null;
}

export function browserLaunchOptions() {
  const executablePath = browserExecutablePath();
  if (executablePath) return { executablePath };
  return process.platform === 'win32' ? { channel: 'msedge' } : {};
}

export function browserDescription() {
  return browserExecutablePath()
    ?? (process.platform === 'win32' ? '配置 EAC_BROWSER 或安装 Edge' : 'Playwright 内置 Chromium');
}
