# SPECIAL  Lightweight Demonstrator
This repository contains a lightweight version of the SPECIAL demonstrator.
It should be simple enough to just clone, initialize and start.

## Requirements

### Docker
The SPECIAL demonstrator is distributed as a set of docker images with a docker-compose file to wire everything up.
[Docker](https://www.docker.com/community-edition) is available for all major operating systems. [Docker-compose](https://github.com/docker/compose) comes out of the box with Docker for Windows and Mac, but is a separate install on Linux.

## Quick start
* git clone https://github.com/specialprivacy/demonstrator.git
* git checkout lightweight
* git submodule init .
* git submodule update
* docker-compose up
* navigate to http://localhost

## Content

The repository contains a docker-compose.yml configuration file and a set of git submodules.

* **docker-compose.yml**
  This is the main file that describes how the different components work together to provide the demonstrator service

### SPECIAL components
These are the components which have been developed as part of the SPECIAL platform. The goal of the demonstrator is to show how they can be used in a real world scenario.
* **consent-management-backend**
  The consent-management-backend is the primary entry point for most WP4 UIs. It offers a REST API to retrieve and update policies, both for data subjects and applications. It takes care of authentication, validation, keeping an audit log and informing other services. It uses rethinkdb as a database for its native streaming support.
  The code and more information can be found at TODO: create a repository
* **compliance-checker**
  The compliance checker is a stream processor which validates that processing log messages are compliant with a users policy. All data is picked from kafka topics and results are also written to a kafka topic. It implements the SPECIAL policy language and can use the standard HermiT reasoner or the custom SPECIAL algorithm. In the demonstrator this component is used to check compliance, but it can also be used for ex-ante checks.
  Its code and more information can be found at https://git.ai.wu.ac.at/specialprivacy/compliance-backend

### Off the shelve components
These are off the shelve pieces of software which are lightly configured, but not customized. In most cases, these are just an example and can be easily swapped out for similar software. In a few cases, the SPECIAL components have a stronger dependency. We will try to highlight these.
* **kafka**
  [Apache Kafka](https://kafka.apache.org/) is the core data system of the SPECIAL platform. It is used to pass messages between the different services, but also provides the audit and transparency ledgers.
* **zookeeper**
  Zookeeper is a dependency of Apache Kafka, providing it with consensus primitives.
* **kong**
  [Kong](https://konghq.com/) is the API gateway of the SPECIAL platform. It takes care of dispatching and authenticating the incoming requests against keycloak.
* **keycloak**
  [Keycloak](https://keycloak.org) is an example identity provider. It provides the OpenID Connect endpoints the platform uses to authenticate clients. The SPECIAL platform does not depend on Keycloak per se, it depends on the OpenID Connect, and so this component can be replaced by other identity providers such as Azure AD, OpenAM, Google, etc. We picked Keycloak as the example service, because it is relatively easy to deploy and configure and because it provides good federation support, allowing it to expose OpenID Connect endpoints for legacy identity providers which do not have native support.
* **postgres**
  This is the backend database of keycloak and kong. It should be considered an embedded component of that system.

### Demonstrator components
These components are custom written software specifically for this demonstrator. They are not part of the SPECIAL platform as such, but are necessary to make the demonstrator work: for example dummy line of business applications. Some of these components might graduate to become (or be replaced by) SPECIAL components in the future, at which point their code and documentation will be made available.

* **transparency-frontend**
  This is a dummy transparency dashboard. It can visualise the stream of processing events and whether they are compliant. It is not an official WP4 design. It will be replaced with a WP4 transparency dashboard once the integration work is finished.
* **transparency-backend**
  This is a simple proxy app which exposes a specific kafka topic as a [SSE](https://en.wikipedia.org/wiki/Server-sent_events) stream to a client.
* **consent-management-frontend**
  This is a simple CRUD UI which allows a user to update his or her consent. It is only provided for test purposes and not part of WP4 or any SPECIAL recommendations.
* **policy-admin-frontend**
  This is a simple CRUD UI which allows an admin user to register and maintain applications and their policies into the system.
* **log-generator**
  This is a dummy line of business application. It will read the list of users from keycloak and listen to the configured application policies. It will generate a stream of processing events on kafka, not taking into account any consent that has been given.
* **keycloak-init**
  This is a simple program which will configure an empty keycloak instance. It will run once and then exit. If it detects keycloak has already been configured, it will do nothing. The configuration that will be loaded is included in this repository to make it easier to test the platform.
* **kong-init**
  This is a simple program which will setup a new Kong instance. It will run once and then exits. It provides Kong with a version-controlled config file and applies the necessary scripts to the DB behind Kong.

### Known issues
Some components (the compliance-checker comes to mind) don't include a waiting mechanism and, on occasions, a container will die because its dependancies are not online yet.
This should be fixed but a workaround is to just restart the specific containers. Initialization containers should not be restarted.
