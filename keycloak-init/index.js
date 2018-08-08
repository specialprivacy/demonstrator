'use strict'
const fs = require('fs')
const path = require('path')
const adminClient = require('keycloak-admin-client')

// reading in config file
const pathToJson = path.resolve(__dirname, './config.json')
let config = null
let retryCounter = 0

fs.readFile(pathToJson, function (err, data) {
  // exit if there is an error
  if (err) {
    console.error(err)
    process.exit(1)
  }
  // parse config
  config = JSON.parse(data)
  // Overwrite with environment variables if present
  if (process.env.KEYCLOAK_URL) {
    config.settings.baseUrl = process.env.KEYCLOAK_URL
  }
  if (process.env.KEYCLOAK_USER) {
    config.settings.username = process.env.KEYCLOAK_USER
  }
  if (process.env.KEYCLOAK_PASSWORD) {
    config.settings.password = process.env.KEYCLOAK_PASSWORD
  }
  if (process.env.CLIENT_REDIRECT_URI) {
    config.client.redirectUris.push(process.env.CLIENT_REDIRECT_URI)
  }
  console.log(JSON.stringify(config))
  initiateKeycloak()
})

function initiateKeycloak () {
  // get keycloak settings
  adminClient(config.settings)
    .then(admin => {
      createClient(admin, config.client, config.users)
    }).catch(e => {
      console.log(e)
      console.log('Keycloak is not available yet.\n\n')
      retryCounter++
      if (retryCounter < 30) {
        setTimeout(initiateKeycloak, 6000)
      } else {
        console.log(`Keycloack is not available after ${retryCounter} times. Stopping init script.`)
      }
    })
}

function createClient (admin, client, users) {
  var clientId = client.clientId
  return admin.clients.find(config.realm, {clientId})
    .then(clients => {
      if (clients.length === 0) {
        console.log(`Creating client: ${clientId}`)
        return admin.clients.create(config.realm, client)
      } else {
        console.log('No clients found, skipping this step')
        return Promise.resolve(null)
      }
    })
    .then(createdClient => {
      if (createdClient !== null) console.log('Done creating clients')
      console.log('Creating users')
      return Promise.all(users.map(user => createUser(admin, user)))
    })
    .then(() => {
      console.log('Done creating users')
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

function createUser (admin, user) {
  return admin.users.find(config.realm, {username: user.username})
    .then(foundUsers => {
      if (foundUsers.length === 0) {
        console.log(`Creating user: ${user.username}`)
        return admin.users.create(config.realm, user)
      } else {
        console.log(`User ${user.username} already exists. Skipping.`)
        return Promise.resolve(null)
      }
    })
    .then(createdUser => {
      if (createdUser !== null) {
        console.log(`User ${user.username} created`)
        if (user.clientRoles) {
          console.log(`Applying role mappings to user ${user.username}`)
          let promises = []
          for (let clientId in user.clientRoles) {
            promises.push(mapRoles(admin, createdUser.id, clientId, user.clientRoles[clientId]))
          }
          return Promise.all(promises)
        }
        return Promise.resolve()
      } else {
        return Promise.resolve()
      }
    })
}

function mapRoles (admin, userId, clientId, roles) {
  let map = admin.clients.maps.map.bind(null, config.realm, userId)
  const findRole = admin.clients.roles.find.bind(null, config.realm)
  return admin.clients.find(config.realm, {clientId})
    .then(client => {
      map = map.bind(null, client[0].id)
      return Promise.all(roles.map(role => findRole(client[0].id, role)))
    })
    .then(clientRoles => map(clientRoles))
}
