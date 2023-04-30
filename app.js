// Import required modules
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

// Set up Express app
const app = express();

// Set up database connection
const uri = "mongodb+srv://jonneilomaki:Laurea123@datakanta.uvavvxu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
// Define routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
//Get route
app.get("/movies", (req, res) => {
  client.connect((err) => {
    if (err) throw err;
    const collection = client.db("sample_mflix").collection("movies");

    collection.find().toArray((err, movies) => {
      if (err) throw err;
      res.send(`
        <html>
          <head>
            <title>Movie</title>
          </head>
          <body>
            <h1>Movie</h1>
            <ul>
              ${movies.map((movie) => `<li>${movie.title}</li>`).join("")}
            </ul>
          </body>
        </html>
      `);
      client.close();
    });
  });
});
//Get route (id)
app.get("/movies/:id", (req, res) => {
  res.send("Hello, id!");
  const id = req.params.id;
  client.connect((err) => {
    if (err) throw err;
    const collection = client.db("sample_mflix").collection("movies");

    collection.findOne({ _id: ObjectId(id) }, (err, result) => {
      if (err) throw err;
      console.log(result);
      var html = parse(result);
      res.send(html);
      client.close();
    });
  });
});
//Post route
app.post("/movies/add", (req, res) => {
  res.send("Hello, World!");
  client.connect((err) => {
    if (err) throw err;
    const collection = client.db("sample_mflix").collection("movies");
    const movie = req.body;
    collection.insertOne(movie, (err, result) => {
      if (err) throw err;
      res.status(201).send(result.ops[0]);
      client.close();
    });
  });
});
//Put route
app.put("/movies/update/:id", (req, res) => {
  res.send("Hello, World!");
  client.connect((err) => {
    if (err) throw err;
    const collection = client.db("sample_mflix").collection("movies");
    const id = ObjectId(req.params.id);
    const update = req.body;
    collection.updateOne({ _id: id }, { $set: update }, (err, result) => {
      if (err) throw err;
      res.send(result);
      client.close();
    });
  });
});
//Delete route
app.delete("/movies/delete/:id", (req, res) => {
  res.send("Hello, World!");
  client.connect((err) => {
    if (err) throw err;
    const collection = client.db("sample_mflix").collection("movies");
    const id = ObjectId(req.params.id);
    collection.deleteOne({ _id: id }, (err, result) => {
      if (err) throw err;
      res.send(result);
      client.close();
    });
  });
});


// Start server
const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});