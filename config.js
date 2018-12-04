module.exports = {
  "settings": {
    "baseUrl": `http://${process.env.DOMAIN || "keycloak"}/auth`,
    "auth" : {
      "username": "keycloak",
      "password": `${process.env.KEYCLOAK_PASSWORD || "keycloak"}`,
      "grantType": "password",
      "clientId": "admin-cli"
    }
  },
  "realms": [
    {
      "payload": {
        "realm": "special",
        "enabled": true
      },
      "clients": [
        {
          "payload": {
            "clientId": "special-platform",
            "secret": `${process.env.KEYCLOAK_CLIENT_SECRET || "special-platform-secret"}`,
            "directAccessGrantsEnabled": true,
            "redirectUris": [
              "/callback/*",
              "http://localhost/callback/*"
            ]
          }
        }
      ],
      "groups": [
        {
          "payload": {
            "name": "data-subjects"
          }
        },
        {
          "payload": {
            "name": "services"
          }
        }
      ],
      "users": [
        {
          "payload": {
            "username": "bernard",
            "enabled": true,
            "credentials": [{
              "type": "password",
              "temporary": false,
              "value": "bernard"
            }]
          },
          "groups": ["data-subjects"]
        },
        {
          "payload": {
            "username": "antoine",
            "enabled": true,
            "credentials": [{
              "type": "password",
              "temporary": false,
              "value": "antoine"
            }]
          },
          "groups": ["data-subjects"]
        },
        {
          "payload": {
            "username": "demonstrator-generator",
            "enabled": true,
            "credentials": [{
              "type": "password",
              "temporary": false,
              "value": `${process.env.KEYCLOAK_GENERATOR_PASSWORD || "demonstrator-generator"}`
            }]
          },
          "groups": ["services"],
          "clientRoles": [{"clientId": "realm-management", "name": "view-users"}]
        }
      ]
    }
  ]
};


