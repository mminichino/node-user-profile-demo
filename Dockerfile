FROM node:16.14.2
WORKDIR /app
ADD . /app
RUN rm -rf /app/node_modules
RUN npm install -g npm@latest
RUN npm install
EXPOSE 8080
CMD npm start
