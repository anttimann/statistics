module.exports = {
    mongodb_url: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017/',
    mongodb_db: process.env.OPENSHIFT_APP_NAME || 'stats'
};