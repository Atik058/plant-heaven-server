const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
app.use(express.json())
app.use(cors());
require('dotenv').config()



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.uggs0gi.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



let plantsCollection;
let usersCollection;
let isConnected = false;

async function connectDB() {
    if (isConnected) return;

    await client.connect();

    plantsCollection = client.db('plantDB').collection('plants');
    usersCollection = client.db('plantDB').collection('users');

    isConnected = true;
}

app.use(async (req,res,next)=>{
    try{
        await connectDB();
        next();
    }
    catch(error){
        console.log(error);
        res.status(500).send("Database connection failed");
    }
});

app.get('/testin2', (req, res) => {
    res.send('Plant server test in under db');
});

console.log("Route 2 registered");

// // Send a ping to confirm a successful connection
// await client.db("admin").command({ ping: 1 });
// console.log("Pinged your deployment. You successfully connected to MongoDB!");


// app.get('/plants', async (req, res) => {
//     const result = await plantsCollection.find().toArray();
//     console.log(result)
//     res.send(result);
// })

app.get('/my-plants/:email', async (req, res) => {
    const userEmail = req.params.email;
    const result = await plantsCollection.find({ userEmail }).toArray();
    console.log(result)
    res.send(result);
})

app.post('/addplant', async (req, res) => {
    const newPlant = req.body
    console.log(newPlant)
    const result = await plantsCollection.insertOne(newPlant)
    res.send(result)
})

app.post('/adduser', async (req, res) => {
    const newUser = req.body
    console.log(newUser)
    const result = await usersCollection.insertOne(newUser)
    res.send(result)
})

app.get('/plant/:id', async (req, res) => {
    const id = req.params.id;
    const projection = { _id: new ObjectId(id) }
    const result = await plantsCollection.findOne(projection)
    console.log(result)
    res.send(result);
})

app.get('/user/:email', async (req, res) => {
    const email = req.params.email;
    const projection = { email: email }
    const result = await usersCollection.findOne(projection)
    console.log(result)
    res.send(result);
})

app.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const updatedPlant = req.body;
    const updateDocument = {
        $set: updatedPlant
    };
    const options = { upsert: true };
    const result = await plantsCollection.updateOne(filter, updateDocument, options);
    res.send(result)
})

app.delete('/plant/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await plantsCollection.deleteOne(query);
    res.send(result)
})

app.get('/plants', async (req, res) => {
    const { sortBy } = req.query;

    let result;

    if (sortBy === 'health') {
        result = await plantsCollection
            .aggregate([
                {
                    $sort: {
                        // nextWateredDate: 1,
                        healthStatus: -1
                    }
                }
            ])
            .toArray();
    }
    else if (sortBy === 'date') {
        result = await plantsCollection
            .aggregate([
                {
                    $sort: {
                        nextWateredDate: 1,
                        // healthStatus: -1
                    }
                }
            ])
            .toArray();
    }
    else {
        result = await plantsCollection
            .find()
            .toArray();
    }

    res.send(result);
});

// async function run() {
//     try {
//         console.log("Before route 1");

//         app.get('/testin', (req, res) => {
//             res.send('Plant server test in');
//         });

//         console.log("Before Mongo");
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();

//         const plantsCollection = client.db('plantDB').collection('plants');
//         const usersCollection = client.db('plantDB').collection('users');


//         console.log("Mongo connected");

//     } finally {
//         // Ensures that the client will close when you finish/error
//         // await client.close();
//     }
// }

// run().catch(err => {
//     console.error("RUN ERROR:", err);
// });



app.get('/', (req, res) => {
    res.send('Plant server 2');
});

app.get('/testout', (req, res) => {
    res.send('Plant server test out');
});

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
// });

module.exports = app;