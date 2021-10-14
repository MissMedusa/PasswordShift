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
    
    for (var i = 0; i < str.length - 1; i++) {
      var currentChar = str[i];
      if(index > 4){
        index = 0;
      }
      if(currentChar == 10){
        output += ',';
        index = 0;            
        } else {
          currentChar -= key[index];
          output += String.fromCharCode(currentChar);
          index++;
        }
      }
    var credentials = [];
    credentials = output.split(',').map((e) => {return e.split('*').map(String)});
    return credentials;
};

router.get('/', (req, res) => {
    try {
      res.status(200).json({ message: 'hello' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
      const encryptedData = fs.readFileSync('./password.txt');
      const decryptedData = decryptData(encryptedData);
      const rowIndex = decryptedData.findIndex(el => el.includes(req.body.data.email));
      if(decryptedData[rowIndex] != undefined &&  decryptedData[rowIndex][0] == req.body.data.email){
        if(decryptedData[rowIndex][1] == req.body.data.password){
          await db.adatok.findOne({ where: {Username: req.body.data.email} })
          .then((data) => {
            if (data != null) { 
              return res.json(data.Titkos);
            }
            else {
              return res.status(500).json({ message: 'Cannot retrieve details'});
            }          
        });
        } else {
          return res.json({ message: 'Wrong password!'});
        }
      } else {
        return res.json({ message: 'Wrong email!'});
      }  
});

module.exports = router;