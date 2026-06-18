"use client";

import { useAccount } from "wagmi";

export default function WalletPage() {
  const account = useAccount();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Wallet
      </h1>

      <p>{account.address}</p>
    </div>
  );
}
