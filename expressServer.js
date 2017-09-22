'use strict';
//set up express
let express = require('express');
let app = express();
let port = process.env.PORT || 8000;
let bp = require('body-parser')

//set up file system
let fs = require('fs');
let path = require('path');
let petsPath = path.join(__dirname, 'pets.json');

//removes from header so client can't tell express is being used
app.disable('x-powered-by');

//sets up a parser for incoming json data
let jsonParser = bp.json()

//if requesting all pets
app.get('/pets', function( req, res) {
  let petsData = readData('./pets.json', 'utf-8');
  petsData.then(function(result) {
    let pets = parseData(result);
    res.set('Content-Type', 'application/json')
    res.send(pets);
  })
})

//if requesting a specific pet
app.get('/pets/:id', function( req, res) {
  let petsData = readData('./pets.json', 'utf-8');
  petsData.then(function(result) {
    let pets = parseData(result);
    let id = Number.parseInt(req.params.id);
    checkID(pets,res,id);
  })
})

app.post('/pets', jsonParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  else {
    let petsData = readData('./pets.json', 'utf-8');
    petsData.then(function(result) {
      let pets = parseData(result);
      pets.push(req.body);
      let writeReady = JSON.stringify(pets)
      //console.log(pets);
      writeData('./pets.json', writeReady);
      //res.set('Content-Type', 'application/json')
      res.send(pets);
    })

  }
})

//if request is incorrect
app.use(function(req, res) {
  res.sendStatus(404);
});

//listen on port
app.listen(port, function(){
  console.log('listening on port', port);
});

//reads the json file
function readData(file, encoding) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, encoding, function(err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

//parses the json file
function parseData(result) {
  return JSON.parse(result);
}

//makes sure the id is right and responds accordingly
function checkID(data,response,ID) {
  if (ID < 0 || ID >= data.length || Number.isNaN(ID)) {
    return response.sendStatus(404).set('Content-Type', 'text/plain').send('Not Found');
  }
  else {
  response.set('Content-Type', 'application/json').send(data[ID])
  }
}

//write to file
function writeData(file, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(file, data, function(err, data) {
      if (err) return reject(err)
      console.log('data is written');
    })
  })
}

module.exports = app;
