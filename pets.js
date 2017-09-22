//require dependencies
const fs = require('fs');

//read the file
function readData(file, encoding) {
  //make a promise
  return new Promise(function (resolve, reject) {
    fs.readFile(file, encoding, function (err, data) {
      if (err) return reject(err) //rejects promise
      resolve(data) //fulfills promise
    });
  });
}
  //check if read is the subcommand
  if (process.argv[2] === 'read') {
    let result = readData('./pets.json')
    //when the promise comes back
    result.then(function(result) {
      //transform the result into a js object
      let pets = JSON.parse(result.toString())
      //check for index
      if (process.argv[3]) {
        //catch out of bounds indices
        if (pets[process.argv[3]] === undefined) {
          console.error('Usage: node pets.js read INDEX');
          process.exit(1);
        }
        //log the particular pet if requested
        else{
          console.log(pets[process.argv[3]]);
        }
      }
      //log all the pets if there is no index
      else {
        console.log(pets);
      }
      res.end()
    }, console.error)
  }

  //check if create is the subcommand
  else if (process.argv[2] === 'create'){
    if (process.argv.length < 6) {
      console.error('Usage: node pets.js create AGE KIND NAME');
      process.exit(1);
    }
    else if (process.argv.length === 6) {
      let result = readData('./pets.json')
      //when the promise comes back
      result.then(function(result) {
        //transform the result into a js object
        let pets = JSON.parse(result.toString())
        let petAge = parseInt(process.argv[3]);
        let petKind = process.argv[4];
        let petName = process.argv[5];

      let pet = Critter(petAge, petKind, petName);
      console.log(pet);
      pets.push(pet);
      let writable = JSON.stringify(pets);
      fs.writeFile('./pets.json', writable, 'utf8', (err) => {
        if (err) throw err;
      })
  })
}
}
  //if missing, log usage and exit
  else if (process.argv[2] === undefined) {
    console.error('Usage: node pets.js [read | create | update | destroy]');
    process.exit(1);
  }

//constructor to make new pets if create is the subcommand
function Critter(age, kind, name) {

  return {
    age: age,
    kind: kind,
    name: name
  }
}
