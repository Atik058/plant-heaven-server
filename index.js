const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(express.json())
app.use(cors());

const db_user = "yatique26_db_user"
const db_password = "nINZ4etq5IPzhuHe"

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${db_user}:${db_password}@cluster0.uggs0gi.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const plant = {
    plantName: "Mango",
    category: "fruit",
    careLevel: "easy",
    healthStatus: 60
};

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const plantsCollection = client.db('plantDB').collection('plants');
        const usersCollection = client.db('plantDB').collection('users');



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


        app.get('/plants', async (req, res) => {
            const result = await plantsCollection.find().toArray();
            console.log(result)
            res.send(result);
        })

        app.post('/addplant', async (req, res) => {
            const newPlant = req.body
            console.log(newPlant)
            const result = await plantsCollection.insertOne(newPlant)
            res.send(result)
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Plant server 2');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});