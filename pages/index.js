// pages/index.js
import WalletConnectionProvider from '@/components/WalletConnectionProvider';
import Navbar from '../components/Navbar';
import Homepage from '@/components/homepage';


export default function Home() {
  return (
    <WalletConnectionProvider>
      <Navbar />      
      <Homepage />
    </WalletConnectionProvider>
  );
}
