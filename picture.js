// Get Picture Data
const {imageGet, imageDataGet} = require('./db');
const couchbase = require("couchbase");

module.exports = {
    getRESTAPIPictureId: (req, res) => {
        let timestamp = Date.now();

        // execute lookup
        imageGet(req.params.id)
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
    getRESTAPIImageData: (req, res) => {
        let timestamp = Date.now();

        // execute lookup
        imageDataGet(req.params.id)
            .then(([image, codec]) => {
                let buff = new Buffer.from(image, 'base64');
                let headerType = "image/" + codec
                res.contentType(headerType);
                res.end(buff, 'binary');
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
