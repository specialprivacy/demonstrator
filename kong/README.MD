# Description

This service uses [Kong](https://konghq.com/) in the role of API gateway for the Special platform.

It's responsibilities are the following:
- dispatch external calls to the right service
- handle authentication against Keycloak

# Plugins

The following external plugins are added:
- [Kong OIDC plugin](https://github.com/nokia/kong-oidc)
