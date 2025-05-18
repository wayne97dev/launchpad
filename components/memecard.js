// components/MemeCard.js
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react";
import axios from "axios";


export function MemeCard(props) {
  const [tokenInfo , setTokenInfo] = useState({})

  const { token } = props;


  const getTokenPrice = () => {
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjYwYTc5MGEwLWZlY2QtNGVjNC05NzI3LWYxMGE4OTljMWE1MSIsIm9yZ0lkIjoiNDMzMzMyIiwidXNlcklkIjoiNDQ1NzU0IiwidHlwZUlkIjoiOGZmMTI1Y2UtYzA4Yy00MWZlLWEwNjQtN2UzOTIzODFlYzI2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDA0MTgyODIsImV4cCI6NDg5NjE3ODI4Mn0.cR6dBh3GkS1k1c0myIYjjHAfUcLjSMxf0k6yQpv1KiM'
    const options = {
      method: 'GET',
      url: `https://solana-gateway.moralis.io/token/mainnet/${token.token}/price`,
      headers: {
        'accept': 'application/json',
        'X-API-Key': apiKey
      }
    };
    
    axios.request(options)
      .then(function (response) {
        console.log(response.data);
        setTokenInfo({
          price : response.data.usdPrice
        })
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  useEffect(() => {
    getTokenPrice()
  }, [])
  

  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
    <div className="flex p-4 gap-4">
      <img 
        src={token.image}
        className="w-24 h-24 rounded-lg object-cover"
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">{token.name}</h3>
          <span className="text-sm text-gray-400">{token.ticker}</span>
        </div>
        <p className="text-tiny text-gray-400">{token.token}</p>
        <p className="text-sm mt-2">{token.description}</p>
        <div className="flex gap-4 mt-2">
        <span>Price: ${tokenInfo.price}</span>
         
        </div>
      </div>
    </div>
  </div>
  )
}
