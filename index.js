const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_PASS);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dp83dff.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();

     const musicCollection = client.db('musicSite').collection('musics');
    //  
    app.get('/musics', async(req, res)=>{
        const result = await musicCollection.find().toArray();
        res.send(result);
    })
    
    
    

    app.post('/musics', async(req, res)=>{
        const toy = req.body;
        const result = await musicCollection.insertMany(toy);
        res.send(result);
    })
    app.get('/search/:title', async(req,res)=>{
        const result = await musicCollection.find({title: {$regex: req.params.title, $options: 'i'}}).toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('music server is running.......')
})

app.listen(port, () => {
    console.log(`music Server is running on port ${port}`)
})