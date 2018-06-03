'use strict';

require('dotenv').config();

const server = require('./src/app');

const PORT = process.env.PORT


server.listen(PORT, () => {
  console.log(`listenting on port ${PORT}`);
});

