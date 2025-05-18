// pages/index.js
import TokenForm from '../components/TokenForm';
import WalletConnectionProvider from '@/components/WalletConnectionProvider';
import Navbar from '../components/Navbar';


export default function Create() {
  return (
    <WalletConnectionProvider>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create Your Token</h1>
        <TokenForm />
      </div>
    </WalletConnectionProvider>
  );
}
