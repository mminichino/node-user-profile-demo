module.exports = {
    servicePort: process.env.SERVICE_PORT || 8080,
    scope: process.env.DATA_SCOPE || "profiles",
    userData: process.env.USER_DATA || "user_data",
    userImages: process.env.USER_IMAGES || "user_images",
    serviceAuth: process.env.SERVICE_AUTH || "service_auth",
    cbTls: process.env.COUCHBASE_TLS || "true",
    cbNetwork: process.env.COUCHBASE_NETWORK || "external",
    cbHost: process.env.COUCHBASE_HOST || "127.0.0.1",
    cbUser: process.env.COUCHBASE_USER || "Administrator",
    cbPassword: process.env.COUCHBASE_PASSWORD || "password",
    cbBucket: process.env.COUCHBASE_BUCKET || "sample_app"
};
