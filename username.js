// REST API Get by Username
const config = require('./config');

module.exports = {
    getRESTAPIUsername: (req, res) => {
        let timestamp = Date.now();
        let keyspace = config.cbBucket + '.' + config.scope + '.' + config.userData
        let query = "SELECT record_id FROM " + keyspace + " WHERE user_id = \"" + req.params.username + "\";";
        const options = {}
        let records = []

        // execute query
        cluster.query(query, options, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500);
                res.json({
                    responseTime: timestamp,
                    status: "failure",
                    message: {
                        error: "Query Failed",
                        text: err.context.first_error_message
                    }
                });
            } else if (result.rows.length === 0) {
                res.status(404);
                res.json({
                    responseTime: timestamp,
                    status: "failure",
                    message: {
                        error: "Not Found"
                    }
                });
            } else {
                let numResults = result.rows.length;
                let currentResult = 0;
                for (const row of result.rows) {
                    let string = JSON.stringify(row);
                    let objectValue = JSON.parse(string);
                    let recordId = objectValue['record_id']
                    let recordKey = config.userData + ':' + recordId
                    data_collection.get(recordKey, (err, record) => {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.json({
                                responseTime: timestamp,
                                status: "failure",
                                message: {
                                    error: "Key-Value Lookup Failed",
                                }
                            });
                        } else if (record) {
                            currentResult++;
                            records.push(record.content)
                            if (currentResult === numResults) {
                                res.json(records);
                            }
                        }
                    });
                }
            }
        });
    },
};
