// components/TokenForm.js
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { pinFileToIPFS, pinJSONToIPFS } from '@/utils/pinata';
import { Keypair,VersionedTransaction } from "@solana/web3.js";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair,sol } from '@metaplex-foundation/umi'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
import TransactionModal from './TransactionModal';
import axios from 'axios';
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { TokenStandard, createAndMint, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'




const umi = createUmi('https://mainnet.helius-rpc.com/?api-key=40b694c8-8e12-455f-8df5-38661891b200');




export default function TokenForm() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, disconnect, connect, signMessage } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    description: '',
    image: null,
    telegram:'',
    twitter:'',
    website:'',
    devBuy:0.1
  });
  const { releaseData, updateReleaseData } = useState();


  const [isUploading, setIsUploading] = useState(false);

  const [extraDetails, setExtraDetails] = useState(false);

  const [devBuy,setDevBuy] = useState(0.1)

  const [showModal, setShowModal] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [status, setStatus] = useState('processing')

  async function findSPLTokenContractAddress(transactionSignature) {



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
        return mintInfo;
      } catch (error) {
        console.error('Error:', error.message);
      }
  }
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wallet.connected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      setShowModal(true)

              const mint = generateSigner(umi);
              umi.use(walletAdapterIdentity(wallet))
              umi.use(mplTokenMetadata())
      

      
      
       // Upload image to IPFS
        const imageUrl = await pinFileToIPFS(formData.image);

       /*
       // Create and pin metadata JSON
       const metadata = {
         name: formData.name,
         symbol: formData.symbol,
         description: formData.description,
         image: imageUrl
       };
       
       const metadataUrl = await pinJSONToIPFS(metadata);
       */


       
    await transferSol(umi, {
        destination: 'ABCzXPUZo6bBAxWQktW5KpTpqP2mbHWWgKG8cTatYNbR',
        amount: sol(0.01),
    }).sendAndConfirm(umi).then(async () => {
      const result = await sendLocalCreateTx(formData,connection,imageUrl,wallet)
      console.log('Token created: ' + result) ;
      const tokenCAFromTxn = await findSPLTokenContractAddress(result)
      handlePost(imageUrl,tokenCAFromTxn)
      setTxHash(result)
      setStatus('completed')
    })
  


       

       /*
      const result = await createToken(
        connection,
        wallet,
        formData,
        metadataUrl
      );
      */

    } catch (error) {
      console.error('Failed to create token:', error);
      // Show error message
      setShowModal(false)
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { checked } = e.target
    setExtraDetails(checked)
    console.log(checked)
  }

  const handlePost = async (imgURL,tokenCA) => {
    try {
                // Prepare data for Firebase
                const releaseData = {
                  ...formData,
                  publicKey: publicKey.toBase58(),
                  imageURL: imgURL,
                  token: tokenCA
                };
          
                const response = await axios.post('http://localhost:3002/api/create-token', { releaseData });
                return response.data;
              } catch (error) {
                console.error('Error uploading media:', error);
                throw error;
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-[#FFD700]">name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-transparent border border-gray-700 rounded-lg p-2"
        />
      </div>

      <div>
        <label className="text-[#FFD700]">ticker</label>
        <div className="flex">
          <span className="p-2 bg-transparent border border-gray-700 rounded-l-lg">$</span>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) => setFormData({...formData, symbol: e.target.value})}
            className="w-full bg-transparent border border-gray-700 rounded-r-lg p-2"
          />
        </div>
      </div>

      <div>
        <label className="text-[#FFD700]">description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full bg-transparent border border-gray-700 rounded-lg p-2"
        />
      </div>

      <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
        <input
          type="file"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
          accept="image/*"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          {formData.image ? (
            <img 
              src={URL.createObjectURL(formData.image)} 
              alt="Preview" 
              className="max-h-40 mx-auto"
            />
          ) : (
            <div>
              <span className="block">drag and drop an image or video</span>
              <button type="button" className="mt-2 text-sm text-[#FFD700]">
                select file
              </button>
            </div>
          )}
        </label>
      </div>


        <div className="flex">
          <span className=" bg-transparent">Extra Details ? (Twitter , Telegram , Website)</span>
          <input
            type="checkbox"
            onChange={e => handleChange(e)}
            defaultChecked={extraDetails}
            className="bg-transparent border border-gray-700 rounded-r-lg w-10 "
          />
        </div>

        {extraDetails 
        
        ?  
        <>    
        <div>
        <label className="text-[#FFD700]">Twitter</label>
        <input
          type="text"
          value={formData.twitter}
          onChange={(e) => setFormData({...formData, twitter: e.target.value})}
          className="w-full bg-transparent border border-gray-700 rounded-lg p-2"
        />
      </div>

        <div>
        <label className="text-[#FFD700]">Telegram</label>
        <input
          type="text"
          value={formData.telegram}
          onChange={(e) => setFormData({...formData, telegram: e.target.value})}
          className="w-full bg-transparent border border-gray-700 rounded-lg p-2"
        />
      </div>

      <div>
        <label className="text-[#FFD700]">Website</label>
        <input
          type="text"
          value={formData.website}
          onChange={(e) => setFormData({...formData, website: e.target.value})}
          className="w-full bg-transparent border border-gray-700 rounded-lg p-2"
        />
      </div>
        </>
        : <span></span>}



      <div>
        <label className="text-[#FFD700]">Amount To Buy / Snipe</label>
        <div className="flex">
          <span className="p-2 bg-transparent border border-gray-700 rounded-l-lg">SOL</span>
          <input
          type="text"
          value={formData.devBuy}
          onChange={(e) => setFormData({...formData, devBuy: e.target.value})}
          className="w-full bg-transparent border border-gray-700 rounded-r-lg p-2"
        />
        </div>
      </div>

      

      <button
        type="submit"
        disabled={isUploading}
        
        className="w-full bg-[#FFD700] hover:bg-blue-700 text-black rounded-lg p-3"
      >
        {isUploading ? 'Creating...' : 'create coin'}
      </button>
    </form>
    <TransactionModal 
      isOpen={showModal} 
      txHash={txHash}
      status={status}
    />
    </>
  );
}

async function sendLocalCreateTx(tokenMetadata,connection,pinataImageURL,wallet) {
  

     // Generate a random keypair for token
     const mintKeypair = Keypair.generate(); 



    // Create IPFS metadata storage
    // Create and pin metadata JSON
       const metadata = {
        name: tokenMetadata.name,
        symbol: tokenMetadata.symbol,
        description: tokenMetadata.description,
        image: pinataImageURL,
        twitter: tokenMetadata.twitter,
        telegram: tokenMetadata.telegram,
        website:tokenMetadata.website,
        showName : tokenMetadata.showName
      };
      
      const metadataUrl = await pinJSONToIPFS(metadata);



      // Get the create transaction
      const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "publicKey": wallet.publicKey,
            "action": "create",
            "tokenMetadata": {
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadataUrl
            },
            "mint": mintKeypair.publicKey.toBase58(),
            "denominatedInSol": "true",
            "amount": tokenMetadata.devBuy, // dev buy of 0.01 SOL
            "slippage": 10, 
            "priorityFee": 0.001,
            "pool": "pump"
        })
    });

    if (response.status === 200) {
      const data = await response.arrayBuffer();
      const tx = VersionedTransaction.deserialize(new Uint8Array(data));

     // Sign with mintKeypair first
     tx.sign([mintKeypair]);
      
     // Then get Phantom wallet signature
     const signedTx = await wallet.signTransaction(tx);

     // Send transaction
     const signature = await connection.sendTransaction(signedTx, {
       skipPreflight: false,
       maxRetries: 3,
       preflightCommitment: 'confirmed',
     });

     // Wait for confirmation with timeout
     const latestBlockhash = await connection.getLatestBlockhash();
     const confirmation = await connection.confirmTransaction({
       signature,
       ...latestBlockhash
     }, 'confirmed');

     if (confirmation.value.err) {
       throw new Error(`Transaction failed: ${confirmation.value.err}`);
     }

     return signature;
  } else {
      console.log(response.statusText);
  }
}

