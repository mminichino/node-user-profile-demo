// User Profile Microservice
console.log("User Profile Microservice");

const pjson = require('./package.json');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const useragent = require('express-useragent');
const couchbase = require('couchbase')
const toBoolean = require('to-boolean');
const config = require('./config');
const useTls = toBoolean(config.cbTls)
const startTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
global.useragent = useragent;
global.startTime = startTime;

console.log("Couchbase Cluster: " + config.cbHost + " User/Bucket: " + config.cbUser + "/" + config.cbBucket);

let cbString;
if (useTls) {
    cbString = 'couchbases://' + config.cbHost + '?ssl=no_verify&config_total_timeout=15&config_node_timeout=10&network=' + config.cbNetwork;
} else {
    cbString = 'couchbase://' + config.cbHost + '?config_total_timeout=15&config_node_timeout=10&network=' + config.cbNetwork;
}

console.log("Connecting to Couchbase");
global.cluster = new couchbase.Cluster(cbString, {username: config.cbUser, password: config.cbPassword});
global.bucket = cluster.bucket(config.cbBucket);
global.data_collection = bucket.scope(config.scope).collection(config.userData);
global.image_collection = bucket.scope(config.scope).collection(config.userImages);
global.auth_collection = bucket.scope(config.scope).collection(config.serviceAuth);
let auth_record = 1;
let auth_key = config.serviceAuth + ':' + auth_record.toString();

//REST interface
const {checkToken} = require('./auth');
const {getRESTAPINickname} = require('./nickname');
const {getRESTAPIUsername} = require('./username');
const {getRESTAPIId} = require('./id');

//Service Port
const port = config.servicePort;

// Configure Service
console.log("Starting Microservice " + pjson.version);
app.set('port', port);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

auth_collection.lookupIn(auth_key, [couchbase.LookupInSpec.get('token'),], function (err, result) {
    if (err) throw(err);
    if (result.length !== 0) {
        global.authKey = result.content[0].value
    } else {
        console.log('Service Token Not Found');
        throw(err);
    }
});

app.get('/api/v1/nickname/:nickname', checkToken, getRESTAPINickname);
app.get('/api/v1/username/:username', checkToken, getRESTAPIUsername);
app.get('/api/v1/id/:id', checkToken, getRESTAPIId);

// start the app and listen on the port
app.listen(port, () => {
    console.log('Server running on port: ' + port);
});
