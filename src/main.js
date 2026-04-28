const express = require('express');
const bodyParser = require('body-parser');

const balance = require('./balance');
const request = require('./request');
const hcm = require('./hcm.mock');

const app = express();
app.use(bodyParser.json());

// In-memory store
const balances = {};

// attach stores
app.locals.balances = balances;

/* =========================
   LANDING PAGE (NEW)
========================= */
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>TimeOff Microservice</title>
      </head>
      <body>
        <h1>TimeOff Microservice</h1>
        <p>Server is running successfully 🚀</p>

        <h3>Available Endpoints</h3>
        <ul>
          <li>GET /balances/:employeeId/:locationId</li>
          <li>POST /requests</li>
          <li>POST /sync/batch</li>
          <li>POST /hcm/validate</li>
        </ul>
      </body>
    </html>
  `);
});

/* =========================
   API ROUTES
========================= */
app.get('/balances/:employeeId/:locationId', balance.getBalance);
app.post('/sync/batch', balance.batchSync);

app.post('/requests', request.createRequest);
app.get('/requests/:id', request.getRequest);

// mock HCM
app.post('/hcm/validate', hcm.validate);

/* =========================
   START SERVER
========================= */
app.listen(3000, () => {
  console.log('TimeOff service running on port 3000');
});