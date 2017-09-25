'use strict';
//set up express
let express = require('express');
let app = express();
let port = process.env.PORT || 8000;

//set up middleware
let bp = require('body-parser');
let morgan = require('morgan');

//set up file system
let fs = require('fs');
let path = require('path');
let petsPath = path.join(__dirname, 'pets.json');

//removes from header so client can't tell express is being used
app.disable('x-powered-by');

//set up a parser for incoming json data
let jsonParser = bp.json();

//set up morgan logs
morgan('combined');

//get all the pets
app.get('/pets', function(req, res) {
  let petsData = readData('./pets.json', 'utf-8');
  petsData.then(function(result) {
    let pets = parseData(result);
    res.set('Content-Type', 'application/json');
    res.send(pets);
  })
})

//get a specific pets
app.get('/pets/:id', function( req, res) {
  let petsData = readData('./pets.json', 'utf-8');
  petsData.then(function(result) {
    let pets = parseData(result);
    let id = Number.parseInt(req.params.id);
    if (checkID(pets,res,id)) {
      res.set('Content-Type', 'application/json').send(pets[id]);
    }
    else {
      return res.sendStatus(404).set('Content-Type', 'text/plain').send('Not Found');
    }
  })
})

//add a pet
app.post('/pets', jsonParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400).set('Content-Type', 'text/plain'); //bad request
  }
  //if there are not 3 properties given
   else if (Object.keys(req.body).length != 3) {
    return res.sendStatus(400).set('Content-Type', 'text/plain'); //bad request
   }
  //if not every property has a given value
   else if (Object.values(req.body).length !== Object.keys(req.body).length) {
     return res.sendStatus(400).set('Content-Type', 'text/plain') //bad request
   }
  else {
    let petsData = readData('./pets.json', 'utf-8');
    petsData.then(function(result) {
      let pets = parseData(result);
      pets.push(req.body);
      let writeReady = JSON.stringify(pets)
      writeData('./pets.json', writeReady);
      res.send(pets);
    })
  }
})

app.patch('/pets/:id', jsonParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400).set('Content-Type', 'text/plain'); //bad request
  }
   //CHECK TO ENSURE THE PROPERTIES ARE AGE, NAME, AND/OR KIND AND NOT SOMETHING ELSE
  else {
    let petsData = readData('./pets.json', 'utf-8');
    petsData.then(function(result) {
      let pets = parseData(result);
      let id = Number.parseInt(req.params.id);
      if (checkID(pets,res,id)) {
        let combined = Object.assign(pets[id], req.body)
        if (Object.keys(combined).length > 3) {
          return res.sendStatus(400).set('Content-Type', 'text/plain'); //bad request
        }
        else {
          pets[id] = combined;
          let writeReady = JSON.stringify(pets);
          writeData('./pets.json', writeReady);
          res.send(pets);
        }
      }
      else {
        return res.sendStatus(404).set('Content-Type', 'text/plain').send('Not Found');
      }
    })
  }
})

app.delete('/pets/:id', jsonParser, function(req, res) {
    let petsData = readData('./pets.json', 'utf-8');
    petsData.then(function(result) {
      let pets = parseData(result);
      let id = Number.parseInt(req.params.id);
      if (checkID(pets,res,id)) {
        pets.splice(id, 1);
        let writeReady = JSON.stringify(pets);
        writeData('./pets.json', writeReady);
        res.send(pets);
      }
      else {
        return res.sendStatus(404).set('Content-Type', 'text/plain').send('Not Found');
      }
    })
})
//if request is incorrect
app.use(function(req, res) {
  res.sendStatus(404).set('Content-Type', 'text/plain');
});

//listen on port
app.listen(port, function(){
  //port 8000
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
    return false;
  }
  else {
    return true;
  }
}

//write to file
function writeData(file, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(file, data, function(err, data) {
      if (err) {
        return reject(err)
      }
    })
  })
}

module.exports = app;
