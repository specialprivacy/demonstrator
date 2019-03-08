FROM kong:1.0.3-alpine

# bash is necessary for the wait-for-stop script
RUN apk add --update bash

COPY wait-for-stop.sh /wait-for-stop.sh
RUN chmod +x /wait-for-stop.sh

COPY special /special

# install kong OpenID Connect plugin
RUN luarocks install kong-oidc
