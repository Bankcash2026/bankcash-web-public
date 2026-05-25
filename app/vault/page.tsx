'use client';
import { useEffect, useState, useCallback } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { NavBar } from '@/components/NavBar';
import { PageShell, PageHeading, StatCard, Card, RequireAuth, Spinner, num } from '@/components/ui';
import { api, ApiError } from '@/lib/api';
import { CONTRACTS, TOKEN_ABI, VAULT_ABI, isContractsConfigured } from '@/lib/contracts';

const DECIMALS = 18;

function VaultInner() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [data, setData] = useState<{ vaultBalance: string; txs: any[] } | null>(null);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState<'deposit' | 'withdraw' | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await api.vault());
    } catch (e) {
      setNote(e instanceof ApiError ? e.message : 'Failed to load vault');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const configured = isContractsConfigured();

  async function run(kind: 'deposit' | 'withdraw') {
    if (!amount || Number(amount) <= 0) return;
    setBusy(kind);
    setNote(null);
    try {
      const wei = parseUnits(amount, DECIMALS).toString();

      if (configured && address && publicClient) {
        // Real on-chain path: approve (deposit only) then call the vault, user-signed.
        if (kind === 'deposit') {
          const approveHash = await writeContractAsync({
            address: CONTRACTS.token,
            abi: TOKEN_ABI as any,
            functionName: 'approve',
            args: [CONTRACTS.vault, BigInt(wei)],
          });
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
        }
        const txHash = await writeContractAsync({
          address: CONTRACTS.vault,
          abi: VAULT_ABI as any,
          functionName: kind === 'deposit' ? 'deposit' : 'withdraw',
          args: [BigInt(wei)],
        });
        await publicClient.waitForTransactionReceipt({ hash: txHash });
        await (kind === 'deposit' ? api.logDeposit(wei, txHash) : api.logWithdraw(wei, txHash));
        setNote(`On-chain ${kind} confirmed.`);
      } else {
        // Contracts not deployed yet — log a placeholder tx hash so the flow is demonstrable end-to-end.
        const fakeHash = ('0x' + crypto.getRandomValues(new Uint8Array(32)).reduce((a, b) => a + b.toString(16).padStart(2, '0'), '')) as `0x${string}`;
        await (kind === 'deposit' ? api.logDeposit(wei, fakeHash) : api.logWithdraw(wei, fakeHash));
        setNote(`Demo ${kind} logged (contracts not yet deployed). Set NEXT_PUBLIC_BANKCASH_VAULT_ADDRESS for live txs.`);
      }
      setAmount('');
      await load();
    } catch (e: any) {
      setNote(e instanceof ApiError ? e.message : (e?.shortMessage ?? e?.message ?? 'Transaction failed'));
    } finally {
      setBusy(null);
    }
  }

  const userBal = data ? formatUnits(BigInt(data.vaultBalance || '0'), DECIMALS) : '0';

  return (
    <>
      <PageHeading
        kicker="Save Token"
        title="The Vault"
        sub="Deposit BANKCASH to stack your degen score and unlock ranks. Non-custodial — every transaction is signed by your wallet."
      />

      {!configured && (
        <div className="mb-6 rounded-xl border border-gold/25 bg-gold/[0.05] p-4 font-mono text-xs text-gold/80">
          Contracts not configured. The vault runs in demo-logging mode until NEXT_PUBLIC_BANKCASH_TOKEN_ADDRESS /
          NEXT_PUBLIC_BANKCASH_VAULT_ADDRESS are set — then deposits/withdrawals become real on-chain, user-signed txs.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Your Vault Balance" value={`${num(userBal)}`} accent="neon" hint="BANKCASH" />
        <StatCard label="Est. APY" value="12.4%" accent="gold" hint="placeholder" />
        <StatCard label="Total Value Locked" value="—" accent="electric" hint="reads from contract when live" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="section-label">Deposit / Withdraw</p>
          <div className="mt-4">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              inputMode="decimal"
              placeholder="0.00"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-lg text-white outline-none focus:border-neon/40"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={() => run('deposit')} disabled={!!busy} className="btn-neon flex-1 disabled:opacity-40">
                {busy === 'deposit' ? 'Depositing…' : 'Deposit'}
              </button>
              <button onClick={() => run('withdraw')} disabled={!!busy} className="btn-ghost flex-1 disabled:opacity-40">
                {busy === 'withdraw' ? 'Withdrawing…' : 'Withdraw'}
              </button>
            </div>
            {note && <p className="mt-4 font-mono text-xs text-white/55">{note}</p>}
          </div>
        </Card>

        <Card>
          <p className="section-label">Transaction History</p>
          <div className="mt-4 space-y-2">
            {!data && <Spinner />}
            {data?.txs?.length === 0 && <p className="font-mono text-sm text-white/40">No transactions yet.</p>}
            {data?.txs?.slice(0, 8).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2">
                <div>
                  <span className={`font-mono text-xs uppercase ${t.kind === 'DEPOSIT' ? 'text-neon' : 'text-gold'}`}>
                    {t.kind}
                  </span>
                  <p className="font-mono text-xs text-white/40">{new Date(t.createdAt).toLocaleString()}</p>
                </div>
                <span className="stat-num text-sm text-white/80">{num(formatUnits(BigInt(t.amount || '0'), DECIMALS))}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

export default function VaultPage() {
  return (
    <>
      <NavBar />
      <PageShell>
        <RequireAuth>
          <VaultInner />
        </RequireAuth>
      </PageShell>
    </>
  );
}
