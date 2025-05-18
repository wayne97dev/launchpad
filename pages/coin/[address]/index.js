// pages/index.js
import WalletConnectionProvider from '@/components/WalletConnectionProvider';
import Navbar from '@/components/Navbar';
import CoinPage from '@/components/Trading';



export default function Home() {
  return (
    <WalletConnectionProvider>
      <Navbar />
      <div className="container mx-auto p-4">
        <CoinPage />

      </div>
    </WalletConnectionProvider>
  );
}
