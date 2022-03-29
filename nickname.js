// REST API Get by Nickname
const {dataQuery} = require('./db');

module.exports = {
    getRESTAPINickname: (req, res) => {
        let timestamp = Date.now();

        // execute lookup
        dataQuery('nickname', req.params.nickname)
            .then((result) => {
                if (result.length === 0) {
                    res.status(404);
                    res.json({
                        responseTime: timestamp,
                        status: "failure",
                        message: {
                            error: "Not Found"
                        }
                    });
                } else {
                    res.json(result);
                }
            })
            .catch((err) => {
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
            });
    },
};
