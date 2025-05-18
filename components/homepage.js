// components/WalletButton.js
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MemeCard } from './memecard';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router'


export default function Homepage() {
  const { wallet, publicKey } = useWallet();
  const [tokenList , setTokenList] = useState([])
  const router = useRouter()
  const [contractAddress,setCA] = useState('')

  useEffect(() => {
    getTokens()
  }, [])


  const getTokens = async () => {
    const response = await fetch('/api/get-tokens')
    const tokens = await response.json()
    setTokenList(tokens.result)
    console.log(tokens.result)
  }

  return (
    <>
    <div className="min-h-screen bg-black text-white">


      {/* Scrollable Menu */}
      <div className="overflow-x-auto border-b border-gray-800">

      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-black tracking-wider">New Launches</h1>
          <Button className="bg-[#FFD700] text-black rounded-full px-6 py-2 hover:bg-[#FFE44D]" 
           onClick={() => router.push(`/create`)}
          >
            🚀 Start New Coin
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Input 
            className="w-full bg-[#222222] border-none h-12 pl-12"
            placeholder="Search by token contract address"
            onChange={(e) => setCA(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                router.push(`/coin/${contractAddress}`);
              }}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
        </div>

        {/* Stream/Following Tabs */}
        <div className="flex gap-4 mb-6">
          <Button className="bg-[#FFD700] text-black rounded-full">Stream</Button>
          <Button variant="outline" className="rounded-full">Following</Button>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-end gap-4 mb-6">
          <select className="bg-transparent">
            <option>Sort by: Bump order</option>
          </select>
          <select className="bg-transparent">
            <option>Order: Desc</option>
          </select>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokenList.map((token, index) => (
            <div 
              key={index} 
              onClick={() => router.push(`/coin/${token.token}`)}
              className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            >
              <MemeCard token={token}/>
            </div>
          ))}
        </div>
      </main>
    </div>
  </>
  );
}
