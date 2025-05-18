// components/TransactionModal.js
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'
import { useWallet,useConnection } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TokenInstructions }  from '@solana/spl-token'



export default function TransactionModal({ isOpen, txHash,status }) {
    const router = useRouter()
    const { connection } = useConnection();


    async function findSPLTokenContractAddress() {

        const transactionSignature =  txHash

        // Initialize connection to Solana mainnet

        try {
            const transaction = await connection.getParsedTransaction(transactionSignature, {
              maxSupportedTransactionVersion: 0
            });
        
            if (!transaction || !transaction.meta || !transaction.meta.innerInstructions) {
              throw new Error('Transaction not found or does not contain inner instructions');
            }
        
            //console.log(transaction.transaction.message.instructions[3].parsed.info.mint)

            // Find the Pump.fun: create instruction (assumed to be the 4th instruction, index 3)
            const pumpFunInstruction = transaction.transaction.message.instructions[3];
        
            if (!pumpFunInstruction) {
              throw new Error('Pump.fun: create instruction not found');
            }
        
            // Parse the instruction data to find the mint information
            const mintInfo = pumpFunInstruction.parsed.info.mint
        
            if (!mintInfo) {
              throw new Error('Mint information not found in the instruction data');
            }
        
            //console.log('Mint address:', mintInfo);
            //return mintInfo;
            router.push(`https://wagmi-lac.vercel.app/coin/${mintInfo}`)
          } catch (error) {
            console.error('Error:', error.message);
          }
      }

  function handleClick() {
    const transHash =  "4MnnE7MtNmmupN1fAzBzkBsfUriqgUZifnyhGWre32cFvrNLjczbP17KTzrQxWPTpAuUDfcxDQGPeo3ZhGHYEPn3"
    findSPLTokenContractAddress(
       transHash
      )
  }
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-[#1C1D25] rounded-lg p-6 w-[400px] text-center">
          {status === 'processing' ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium">Creating Token</h3>
              <p className="text-gray-400 mt-2">Please wait while we process your transaction</p>
            </>
          ) : (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="mt-4 text-lg font-medium">Token Created!</h3>
              <p className="text-gray-400 mt-2">Your token has been created successfully</p>
              <Button 
                className="mt-4 bg-yellow-400 text-black hover:bg-yellow-500"
                onClick={() =>  findSPLTokenContractAddress()}
              >
                View Token
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }