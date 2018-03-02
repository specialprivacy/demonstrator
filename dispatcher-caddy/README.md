# Data Vlaanderen Dispatcher
This is a reimplementation of the mu-dispatcher in Caddyserver (https://caddyserver.com)
The issue with the mu-dispatcher is that it is written in elixir and nobody in the company knows this language or has any intention of learning it.
We also do not have any access to the base image of the dispatcher and the upstream project hasn't updated it in a year.
Even worse, the latest version seems to blow up when running in swarm mode, so we are forced to use a 2 year old version with no clear path on upgrades.

Additional advantages of the caddyserver implementation are:
* Out of the box websockete proxying
* Easy log format configuration
* 1 line request-id / tracing configuration
* 100x smaller docker image
* Configuration through environment variables rather than hardcoded network hosts

Due to licensing issues, caddy server is compiled from source rather than fetching the precompiled binaries.

## Configuration Parameters
All configuration parameters are passed in as environment variables.
* `ADDRESSES_RESOURCE`: The endpoint of the addresses mu-cl-resources instance (default: `http://sp-addresses-resource`)
* `ORGANIZATIONS_RESOURCE`: The endpoint of the organizations mu-cl-resources instance (default: `http://sp-organizations-resource`)
* `CATALOGS_RESOURCE`: The endpoint of the catalogs mu-cl-resources instance (default: `http://sp-catalogs-resource`)
* `LICENSES_RESOURCE`: The endpoint of the licenses mu-cl-resources instance (default: `http://sp-licenses-resource`)
* `GRAPH_IDENTIFIER`: The endpoint of the graph-identifier service (default: `http://graph-identifier`)
 

## Usage
```bash
docker run -p "80:80" registry.gitlab.com/oslo2/sp-dispatcher:latest
```

## TODO
* [] Add a test suite which validates the proxy rules (golang or nodejs are prime candidates because they allow for easy process forking)
