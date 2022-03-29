// REST API Get by ID
const config = require('./config');
const couchbase = require('couchbase')

module.exports = {
    getRESTAPIId: (req, res) => {
        let timestamp = Date.now();
        let records = []

        // execute lookup
        let recordKey = config.userData + ':' + req.params.id
        data_collection.get(recordKey, (err, record) => {
            if (err) {
                if (err instanceof couchbase.DocumentNotFoundError) {
                    res.status(404);
                    res.json({
                        responseTime: timestamp,
                        status: "failure",
                        message: {
                            error: "Not Found"
                        }
                    });
                } else {
                    console.log(err);
                    res.status(500);
                    res.json({
                        responseTime: timestamp,
                        status: "failure",
                        message: {
                            error: "Key-Value Lookup Failed"
                        }
                    });
                }
            } else {
                records.push(record.content)
                res.json(records);
            }
        });
    },
};
