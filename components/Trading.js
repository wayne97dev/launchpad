// pages/coin/[address].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWallet,useConnection } from '@solana/wallet-adapter-react'
import { usePathname } from "next/navigation";
import TradingInterface from './Swap'
import axios from 'axios'
import ThreadSection from './ThreadSection'



export default function CoinPage() {
const pathname = usePathname();
  const router = useRouter()
  const { address } = router.query
  const wallet = useWallet()
  const [amount, setAmount] = useState('0.01')
  const [tokenAmount, setTokenAmount] = useState('0')
  const [tokenInfo , setTokenInfo] = useState({})
  const [isFinished,setIF] = useState(false)

  
  useEffect(() => {
    if (router.isReady) {
        // Your logic using router.query
        getSolTokenInfo(address)
      }
  },[router.isReady])

  async function getTokenInfo() {
    const response = await fetch('https://mainnet.helius-rpc.com/?api-key=40b694c8-8e12-455f-8df5-38661891b200', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": "test",
          "method": "getAsset",
          "params": {
            "id": address
          }
        }),
    });
    const data = await response.json();
    console.log(data.result.token_info)
    setTokenInfo({
        symbol : data.result.token_info.symbol
    })

  }

  async function getSolTokenInfo(tokenAddress) {
  const apiKey = '90df4c1b-c03d-4ac2-a972-5d332577d525';

axios.get(`https://data.solanatracker.io/tokens/${tokenAddress}`, {
  headers: {
    'x-api-key': apiKey
  }
})
.then(response => {
  console.log(response.data);
  setTokenInfo({
    name : response.data.token.name,
    mktCap: response.data.pools[0].marketCap.usd,
    description: response.data.token.description,
    image: response.data.token.image,
    symbol: response.data.token.symbol,
    price :response.data.pools[0].price.usd,
    contractAddress: tokenAddress
})
})
.catch(error => {
  console.error('Error:', error);
});

  }



  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto p-4">
        {/* Token Info Header */}
        <div className="flex items-center gap-4 mb-8">
          <img 
            src={tokenInfo.image}
            alt="Token" 
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">{tokenInfo.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Symbol : {tokenInfo.symbol}</span>
              <span>Market cap: {formatAsDollars(tokenInfo.mktCap)}</span>
            </div>
          </div>
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
 {/* Chart Area */}
 <div className="lg:col-span-2 bg-[#1C1D25] rounded-lg p-4">
            <div className="relative w-full aspect-[2/1]">
              <iframe 
                src={`https://www.gmgn.cc/kline/sol/${address}`}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                style={{ border: 'none' }}
              />
            </div>
          </div>

          {/* Trade Card */}
          <Card className="bg-[#1C1D25] p-4">


          <TradingInterface tokenData={tokenInfo} />
           


            {/* Token Info */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-2">{tokenInfo.name}</h3>
              <p className="text-sm text-gray-400">
              {tokenInfo.description}
              </p>

            </div>
            
          </Card>

         
        </div>
        <br />
        
       
      </div>
      
    </div>
  )
}

function formatAsDollars(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }