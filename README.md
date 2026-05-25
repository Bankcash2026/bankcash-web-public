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
