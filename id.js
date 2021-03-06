// REST API Get by ID
const couchbase = require('couchbase');
const {dataGet} = require("./db");

module.exports = {
    getRESTAPIId: (req, res) => {
        let timestamp = Date.now();

        // execute lookup
        dataGet(req.params.id)
            .then((result) => {
                let records = []
                records.push(result)
                res.json(records);
            })
            .catch((err) => {
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
            });
    },
};
