// Auth Module

module.exports = {
    checkToken: (req, res, next) => {
        let token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'] || req.headers['authorization'];
        let timestamp = Date.now();
        if (token) {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }
            if (token !== authKey) {
                return res.json({
                    responseTime: timestamp,
                    status: "failure",
                    message: {
                        text: "Invalid Credentials"
                    }
                });
            } else {
                next();
            }
        } else {
            return res.json({
                responseTime: timestamp,
                status: "failure",
                message: {
                    text: "Invalid Authorization"
                }
            });
        }
    },
};
