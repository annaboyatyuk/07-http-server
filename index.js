'use strict';

require('dotenv').config();

const server = require('./src/app.js');

const PORT = process.env.PORT;


server.start(PORT, () => {
  console.log(`listenting on port ${PORT}`);
});

