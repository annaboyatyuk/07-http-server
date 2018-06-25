'use strict';


const http = require('http');
const fs = require('fs');

var cowsay = require('cowsay');

const parser = require('./lib/parser.js');


const requestHandler = (req,res) => {

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
          res.write(data.toString().replace('{{cowsay}}', cowsay.say({text: 'What does the cow say?'})));
          res.end();
          return;
        });
      }

      else if(req.method === 'GET' && req.url.pathname === '/cowsay') {

        fs.readFile(`${__dirname}/../public/cowsay.html`, (err, data) => {
          if(err) {
            throw err;
          }
          let texts = data.toString();
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.statusMessage = 'OK';
          if(!req.url.query.text) {
            res.write(texts.replace('{{cowsay}}', cowsay.say({text: 'What does the cow say?'})));
            res.end();
            return;
          }
          else {
            res.write(texts.replace('{{cowsay}}', cowsay.say({text: req.url.query.text})));
            res.end();
            return;
          }
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
            res.statusCode = 400;
            res.write(JSON.stringify({error: 'invalid request: text query required'}));
            content = 'Invalid content: text query required';
          }
          else { 
            content = cowsay.say({text: req.body.text});
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
        res.write('invalid request: text query required');
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

