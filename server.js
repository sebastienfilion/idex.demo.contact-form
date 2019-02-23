const bodyParser = require('body-parser');
const express = require('express');

const application = express();

application.use(bodyParser.json());
application.use(bodyParser.urlencoded({ extended: true }));

application.use((request, response, next) => {

  response.header("Access-Control-Allow-Origin", request.headers.origin);
  response.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  response.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Authorization, Accept");
  response.header("Access-Control-Allow-Credentials", "true");
  response.header("X-Powered-By", "Nucleus");


  if (request.method === 'OPTIONS') {
    response.header("Access-Control-Max-Age", 1000 * 60 * 10);
    return response.status(204).end();
  }
  next();
});

application.get('/ping', (request, response) => {

  response.status(200).end();
});

application.post('/form', (request, response) => {
  try {
    if (typeof request.body !== 'object') throw new Error("The body of the request does not seem to be a valid JSON object.");

    const { email, fullName, message } = request.body;

    if (!email) throw new Error("The email is mandatory.");
    if (!/^.*?@.*?$/.test(email)) throw new Error("The email does not seem to be a valid email address.");
    if (!message) throw new Error("The message is mandatory.");

    if (Math.random() > 0.95) throw new Error("An unexpected error occured.");

    response.status(200).send({}).end();

  } catch (error) {
    response.status(500).send({ error: error.message }).end();
  }
});

application.listen(9090);
console.log("Listening on 9090");
