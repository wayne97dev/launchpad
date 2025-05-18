// components/WalletButton.js
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WalletButton() {
  const { wallet, publicKey,disconnect } = useWallet();
  const { visible, setVisible } = useWalletModal();
  return (
    <div className="flex items-center gap-4">
 <button className=" rounded-lg border-[0.75px] border-[#FFD700] bg-[#FFD700] shadow-btn-inner text-[#000000] tracking-[0.32px] h-[42px] px-2 group relative ">
        {publicKey ? (
          <>
            <div className="flex mr-3 items-center justify-center text-[16px] lg:text-md">
              <div className="ml-3">
                {publicKey.toBase58().slice(0, 4)}....
                {publicKey.toBase58().slice(-4)}
              </div>
            </div>
            <div className="w-[200px] absolute right-0 top-10 hidden group-hover:block">
              <ul className="border-[0.75px] border-[#FFD700] rounded-lg bg-[#FFD700] p-2 ">
                <li>
                  <div
                    className="flex gap-2 items-center mb-1 text-primary-100 text-md tracking-[-0.32px]"
                    onClick={() => setVisible(true)}
                  >
                    Change Wallet
                  </div>
                </li>
                <li>
                  <div
                    className="flex gap-2 items-center text-primary-100 text-md tracking-[-0.32px]"
                    onClick={() => disconnect()}
                  >
                    Disconnect
                  </div>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div
            className="flex items-center justify-center gap-1 text-md"
            onClick={() => setVisible(true)}
          >
            Connect wallet
          </div>
        )}
      </button>
    </div>
  );
}
