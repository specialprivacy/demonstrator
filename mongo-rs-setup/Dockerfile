FROM mongo:4.0.4

# Create app directory
WORKDIR /usr/src/configs

# Install app dependencies
COPY mongoSetup.js .
COPY setup.sh .
COPY dbSetup.js .

# RUN
RUN ["chmod", "+x", "./setup.sh"]
CMD ["./setup.sh"]