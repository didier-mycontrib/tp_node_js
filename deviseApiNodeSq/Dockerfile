FROM node:8
# this new image will be create from parent image = node:8 (stable)

# Create app directory inside docker image
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY  package*.json  ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY .   .

#setting MODE ENV-VARIABLE to "prod" (not "dev") in order to use devise.db.host in other container (not "localhost")
ENV MODE=prod

EXPOSE 8080
CMD [ "npm", "start" ]
