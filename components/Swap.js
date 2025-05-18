import { useState, useEffect } from 'react';
import { useWallet,useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL,PublicKey,VersionedTransaction,Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';



export default function TradingInterface({ tokenData }) {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [isBuy, setIsBuy] = useState(true);
    const [solAmount, setSolAmount] = useState('0.01');
    const [tokenAmount, setTokenAmount] = useState('1');
    const [quotation, setQuotation] = useState(0);
    const [tokenPrice, setTokenPrice] = useState(0);
    const [solBalance , setSolBalance] = useState('')
    const [tokenBalance , setTokenBalance] = useState('')

    const quickAmounts = [
        { label: '1 SOL', value: '1' },
        { label: '5 SOL', value: '5' },
        { label: '10 SOL', value: '10' }
    ];

    useEffect( () => {

        async function getBalances() {
            if (wallet.publicKey) {
                // Get SOL balance
                const balance = await connection.getBalance(wallet.publicKey);
                setSolBalance(balance / LAMPORTS_PER_SOL);
        
                // Get token balance (implement your token balance fetch)
                const tokenBalance = await getTokenBalance(
                    connection,
                    wallet.publicKey.toString(),
                    tokenData.contractAddress
                  );
                  setTokenBalance(tokenBalance);
              }
        }




        const fetchQuotation = async () => {
            try {
                const response = await fetch('https://api.diadata.org/v1/assetQuotation/Solana/0x0000000000000000000000000000000000000000');
                const data = await response.json();
                setQuotation(data.Price);
                // console.log(data)
            } catch (error) {
                console.error('Error fetching Solana quotation:', error);
            }
        };
        


        fetchQuotation();
        getBalances();

        const intervalId = setInterval(fetchQuotation, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [wallet.publicKey,tokenData.contractAddress,connection]);


  // Check if buy is possible
  const canBuy = () => {
    const amount = parseFloat(solAmount);
    const fees = 0.001; // Your transaction fees
    return amount + fees <= solBalance;
  };

   // Check if sell is possible
   const canSell = () => {
    const amount = parseFloat(tokenAmount);
    return amount <= tokenBalance;
  };


    const fetchTokenprice = async () => {
        try {
            const response = await fetch(`https://api.jup.ag/price/v2?ids=${tokenData.contractAddress},So11111111111111111111111111111111111111112`);
            const data = await response.json();
            setTokenPrice(data.data);
            console.log(data.data)
        } catch (error) {
            console.error('Error fetching Solana quotation:', error);
        }
    };

    const renderBuyInterface = () => (
        <>
            <div>
                <label className="text-gray-400 text-sm mb-1 block">Amount</label>
                <div className="bg-[#13141F] rounded-lg p-3 flex items-center">
                    <input
                        type="text"
                        value={solAmount}
                        onChange={(e) => setSolAmount(e.target.value)}
                        className="bg-transparent border-none flex-1 text-white"
                    />
                    <span className="text-white">SOL</span>
                </div>
            </div>



            <div className="flex gap-2">
                {quickAmounts.map((amount) => (
                    <button
                        key={amount.value}
                        onClick={() => setSolAmount(amount.value)}
                        className="flex-1 py-1 px-2 rounded bg-[#13141F] text-white text-sm hover:bg-opacity-80"
                    >
                        {amount.label}
                    </button>
                ))}
            </div>


                <button 
        className={`w-full py-3 ${
          canBuy() 
            ? 'bg-yellow-400 hover:bg-yellow-500' 
            : 'bg-gray-600 cursor-not-allowed'
        } text-black rounded-lg font-medium`}
        disabled={!canBuy()}
        onClick={() => {/* Implement buy logic */ buyToken(tokenData.contractAddress,solAmount,wallet,connection)}}
      >
        {canBuy() ? 'Buy' +' $' + tokenData?.symbol || 'TOKEN' : 'Insufficient Balance'} 
      </button>
        </>
    );

    const renderSellInterface = () => (
        <>
            <div>
                <label className="text-gray-400 text-sm mb-1 block">Amount</label>
                <div className="bg-[#13141F] rounded-lg p-3 flex items-center">
                    <input
                        type="text"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(e.target.value)}
                        className="bg-transparent border-none flex-1 text-white"
                    />
                    <span className="text-white">{tokenData?.symbol || ''}</span>
                </div>
            </div>


            {/* You can add quick token amount buttons here if needed */}

            <button 
        className={`w-full py-3 ${
          canSell() 
            ? 'bg-yellow-400 hover:bg-yellow-500' 
            : 'bg-gray-600 cursor-not-allowed'
        } text-black rounded-lg font-medium`}
        disabled={!canSell()}
        onClick={() => {/* Implement buy logic */ sellToken(tokenData.contractAddress,tokenAmount,wallet,connection)}}
      >
        {canSell() ? 'Sell' +' $' + tokenData?.symbol || 'TOKEN' : 'Insufficient Balance'} 
      </button>
        </>
    );

    const renderSOLPrice = () => (
        <>
            <div className="mt-4 text-sm text-gray-400">
                <div className="flex justify-between mb-1">
                    <span>{solAmount} SOL</span>
                    <span>≈ ${(parseFloat(solAmount) * quotation).toFixed(2)}</span>
                </div>
            </div>
        </>
    );

    const renderTokenPrice = () => (
        <>
            <div className="mt-4 text-sm text-gray-400">
                <div className="flex justify-between mb-1">
                    <span>{tokenAmount} {tokenData?.symbol || 'TOKEN'}</span>
                    <span>≈ ${(parseFloat(tokenAmount) * tokenData.price).toFixed(2)}</span>
                </div>
            </div>
        </>
    );

    return (
        <div className="bg-[#1C1D25] rounded-lg p-4 w-160 md:w-160 lg:w-160">
            <div className="flex gap-1 mb-6">
                <button
                    className={`flex-1 py-2 rounded-lg transition-colors ${isBuy ? 'bg-yellow-400 text-black' : 'bg-[#13141F] text-white'
                        }`}
                    onClick={() => setIsBuy(true)}
                >
                    Buy
                </button>
                <button
                    className={`flex-1 py-2 rounded-lg transition-colors ${!isBuy ? 'bg-yellow-400 text-black' : 'bg-[#13141F] text-white'
                        }`}
                    onClick={() => setIsBuy(false)}
                >
                    Sell
                </button>
            </div>

            <div className="space-y-4">
                {isBuy ? renderBuyInterface() : renderSellInterface()}
            </div>

            <div className="mt-4 text-sm text-gray-400">
                {isBuy ? renderSOLPrice() : renderTokenPrice()}
            </div>
        </div>
    );
}

async function buyToken(tokenToBuyCA, sellAmount, wallet, connection) {
    try {
        // Get the swap transaction
        const response = await fetch(`https://swap-v2.solanatracker.io/swap`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "from": 'So11111111111111111111111111111111111111112', // SOL mint address
                "to": tokenToBuyCA,
                "amount": sellAmount,
                "slippage": 15,
                "payer": wallet.publicKey.toString(),
                "priorityFee": 0.0005,
                "feeType": "add",
                "fee": "ABCzXPUZo6bBAxWQktW5KpTpqP2mbHWWgKG8cTatYNbR:0.01"
            })
        });

        if (response.status === 200) {
            const data = await response.json();
            const serializedTransaction = Buffer.from(data.txn, "base64");

            // Handle different transaction versions
            let transaction;
            if (data.type === 'v0') {
                transaction = VersionedTransaction.deserialize(serializedTransaction);
            } else {
                transaction = Transaction.from(serializedTransaction);
            }

            // Sign transaction
            const signedTx = await wallet.signTransaction(transaction);

            // Send and confirm transaction
            const signature = await connection.sendRawTransaction(signedTx.serialize(), {
                skipPreflight: true,
                maxRetries: 4,
            });

            // Wait for confirmation
            const latestBlockhash = await connection.getLatestBlockhash();
            const confirmation = await connection.confirmTransaction({
                signature,
                ...latestBlockhash
            }, 'confirmed');

            if (confirmation.value.err) {
                throw new Error(`Transaction failed: ${confirmation.value.err}`);
            }

            console.log("Transaction confirmed:", signature);
            return signature;
        } else {
            throw new Error(`Failed to fetch transaction: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Buy token error:', error);
        throw error;
    }
}


async function sellToken(tokenToBuyCA, buyAmount, wallet, connection) {
    try {
        // Get the swap transaction
        const response = await fetch(`https://swap-v2.solanatracker.io/swap`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "from": tokenToBuyCA, // SOL mint address
                "to":  'So11111111111111111111111111111111111111112',
                "amount": buyAmount,
                "slippage": 15,
                "payer": wallet.publicKey.toString(),
                "priorityFee": 0.0005,
                "feeType": "add",
                "fee": "ABCzXPUZo6bBAxWQktW5KpTpqP2mbHWWgKG8cTatYNbR:0.01"
            })
        });

        if (response.status === 200) {
            const data = await response.json();
            const serializedTransaction = Buffer.from(data.txn, "base64");

            // Handle different transaction versions
            let transaction;
            if (data.type === 'v0') {
                transaction = VersionedTransaction.deserialize(serializedTransaction);
            } else {
                transaction = Transaction.from(serializedTransaction);
            }

            // Sign transaction
            const signedTx = await wallet.signTransaction(transaction);

            // Send and confirm transaction
            const signature = await connection.sendRawTransaction(signedTx.serialize(), {
                skipPreflight: false,
                maxRetries: 4,
                preflightCommitment: 'confirmed'
            });

            // Wait for confirmation
            const latestBlockhash = await connection.getLatestBlockhash();
            const confirmation = await connection.confirmTransaction({
                signature,
                ...latestBlockhash
            }, 'confirmed');

            if (confirmation.value.err) {
                throw new Error(`Transaction failed: ${confirmation.value.err}`);
            }

            console.log("Transaction confirmed:", signature);
            return signature;
        } else {
            throw new Error(`Failed to fetch transaction: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Buy token error:', error);
        throw error;
    }
}

async function getTokenBalance(connection, walletAddress, tokenMintAddress) {
    try {
      // Get all token accounts for this wallet
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(walletAddress),
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );
  
      // Find the token account that matches our mint address
      const tokenAccount = tokenAccounts.value.find(
        account => account.account.data.parsed.info.mint === tokenMintAddress
      );
  
      if (!tokenAccount) {
        return 0;
      }
  
      // Return the balance
      return Number(tokenAccount.account.data.parsed.info.tokenAmount.amount) / 
             Math.pow(10, tokenAccount.account.data.parsed.info.tokenAmount.decimals);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  }