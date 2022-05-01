const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require('express/lib/response')
const { del } = require('express/lib/application')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.heruk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('database connect')

async function run () {
  try{
    await client.connect();
    const userCollection = client.db("userCrud").collection("users");

    // post API
    app.post('/user',async(req,res) =>{
      const userId = req.body;
      const result = await userCollection.insertOne(userId);
      res.send(result)
    })

    // Get API
    app.get('/user', async(req,res)=>{
      const query = {}
      const cursor = userCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // Delete API
    app.delete('/user/:id',async(req,res) =>{
      const deleteId = req.params.id;
      const query = {_id:ObjectId(deleteId)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    // Get API
    app.get('/user/:id',async(req,res)=>{
      const getId = req.params.id;
      const query = {_id: ObjectId(getId)}
      const result = await userCollection.findOne(query)
      res.send(result)
    })

    // Put API
    app.put('/user/:id',async(req,res) => {
      const putId = req.params.id;
      const updateUser = req.body;
      const filter = {_id:ObjectId(putId)};
      const options = { upsert: true };
      const updateDoc = {
        $set:{
          name: updateUser.name,
          email: updateUser.email
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result)

    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})