// pages/api/setup-copy-trade.js
const { MongoClient } = require("mongodb");


const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
    const client = new MongoClient(uri);
    const db = client.db("wagmi");
    const collection = db.collection("coins");
    if (req.method === 'GET') {
      const result = await collection.find({}).toArray();
 
      res.status(201).json({ result });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
