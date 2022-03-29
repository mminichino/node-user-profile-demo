// DB Logic
const config = require('./config');
const couchbase = require('couchbase');
const toBoolean = require("to-boolean");
const useTls = toBoolean(config.cbTls)
const options = {}
let cbString;
if (useTls) {
    cbString = 'couchbases://' + config.cbHost + '?ssl=no_verify&config_total_timeout=15&config_node_timeout=10&network=' + config.cbNetwork;
} else {
    cbString = 'couchbase://' + config.cbHost + '?config_total_timeout=15&config_node_timeout=10&network=' + config.cbNetwork;
}
const cluster = new couchbase.Cluster(cbString, {username: config.cbUser, password: config.cbPassword});
const bucket = cluster.bucket(config.cbBucket);
const data_collection = bucket.scope(config.scope).collection(config.userData);
const image_collection = bucket.scope(config.scope).collection(config.userImages);
const auth_collection = bucket.scope(config.scope).collection(config.serviceAuth);

function dataGet(key) {
    return new Promise(
        (resolve, reject) => {
            let recordKey = config.userData + ':' + key
            data_collection.get(recordKey, (err, record) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(record.content);
                }
            });
        });
}

function dataQuery(field, value) {
    let keyspace = config.cbBucket + '.' + config.scope + '.' + config.userData
    let query = "SELECT * FROM " + keyspace + " WHERE " + field + "= \"" + value + "\";";
    let records = []
    return new Promise(
        (resolve, reject) => {
            cluster.query(query, options, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
}

function imageGet(key) {
    return new Promise(
        (resolve, reject) => {
            let recordKey = config.userImages + ':' + key
            image_collection.get(recordKey, (err, record) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(record.content);
                }
            });
        });
}

function authGet(key) {
    return new Promise(
        (resolve, reject) => {
            let recordKey = config.serviceAuth + ':' + key
            auth_collection.lookupIn(recordKey, [couchbase.LookupInSpec.get('token'),],(err, record) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(record.content[0].value);
                }
            });
        });
}

module.exports.dataGet=dataGet;
module.exports.dataQuery=dataQuery;
module.exports.imageGet=imageGet;
module.exports.authGet=authGet;
