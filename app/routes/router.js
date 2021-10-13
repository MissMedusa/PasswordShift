const express = require('express');
const cors = require('cors');
const fs = require('fs');
const db = require('../models');
const { stringify } = require('querystring');

const router = express.Router();

var corsOptions = {
  origin: 'http://localhost:8080'
};

router.use(cors(corsOptions));

router.use(express.urlencoded({extended: true}));

router.use(express.json());

db.sequelize.sync().then(() => {
    console.log("Drop and re-sync db.");
  });

var decryptData = function (str) {
    const key = [5, -14, 31, -9, 3];
    var index = 0;
    var output = "";
    
    for (var i = 0; i < str.length; i++) {
      var currentChar = str[i];
      if(index > 4){
        index = 0;
      }
      if(currentChar == 10){
        output += String.fromCharCode(currentChar);
        index = 0;            
        } else {
          currentChar -= key[index];
          output += String.fromCharCode(currentChar);
          index++;
        }
      }
    return output;
};

router.get('/', (req, res) => {
    try {
      res.status(200).json({ message: 'hello' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {     
      const userEmail = req.body.data.email;
      const userPassword = req.body.data.password;
      const userCredentials = userEmail + "*" + userPassword;
      const encryptedData = fs.readFileSync('./password.txt');
      const decryptedData = decryptData(encryptedData);
      if(decryptedData.includes(userCredentials)){ //ez nem jó mert ha rövidebb része van a jelszóból akkor is jó
        console.log('\n' + decryptedData + '\n' + userCredentials);
        const userInDB = await db.adatok.findOne({ where: {Username: userEmail} })
        .then((data) => {
          if (data != null) {          
            return res.json(data.Titkos);
          }
          else {
            return res.json({ message: 'Cannot retrieve details'});
          }          
        });
      } else {
        console.log('\nToo bad!!! Calling the police..\n');
        return res.status(401).json({ error: 'Calling the police'});
      }    
});

module.exports = router;