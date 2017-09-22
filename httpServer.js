const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  //console.log(req);
  //get the pets data from the doc
  let petInfo = readData('./pets.json')
  petInfo.then(function(result) {
    let pets = JSON.parse(result)

    //if the method is GET
     if (req.method === 'GET') {
       //get url components
       let params = req.url.slice(1).split('/')

        //if the first part of the url is pets
         if (params[0] === 'pets') {
           if (params.length === 1) {
             res.writeHead(200, {'Content-Type': 'application/json'})
             res.end(JSON.stringify(pets))
           }
           //if the second part of the url is a number
           else if (Number.isInteger(parseInt(params[1]))) {
             //grab their pet out of the array
             pet = pets[params[1]]
             //their pet is not found :(
             if (pet === undefined) {
               res.writeHead(404, {'Content-Type': 'text/plain'})
               //res.statusCode = 404
               res.end('Not Found')
             }
             //send their pet
             else {
               res.writeHead(200, {'Content-Type': 'application/json'})
               res.end(JSON.stringify(pet))
             }
           }
         }
           else {
             res.writeHead(404, {'Content-Type': 'application/json'})
             //res.statusCode = 404;
             res.end()
           }
    // } else if ('POST') {
      // post /pets
      // check request for bad params
      // You will need to return a new promise
    }
  })
  .catch(function(err) {
    console.error(err)
  })

});

server.listen(3000);


function readData(file, encoding) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, encoding, function(err,data) {
      if (err) return reject(err)
      resolve(data)
     })
  })
}

module.exports = server;
