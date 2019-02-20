FROM alpine

# bash is necessary for the wait-for-it script
# git, go and musl-dev are necessary to install and run gongfig
RUN apk add --update bash git go musl-dev

ENV GOPATH="$HOME/go"
ENV PATH="$GOPATH/bin:/usr/local/go/bin:$PATH"

RUN go get "github.com/romanovskyj/gongfig"

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

COPY config.yaml /config.yaml
