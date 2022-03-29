// User Profile Microservice
console.log("User Profile Microservice");

const pjson = require('./package.json');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const useragent = require('express-useragent');
const config = require('./config');
const startTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
global.useragent = useragent;

console.log(startTime);
console.log("Couchbase Cluster: " + config.cbHost + " User/Bucket: " + config.cbUser + "/" + config.cbBucket);

//REST interface
const {checkToken} = require('./auth');
const {getRESTAPINickname} = require('./nickname');
const {getRESTAPIUsername} = require('./username');
const {getRESTAPIId} = require('./id');
const {getRESTAPIPictureId} = require('./picture');
const {authGet} = require('./db');
let auth_record = 1;

authGet(auth_record)
    .then((result) => {
        global.authKey = result
    })
    .catch((err) => {
        console.log('Service Token Not Found');
        throw(err);
    });

//Service Port
const port = config.servicePort;

// Configure Service
console.log("Starting Microservice " + pjson.version);
app.set('port', port);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/v1/nickname/:nickname', checkToken, getRESTAPINickname);
app.get('/api/v1/username/:username', checkToken, getRESTAPIUsername);
app.get('/api/v1/id/:id', checkToken, getRESTAPIId);
app.get('/api/v1/picture/record/:id', checkToken, getRESTAPIPictureId);

// start the app and listen on the port
app.listen(port, () => {
    console.log('Server running on port: ' + port);
});
