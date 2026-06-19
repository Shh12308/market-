"use client";

import { useAccount } from "wagmi";

export default function WalletPage() {
  const { address, isConnected } = useAccount();

  return (
    <div>
      <h1>Wallet</h1>

      {isConnected ? (
        <p>Connected: {address}</p>
      ) : (
        <p>Not connected</p>
      )}
    </div>
  );
}
