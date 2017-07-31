const fs = require('fs');
const https = require('https');
const request = require('request');
const express = require('express');
const app = express();

const credentials = require("./credentials.json")

const serverCredentials = {
  key: fs.readFileSync('localhost-certs/localhost-key.pem'),
  cert: fs.readFileSync('localhost-certs/localhost-cert.pem')
};

var httpsServer = https.createServer(serverCredentials, app);

// GET request - Authorization oauth2 URI
var authOptions = {
  url: credentials.endpoints.authorizePath,
  qs: {
    "client_id": credentials.client.id,
    "response_type": "code",
    "redirect_uri": credentials.client.redirectUri
  }
}

app.get('/', function(req, res, next) {
  console.log(authOptions.url + `?${Object.keys(authOptions.qs)[0]}=${authOptions.qs.client_id}&${Object.keys(authOptions.qs)[1]}=${authOptions.qs.response_type}&${Object.keys(authOptions.qs)[2]}=${authOptions.qs.redirect_uri}`);
  res.redirect(authOptions.url + `?${Object.keys(authOptions.qs)[0]}=${authOptions.qs.client_id}&${Object.keys(authOptions.qs)[1]}=${authOptions.qs.response_type}&${Object.keys(authOptions.qs)[2]}=${authOptions.qs.redirect_uri}`);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  var responseCode = req.query.code.replace(/"/g, '');

  var tokenOptions = {
    url: credentials.endpoints.tokenPath,
    headers: {
      "Api-Version": "alpha",
      "Content-Type": "application/json"
    },
    body: {
      "grant_type": "authorization_code",
      "code": responseCode,
      "redirect_uri": credentials.client.redirectUri,
      "client_id": credentials.client.id,
      "client_secret": credentials.client.secret
    },
    json: true
  };

  console.log(responseCode);
  console.log(credentials.client.id);

  // POST request, retrieve access token
  request.post(tokenOptions, function(error, response, body) {
    console.log(response.statusCode + " " + response.statusMessage);
    if(!error && response.statusCode === 200) {
      // res.redirect(response.url); //?
      console.log("response? - ", JSON.stringify(response, null, 2));
      console.log("body? - ", JSON.stringify(body, null, 2));
      return res.status(200).json(body);
    } else {
      //HANDLE ERROR
      console.warn("errors - ", JSON.stringify(response.body, null, 2));
      res.json('Auth failed');
    }
  });
});

app.get('/success', (req, res) => {
  res.json(req.body);
});

app.get('/revoke', (req, res) => {
  var token = req.query.token;
  console.log("revoke - ", token);

  var revokeOptions = {
    url: credentials.endpoints.revokePath,
    headers: {
      "Api-Version": "alpha",
      "Content-Type": "application/json"
    },
    body: {
      "token": token
    },
    json: true
  };

  request.post(revokeOptions, function(error, response, body) {
    if(!error && response.statusCode === 200) {
      return res.status(200).json(body);
    } else {
      console.warn("errors - ", JSON.stringify(response.body, null, 2));
      return res.json('revoke failed');
    }
  });
});

httpsServer.listen(3000, () => {
  console.log('Express server started on port 3000'); // eslint-disable-line
});
