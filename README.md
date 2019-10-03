# SPECIAL Demonstrator
This repository contains the system description for the SPECIAL Demonstrator.
It combines the SPECIAL components with other off the shelve components into a working example system.
A live copy should be available at https://demonstrator-special.tenforce.com

## Requirements

### Docker
The SPECIAL demonstrator is distributed as a set of docker images with a docker-compose file to wire everything up.
[Docker](https://www.docker.com/community-edition) is available for all major operating systems. [Docker-compose](https://github.com/docker/compose) comes out of the box with Docker for Windows and Mac, but is a separate install on Linux.

### Docker Image Registry
Some images are not available on [Dockerhub](https://hub.docker.com/) but are hosted on a private docker registry at registry-special.tenforce.com. In order to successfully pull these, you need to login first:

* **username**: special
* **password**: T4hMTggkUoxEJnwwT5B7yzB9

```bash
docker login -u special -p T4hMTggkUoxEJnwwT5B7yzB9 registry-special.tenforce.com
```

## Running

The full special platform consists of 3 different component groups.
* special-dispatcher: Redirects call to keycloak or to the internal platform
* special-keycloak: Provides the authorization / authentication layer
* demonstrator: Contains the internal special-platform components

These containers should work on the same network, which you can create with the following command:
```bash
docker network create special-demonstrator
```

This will allow the different containers to contact each other.

A recurring issue with Keycloak is that it doesn't expect services that reach it to know it under a different address.
To get around this issue, there are two possibilities:

* Modify your hosts file to ensure that the KEYCLOAK_ENDPOINT redirects you to your local installation of Keycloak.
* Use the remote keycloak deployed on the demonstrator server.

To start the platform:

* Clone the 3 component groups (unless you plan on using the remote keycloak, in that case special-keycloak can be left aside)
* If running locally, ensure the RECOVERY_EMAIL environment variable is set to "off" so the dispatcher doesn't try to obtain a certificate from tls.
* Ensure the KEYCLOAK_ENDPOINT is pointing to the right installation.
* Start the special-keycloak environment (with `docker-compose up`).
* Start the demonstrator environment.
* Start the special-dispatcher environment.

This will download all the necessary docker images, start all the services and make the demonstrator available on `http://localhost`

# Elasticsearch issues
If the elasticsearch exits with the following error:
```
[INFO ][o.e.b.BootstrapChecks    ] [PPEKOmZ] bound or publishing to a non-loopback address, enforcing bootstrap checks
ERROR: [1] bootstrap checks failed
[1]: max virtual memory areas vm.max_map_count [65536] is too low, increase to at least [262144]
[INFO ][o.e.n.Node               ] [PPEKOmZ] stopping ...
[INFO ][o.e.n.Node               ] [PPEKOmZ] stopped
[INFO ][o.e.n.Node               ] [PPEKOmZ] closing ...
[INFO ][o.e.n.Node               ] [PPEKOmZ] closed
[INFO ][o.e.x.m.j.p.NativeController] Native controller process has stopped - no new native processes can be started
xdc_elasticsearch_1 exited with code 78
```

#### Temporary solution
Use this command to give more max virtual memory area:
```bash
sudo sysctl -w vm.max_map_count=262144
```

This command has to be set every time you restart your machine.

#### Permanent solution

This is recommended way. First open `/etc/sysctl.conf` file, enter:
```bash
nano /etc/sysctl.conf
 ```

Now add value:
vm.max_map_count = 262144
Close and save the changes. Type the following command to load sysctl settings from the file `/etc/sysctl.conf` file:
``` bash
sysctl -p
```

OR
``` bash
sysctl -p /etc/sysctl.conf
```

The last method will load settings permanently at boot time from `/etc/sysctl.conf` file.

Solution from [here](https://www.cyberciti.biz/faq/howto-set-sysctl-variables/).