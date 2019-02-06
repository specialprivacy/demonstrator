FROM kong:1.0.3-alpine
RUN apk add --update bash
COPY wait-for-stop.sh /wait-for-stop.sh
RUN chmod +x /wait-for-stop.sh
