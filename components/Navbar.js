// components/Navbar.js
import { useWallet } from '@solana/wallet-adapter-react';

import WalletButton from './WalletButton';


export default function Navbar() {
  const { publicKey, connect, disconnect } = useWallet();

  

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-black text-white">
      <div className="flex items-center gap-2">
      <img src="/Logo.png" alt="Logo" className="h-8 w-8" />
        <span className="text-xl font-bold">SEND IT     CA:</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center px-4 py-2 rounded-lg bg-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Solana</span>
          </div>
        </div>

        <WalletButton />
      </div>
    </nav>
  );
}
