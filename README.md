# BankCash Rewards Bank

![BankCash launch banner](public/assets/social/launch-banner.svg)

BankCash is a branded, wallet-connected rewards bank frontend built for the
Base community. The experience combines a premium vault-inspired interface
with daily rewards, fortune spins, missions, referrals, leaderboards, and
shareable identity cards.

## Official Links

| Destination | Link |
| --- | --- |
| Website | [https://bcash.fun/](https://bcash.fun/) |
| X / Twitter | [https://x.com/bankcash_](https://x.com/bankcash_) |
| Public source | [github.com/Bankcash2026/bankcash-web-public](https://github.com/Bankcash2026/bankcash-web-public) |

## Product Experience

BankCash is designed as a gamified rewards dashboard where a user can connect
an EVM wallet, sign in without sharing a password or seed phrase, and explore
reward-oriented product flows. The public frontend presents:

- A responsive landing page with official BankCash branding and animated visual accents.
- Wallet connection through RainbowKit and wagmi for Base-oriented interaction.
- A personal dashboard for reward status, points, streak progress, and rank display.
- A vault interface for BANKCASH deposit and withdrawal interactions when contracts are configured.
- A lucky spin experience with an animated prize wheel and reward result states.
- Missions, referrals, leaderboard views, and a shareable BankCash profile card.
- A docs route explaining user journeys, security assumptions, and reward mechanics.
- A social kit with official logo artwork plus X and launch banner templates.

## Brand And Visual Direction

The public identity is built around the official submitted blue BankCash mark.
The interface uses a dark navy vault-room palette, electric blue highlights,
glass panels, and subtle motion:

- official JPG logo assets for the header, footer, favicon, and social kit
- animated logo glow and a floating hero badge, with reduced-motion support
- custom public banner assets for X and launch announcements
- mobile-friendly header navigation and responsive hero composition

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing page and primary wallet entry point |
| `/dashboard` | User reward overview and activity entry points |
| `/vault` | Vault interaction experience |
| `/spin` | Fortune wheel and prize-result flow |
| `/missions` | Reward missions |
| `/leaderboard` | Rank and score visibility |
| `/referral` | Referral sharing flow |
| `/card` | Shareable BankCash identity card |
| `/docs` | Product and security documentation |
| `/social-kit` | Public social copy and visual assets |

## Technology

| Area | Technology |
| --- | --- |
| Framework | Next.js App Router |
| UI | React, Tailwind CSS, Framer Motion |
| Wallet UI | RainbowKit |
| Web3 client | wagmi and viem |
| Data state | Zustand and TanStack Query |
| Network target | Base-compatible configuration |
| Public CLI | Node.js read-only project and availability commands |

## Public Repository Scope

This repository is intentionally limited to the public browser-facing
frontend. It includes the pages, components, visual assets, contract ABI files
needed by client interactions, and example public environment configuration.

The following are intentionally not published here:

- backend implementation, server routes, database models, or production data
- VPS deployment scripts or infrastructure configuration
- Vercel project metadata and local deployment state
- `.env` files, secrets, tokens, private keys, passwords, or signing material
- build output, caches, or installed dependencies

## BankCash CLI

This repository includes a real command line interface for public BankCash
information and endpoint checks. It is intentionally read-only: it does not
request wallet private keys, sign transactions, or expose backend operations.

### Run The CLI

```bash
npm install
npm run cli -- help
npm run cli -- info
npm run cli -- links
npm run cli -- routes
npm run cli -- config
npm run cli -- status
```

To expose the `bankcash` command on the local machine:

```bash
npm link
bankcash info
bankcash links --json
bankcash status
bankcash open github
```

### CLI Commands

| Command | Purpose |
| --- | --- |
| `bankcash info` | Displays the public project summary and official links |
| `bankcash links` | Prints the website, X, and public GitHub links |
| `bankcash routes` | Lists public frontend routes and their purpose |
| `bankcash config` | Displays browser-visible Base network configuration names |
| `bankcash status` | Checks the public website and GitHub without failing the process |
| `bankcash check` | Exits non-zero when a public endpoint is unavailable |
| `bankcash open <website\|x\|github>` | Opens an official public destination |
| `--json` | Returns machine-readable output for supported commands |

Availability commands reflect current DNS and HTTP status. A custom domain
that is not yet configured will correctly be reported as unavailable.

## Local Development

Requirements:

- Node.js 20 or later
- npm
- a WalletConnect project ID for wallet connection testing
- a compatible API URL if testing authenticated and reward flows

```bash
npm install
copy .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

### Public Environment Configuration

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_BANKCASH_TOKEN_ADDRESS=
NEXT_PUBLIC_BANKCASH_VAULT_ADDRESS=
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_SITE_URL=https://bcash.fun
```

All values in this example file are browser-visible configuration. Production
secrets must never be placed in variables prefixed with `NEXT_PUBLIC_`.

## Available Scripts

```bash
npm run dev      # Start local development
npm run build    # Create an optimized production build
npm run start    # Run the production build locally
npm run cli      # Run the BankCash public CLI
npm run cli:smoke # Run read-only CLI smoke checks
```

## Security Boundary

The frontend is designed around wallet-signature authentication. Users should
never submit passwords, wallet private keys, or seed phrases through this
interface. Any real rewards accounting, rate limiting, authorization, contract
verification, or administrative operation must be enforced by the private
backend and/or on-chain contracts, not trusted to client code alone.

## Disclaimer

BankCash is a gamified crypto rewards interface. Content in this repository is
provided for the public web experience and does not constitute financial
advice. Review contract configuration and transaction details before signing
any wallet action.
