#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { platform } from 'node:os';

const VERSION = '0.1.0';
const LINKS = {
  website: 'https://bcash.fun/',
  x: 'https://x.com/bankcash_',
  github: 'https://github.com/Bankcash2026/bankcash-web-public',
};
const ROUTES = [
  { path: '/', purpose: 'Product landing page and wallet entry' },
  { path: '/dashboard', purpose: 'Reward overview and activity' },
  { path: '/vault', purpose: 'Vault deposit and withdrawal experience' },
  { path: '/spin', purpose: 'Fortune wheel reward flow' },
  { path: '/missions', purpose: 'Reward missions' },
  { path: '/leaderboard', purpose: 'Rank and score visibility' },
  { path: '/referral', purpose: 'Referral sharing flow' },
  { path: '/card', purpose: 'Shareable BankCash card' },
  { path: '/docs', purpose: 'Product and security documentation' },
  { path: '/social-kit', purpose: 'Public copy and visual assets' },
];
const PUBLIC_CONFIG = {
  chain: 'Base',
  chainId: 8453,
  rpcFallback: 'https://mainnet.base.org',
  website: LINKS.website,
  environmentKeys: [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_CHAIN_ID',
    'NEXT_PUBLIC_BANKCASH_TOKEN_ADDRESS',
    'NEXT_PUBLIC_BANKCASH_VAULT_ADDRESS',
    'NEXT_PUBLIC_BASE_RPC_URL',
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
    'NEXT_PUBLIC_SITE_URL',
  ],
};

const args = process.argv.slice(2);
const json = args.includes('--json');
const positional = args.filter((arg) => arg !== '--json');
const command = positional[0] || 'help';

function print(data) {
  if (json) {
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
    return;
  }
  process.stdout.write(`${data}\n`);
}

function rows(entries) {
  return entries.map(([label, value]) => `${label.padEnd(14)} ${value}`).join('\n');
}

function help() {
  const data = {
    name: 'bankcash',
    version: VERSION,
    description: 'Read-only public CLI for BankCash Rewards Bank.',
    commands: {
      info: 'Display public project summary.',
      links: 'Display official website, X, and GitHub links.',
      routes: 'List frontend routes and their purpose.',
      config: 'Show public chain and configuration keys.',
      status: 'Probe the website and GitHub URLs without failing.',
      check: 'Probe public URLs and exit non-zero if a check fails.',
      open: 'Open one official link: website, x, or github.',
    },
    flags: {
      '--json': 'Return machine-readable JSON where supported.',
    },
  };
  if (json) {
    print(data);
    return;
  }
  print(`BankCash CLI v${VERSION}
Read-only public command line access to BankCash project information.

Usage:
  bankcash <command> [--json]

Commands:
  info            Display public project summary
  links           Display official links
  routes          List frontend routes
  config          Display public chain configuration
  status          Check public URLs without failing the command
  check           Check public URLs and fail if unavailable
  open <target>   Open website, x, or github
  help            Show this help text

Examples:
  bankcash info
  bankcash links --json
  bankcash status
  bankcash open github`);
}

function info() {
  const data = {
    project: 'BankCash Rewards Bank',
    network: 'Base',
    scope: 'Public frontend and read-only CLI',
    features: ['Rewards dashboard', 'Vault', 'Lucky Spin', 'Missions', 'Referrals', 'Leaderboard', 'Social Kit'],
    links: LINKS,
  };
  if (json) {
    print(data);
    return;
  }
  print(`BankCash Rewards Bank
Network:       Base
CLI scope:     Public information only; no wallet keys or transactions
Features:      ${data.features.join(', ')}

${rows(Object.entries(LINKS))}`);
}

function links() {
  if (json) {
    print(LINKS);
    return;
  }
  print(rows(Object.entries(LINKS)));
}

function routes() {
  if (json) {
    print(ROUTES);
    return;
  }
  print(ROUTES.map((route) => `${route.path.padEnd(16)} ${route.purpose}`).join('\n'));
}

function config() {
  if (json) {
    print(PUBLIC_CONFIG);
    return;
  }
  print(`Chain:         ${PUBLIC_CONFIG.chain}
Chain ID:      ${PUBLIC_CONFIG.chainId}
RPC fallback:  ${PUBLIC_CONFIG.rpcFallback}
Website:       ${PUBLIC_CONFIG.website}

Public environment keys:
${PUBLIC_CONFIG.environmentKeys.map((key) => `  - ${key}`).join('\n')}`);
}

async function requestStatus(label, url) {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(10000) });
    return {
      label,
      url,
      ok: response.ok,
      status: response.status,
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      label,
      url,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      latencyMs: Date.now() - startedAt,
    };
  }
}

async function status(failOnError) {
  const checks = await Promise.all([
    requestStatus('website', LINKS.website),
    requestStatus('github', LINKS.github),
  ]);
  const result = {
    project: 'BankCash Rewards Bank',
    checkedAt: new Date().toISOString(),
    healthy: checks.every((check) => check.ok),
    checks,
  };
  if (json) {
    print(result);
  } else {
    const display = checks.map((check) => {
      const state = check.ok ? `UP (${check.status})` : `DOWN (${check.error || check.status})`;
      return `${check.label.padEnd(14)} ${state} ${check.latencyMs}ms\n${''.padEnd(14)} ${check.url}`;
    });
    print(`${display.join('\n')}\n\nOverall: ${result.healthy ? 'HEALTHY' : 'DEGRADED'}`);
  }
  if (failOnError && !result.healthy) {
    process.exitCode = 1;
  }
}

function openLink(target) {
  if (!target || !Object.hasOwn(LINKS, target)) {
    process.stderr.write('Usage: bankcash open <website|x|github>\n');
    process.exitCode = 1;
    return;
  }
  const url = LINKS[target];
  const operatingSystem = platform();
  const commandName = operatingSystem === 'win32' ? 'cmd' : operatingSystem === 'darwin' ? 'open' : 'xdg-open';
  const commandArgs = operatingSystem === 'win32' ? ['/c', 'start', '', url] : [url];
  execFile(commandName, commandArgs, (error) => {
    if (error) {
      process.stderr.write(`Unable to open ${url}: ${error.message}\n`);
      process.exitCode = 1;
      return;
    }
    print(json ? { opened: target, url } : `Opened ${target}: ${url}`);
  });
}

switch (command) {
  case 'help':
  case '--help':
  case '-h':
    help();
    break;
  case 'version':
  case '--version':
  case '-v':
    print(json ? { version: VERSION } : VERSION);
    break;
  case 'info':
    info();
    break;
  case 'links':
    links();
    break;
  case 'routes':
    routes();
    break;
  case 'config':
    config();
    break;
  case 'status':
    await status(false);
    break;
  case 'check':
    await status(true);
    break;
  case 'open':
    openLink(positional[1]);
    break;
  default:
    process.stderr.write(`Unknown command: ${command}\n\n`);
    help();
    process.exitCode = 1;
}
