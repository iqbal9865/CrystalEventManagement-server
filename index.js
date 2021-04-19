const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sot4y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello World! My Mongo DB Server is Working!!')
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("crystalEvents").collection("services");
  const reviewsCollection = client.db("crystalEvents").collection("reviews");
  console.log('database connection successfully')

  app.get('/services', (req, res) => {
    servicesCollection.find()
    .toArray((err, items) => {
        res.send(items)
        console.log('from database', items)
    })
  })

  app.get('/review', (req, res) => {
    reviewsCollection.find()
    .toArray((err, items) => {
        res.send(items)
        console.log('from database', items)
    })
  })


  app.post('/addServices', (req,res) => {
      const service = req.body;
      servicesCollection.insertOne(service)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })
  
  app.post('/addReview', (req,res) => {
    const service = req.body;
    reviewsCollection.insertOne(service)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

app.delete('/delete/:id', (req, res) => {
  const id = ObjectID(req.params.id)
  console.log('delete this',id)
  servicesCollection.findOneAndDelete({_id: id})
  .then(documents => res.send(!!documents.value))
})


});

app.listen(process.env.PORT || port)