'use strict';


const http = require('http');
const fs = require('fs');

var cowsay = require('cowsay');

const parser = require('./lib/parser.js');


const requestHandler = (req,res) => {

  // console.log('aaaaaa', req.method);
  // console.log('bbbbbb', req.headers);
  // console.log('ccccc', req.url);

  parser(req)
    .then(req => {

      if (req.method === 'GET' && req.url.pathname === '/') {

        fs.readFile(`${__dirname}/../public/index.html`, (err, data) => {
          if(err) {
            throw err;
          }
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.write(data.toString());
          res.end();
          return;
        });
      }

      else if(req.method === 'GET' && req.url.pathname === '/cowsay') {

        fs.readFile(`${__dirname}/../public/cowsay.html`, (err, data) => {
          if(err) {
            throw err;
          }
          let text = data.toString();
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.write(text.replace('{{cowsay}}', cowsay.say({text: req.url.query.text})));
          res.end();
          return;
        });
      }

      else if(req.method === 'POST' && req.url.pathname === '/api/cowsay') {

        fs.readFile(`${__dirname}/../public/cowsay.html`, (err, data) => {
          if(err) {
            throw err;
          }
          
          let content = data;
          if(!req.body) {
            content = 'Invalid request:';
          }
          else if(!req.body.text) {
            content = 'Invalid content: text query required';
          }
          else { 
            content = cowsay.say({text: req.url.query.text, e: 'oO'});
          }
          let text = data.toString();
          let obj = {content: content};
          res.setHeader('Content-Type', 'text/json');
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.write(text.replace('{{cowsay}}', JSON.stringify(obj)));
          res.end();
          return;
        });
      }


      else {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
        res.write('Error 404 Not Found');
        res.end();
      }
    
    })
    .catch(err => {
      res.writeHead(500);
      res.write('Error!', err);
      res.end();
    });
};

const app = http.createServer(requestHandler);

module.exports = {
  start: (port,callback) => app.listen(port,callback),
  stop: (callback) => app.close(callback),
};
