const express = require('express');
const router = require("./router");

const server = express();

server.use(express.json());

server.use('/accounts', router);

// Welcome message
server.get('/', (req, res) => {
  res.send('<h1 style="display: block; width: 100vw; text-align: center;">Welcome!</h1>')
})

// General error handler
server.use((err, req, res, next) => {
  res.status(500).json({ message: 'Oops. Something went wrong.' })
})

module.exports = server;