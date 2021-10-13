const express = require('express');
const router = require('./app/routes/router');
const app = express();

app.use('/', router);

//app.use(express.static('public'))

// set port, listen for requests
const port = process.env.port || 8081;

app.listen(port, () => console.log(`Server started on port ${port}`));