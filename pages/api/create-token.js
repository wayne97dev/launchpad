// pages/api/create-coin.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
    const client = new MongoClient(uri);
    const db = client.db("wagmi");
  
    if (req.method === 'POST') {
      const { userWallet, walletToCopy, amount, tradeType, followSettings,tradeSettings,releaseData } = req.body;
      // Validate input and store copy trade details
      // Initialize tracking for the specified wallet
      console.log(releaseData)



      const newCoin = {
        creator: releaseData.publicKey,
        name: releaseData.name,
        ticker: releaseData.symbol,
        image: releaseData.image,
        description: releaseData.description,
        telegram : releaseData.telegram,
        twitter: releaseData.twitter,
        website: releaseData.website,
        token: releaseData.token,
        createdAt: new Date()
      };
      await db.collection("coins").insertOne(newCoin);
      res.status(201).json({ message: 'User created successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }

