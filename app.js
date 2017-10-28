const express = require('express');
const app = express();
const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const url = "mongodb://127.0.0.1:27017/todoapp";
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;

app.use("/", express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.get('/tasks', function(req, res){
    mongoClient.connect(url, function(err, db) {
        if(!err) {
            let tasks = db.collection('tasks');
            tasks.find({}).toArray(function(err, response) {
                res.send(JSON.stringify(response));
            })
        }
    });
})

app.post('/tasks/new', function(req, res) {
    mongoClient.connect(url, function(err, db) {
        let tasks = db.collection('tasks');
        tasks.insert({
            timestamp: new Date(),
            description: req.body.description
        })
    });
}); 

app.put("/tasks/update/id", function(req, res){
    MongoClient.connect(url, function(err, db) {
        let tasks = db.collection('tasks');
        tasks.update({
            _id: new ObjectId(req.params.id)
        }, { $set: {
            description: req.body.description
        }})
    })
})

app.listen(3000);

// const app = express();
// const fs = require('file-system');
// const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());
