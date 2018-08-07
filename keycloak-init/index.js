'use strict';
const fs = require('fs');
var path = require('path');
var adminClient = require('keycloak-admin-client');

// reading in config file
var pathToJson = path.resolve(__dirname, './config.json');
var config = null;
var retryCounter = 0;

const file = fs.readFile(pathToJson, function(err, data) {
  // exit if there is an error
  if (err) {
    throw err;
    return;
  }
  // parse config
  config = JSON.parse(data);
  // Overwrite with environment variables if present
  if (process.env.KEYCLOAK_URL) {
    config.settings.baseUrl = process.env.KEYCLOAK_URL;
  }
  if (process.env.KEYCLOAK_USER) {
    config.settings.username = process.env.KEYCLOAK_USER;
  }
  if (process.env.KEYCLOAK_PASSWORD) {
    config.settings.password = process.env.KEYCLOAK_PASSWORD;
  }
  if (process.env.CLIENT_REDIRECT_URI) {
    config.client.redirectUris.push(process.env.CLIENT_REDIRECT_URI)
  }
  console.log(config);
  initiateKeycloak();
});

function initiateKeycloak() {
  // get keycloak settings
  adminClient(config.settings)
    .then((admin) => {
      createClient(admin, config.client, config.users);
    }).catch((e) => {
      console.log(e);
      console.log('Keycloak is not available yet.\n\n');
      retryCounter++;
      if (retryCounter < 30) {
        setTimeout(initiateKeycloak, 6000);
      }
      else {
        console.log(`Keycloack is not available after ${retryCounter} times. Stopping init script.`);
      }
    });
}

function createClient(admin, client, users) {
  var clientId = client.clientId;
  admin.clients.find(config.realm, {
      clientId: clientId
    })
    .then((clients) => {
      if (clients.length === 0) {
        console.log(`creating client: ${clientId}`);
        admin.clients.create(config.realm, client).then((newClient) => {
          console.log('client created', 'creating users');
          users.forEach((user) => {
            createUser(admin, clientId, newClient.id, user);
          });
        });
      }
    });
}

function createUser(admin, clientId, idClient, user) {
  admin.users.find(config.realm, {
      username: user.username
    })
    .then((foundUsers) => {
      if (foundUsers.length === 0) {
        console.log(`creating user: ${user.username}`);
        admin.users.create(config.realm, user)
          .then((createdUser) => {
            console.log('user created');
          });
      }
    });
}
