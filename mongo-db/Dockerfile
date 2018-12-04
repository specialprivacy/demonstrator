FROM mongo:4.0.4

# Working config directory
WORKDIR /usr/src/configs

COPY ./mongo.conf .
COPY ./data /data

EXPOSE 27017

# CMD Instruction
CMD ["--config", "./mongo.conf"]