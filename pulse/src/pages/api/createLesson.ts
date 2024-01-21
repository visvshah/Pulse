// @ts-nocheck
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    const uri = 'mongodb+srv://test:123@pulse.9xncclo.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection string
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('pulsedb');
        const collection = database.collection('lessons');

        // Assuming the data to be inserted is present in the request body
        const requestData = req.body;
        console.log(requestData)
        // Perform the POST request data insertion
        const result = await collection.insertOne(requestData);
        console.log(`Inserted document with _id: ${result.insertedId}`);

        res.status(201).json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}