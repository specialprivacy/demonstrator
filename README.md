# SPECIAL Demonstrator
This repository contains the system description for the SPECIAL Demonstrator.
It combines the SPECIAL components with other off the shelve components into a working example system.
A live copy should be available at https://demonstrator-special.tenforce.com

## Requirements

### Docker
The SPECIAL demonstrator is distributed as a set of docker images with a docker-compose file to wire everything up.
[Docker](https://www.docker.com/community-edition) is available for all major operating systems. [Docker-compose](https://github.com/docker/compose) comes out of the box with Docker for Windows and Mac, but is a separate install on Linux.

### Docker Image Registry
Most of the SPECIAL components and the off the shelve software is available on the [public docker image registry](https://hub.docker.com/), but some specific components which are only relevant for this demonstrator are hosted on a private docker registry at registry-special.tenforce.com. In order to sucessfully pull these, you need to login first:

* **username**: special
* **password**: T4hMTggkUoxEJnwwT5B7yzB9

```bash
docker login -u special -p T4hMTggkUoxEJnwwT5B7yzB9 registry-special.tenforce.com
```

## Running

The repository currently contains 3 files:

* **docker-compose.yml**  
  This is the main file that describes how the different components work together to provide the demonstrator service
* **docker-compose.override.yml**  
  This file contains some additional settings which can be useful when developing the service on a local machine. It is automatically overlayed on `docker-compose.yml` by the docker-compose tool.
* **docker-compose.id-provider.yml**  
  This file contains configuration overrides which point the services to an identity provider hosted on https://demonstrator-special.tenforce.com rather than starting one locally
* **docker-compose.production.yml**  
  This file contains additional settings needed for running the demonstrator service on a cluster of machines using docker swarm.

### Single Machine
There are two options to run the demonstrator on a single machine: the easy way, where the system uses a dummy identity provider from https://demonstrator-special.tenforce.com and the slightly more complicated one where the identity provider also runs locally.

#### Easy Way
Once docker is installed, running the demonstrator on a single machine is with a remote identity provider is relatively straightforward. The following command needs to be run from the root of this project:

```bash
DOMAIN=localhost docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.id-provider.yml up
```

This will download all the necessary docker images, start all the services and make the demonstrator available on `http://localhost`

#### Slightly Harder Way
In order to run the demonstrator with a local identity provider, a hostname or IP address of the host machine needs to be passed in as the `DOMAIN` variable. How to obtain this value is operating system and context dependent. We will document how this can be done on a recent linux installation.

* Get the IP address
  ```bash
  ip address show eth0
  ```
  where `eth0` is the name of the relevant network interface (for example wired, wireless or virtualbox).
* Launch the identity provider first (if the IP address from the previous step is 192.168.0.17). This ensures that all required configuration has happened, before the rest of the system tries to use it.
  ```bash
  DOMAIN=192.168.0.17 docker-compose up -d postgres keycloak keycloak-init
  docker-compose logs -f keycloak-init
  ```
  Once the `keycloak-init` process finishes (`special-platform_keycloak-init_1 exited with code 0`), you can perform the next step
* Launch the demonstrator
  ```bash
  DOMAIN=192.168.0.17 docker-compose up
  ```

This will download all the necessary docker images, start all the services and make the demonstrator available on `http://192.168.0.17`

### Cluster of Machines
The files included in this project allow the demonstrator to run on a cluster of machines orchestrated with [Docker Swarm Mode](https://docs.docker.com/engine/swarm/). We are not going to describe how to create a swarm mode cluster, there are [plenty](https://docs.docker.com/engine/swarm/swarm-tutorial/) [of](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/swarm-mode) [tutorials](https://www.digitalocean.com/community/tutorials/how-to-create-a-cluster-of-docker-containers-with-docker-swarm-and-digitalocean-on-ubuntu-16-04) out there.

Deploying on a swarm cluster requires you to set the following environment variables:
* **DOMAIN**: The domain on which the system will be deployed. This must be publicly accessible. The system will request a certificate at letsencrypt for this domain.
* **RECOVERY_EMAIL**: The email address used to request a certificate at letsencrypt. This will allow you to recover the certificate.
* **KEYCLOAK_PASSWORD**: A password to protect the root user in keycloak

Deploying the demonstrator on an existing docker swarm cluster is a four step process:
1. Add labels for the data stores.  
  Even though the datastores can be sharded and failed over, the demonstrator currently does not contain the necessary configuration. The datastores are therefore pinned to specific hosts using node labels. All of the following key/value pairs need to be present on at least one node: `(type: rethinkdb)`, `(type: database)`, `(type: kafka)`
  ```bash
  docker node update --label-add type=rethinkdb swarmnode
  ```
2. Ensure the node you are deploying too has logged in to the special docker registry
  ```bash
  docker login -u special -p T4hMTggkUoxEJnwwT5B7yzB9 registry-special.tenforce.com
  ```
3. Merge the docker-compose files together
  ```bash
  RECOVERY_EMAIL=foo@example.com \
  KEYCLOAK_PASSWORD=DVMswdsEtuk7Zs4t6PEKHrS8 \
  DOMAIN=demonstrator-special.tenforce.com \
  docker-compose -f docker-compose.yml -f docker-compose.production.yml config > stack.yml
  ```
4. Deploy the stack onto the cluster
  ```bash
  docker stack deploy -c stack.yml --with-registry-auth special-demonstrator
  ```

## Components
This section aims to give a brief overview of the components and their function in the SPECIAL demonstrator. Where relevant, links to code repositories or additional documentation will be provided. The interested reader can find more information on the architecture in [deliverable D3.2 of the H2020 SPECIAL project](https://www.specialprivacy.eu/images/documents/SPECIAL_D3.2_M16_V1.0.pdf).

TODO: insert block and wire architecture diagram here.

### SPECIAL components
These are the components which have been developed as part of the SPECIAL platform. The goal of the demonstrator is to show how they can be used in a real world scenario.
* **consent-management-backend**  
  The consent-management-backend is the primary entrypoint for all WP4 UIs. It offers a REST API to retrieve and update policies, both for data subjects and applications. It takes care of authentication, validation, keeping an audit log and informing other services. It uses rethinkdb as a database for its native streaming support.  
  The code and more information can be found at TODO: create a repository
* **compliance-checker**  
  The compliance checker is a stream processor which validates that processing log messages are compliant with a users policy. All data is picked from kafka topics and results are also written to a kafka topic. It implements the SPECIAL policy language and can use the standard HermiT reasoner or the custom SPECIAL algorithm. In the demonstrator this component is used to check compliance, but it can also be used for ex-ante checks.  
  Its code and more information can be found at https://git.ai.wu.ac.at/specialprivacy/compliance-backend
* **mobile-frontend**  
  The mobile UI is one of the WP 4 interfaces which presents how user consent can be gathered in a mobile setting. It integrates with the consent-management-backend to store the consent and retrieve policies to consent to.  
  Its code and more information can be found at https://git.ai.wu.ac.at/specialprivacy/prox-consent

### Off the shelve components
These are off the shelve pieces of software which are lightly configured, but not customized. In most cases, these are just an example and can be easily swapped out for similar software. In a few cases, the SPECIAL components have a stronger dependency. We will try to highlight these.
* **kafka**  
  [Apache Kafka](https://kafka.apache.org/) is the core data system of the SPECIAL platform. It is used to pass messages between the different services, but also provides the audit and transparency ledgers.
* **zookeeper**  
  Zookeeper is a dependency of Apache Kafka, providing it with consensus primitives.
* **rethinkdb**  
  [Rethinkdb](https://www.rethinkdb.com) is the database backend of the consent-management-backend. It is a dependency of this service and can't be replaced with another database.
* **keycloak**  
  [Keycloak](https://keycloak.org) is an example identity provider. It provides the OpenID Connect endpoints the platform uses to authenticate clients. The SPECIAL platform does not depend on Keycloak per se, it depends on the OpenID Connect, and so this component can be replaced by other identity providers such as Azure AD, OpenAM, Google, etc. We picked Keycloak as the example service, because it is relatively easy to deploy and configure and because it provides good federation support, allowing it to expose OpenID Connect endpoints for legacy identity providers which do not have native support.
* **postgres**  
  This is the backend database of keycloak. It should be considered an embedded component of that system.

### Demonstrator components
These components are custom written software specifically for this demonstrator. They are not part of the SPECIAL platform as such, but are necessary to make the demonstrator work: for example dummy line of business applications. Some of these components might graduate to become (or be replaced by) SPECIAL components in the future, at which point their code and documentation will be made available.

* **transparency-frontend**  
  This is a dummy transparency dashboard. It can visualise the stream of processing events and whether they are compliant. It is not an official WP4 design. It will be replaced with a WP4 transparency dashboard once the integration work is finished.
* **transparency-backend**  
  This is a simple proxy app which exposes a specific kafka topic as a [SSE](https://en.wikipedia.org/wiki/Server-sent_events) stream to a client.
* **dispatcher**  
  This service acts as a router and application load balancer. It acts as the entrypoint into the demonstrator, provides TLS termination and exposes the various services as one endpoint to the outside world. The routing is currently hardcoded for the demonstrator using [Caddy](https://caddyserver.com). In a future version we might replace this with [Traefik](https://traefik.io), which will allow the router to be configured based on data in the compose files.
* **consent-management-frontend**  
  This is a simple CRUD UI which allows a user to update his or her consent. It is only provided for test purposes and not part of WP4 or any SPECIAL recommendations.
* **data-controller-policy-management-frontend**  
  This is a simple CRUD UI which allows an admin user to register and maintain applications and their policies into the system.
* **demonstrator-log-generator**  
  This is a dummy line of business application. It will read the list of users from keycloak and listen to the configured application policies. It will generate a stream of processing events on kafka, not taking into account any consent that has been given.
* **keycloak-init**  
  This is a simple program which will configure an empty keycloak instance. It will run once and then exit. If it detects keycloak has already been configured, it will do nothing. The configuration that will be loaded is included in this repository to make it easier to test the platform.
