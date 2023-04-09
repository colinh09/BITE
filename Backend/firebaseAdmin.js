const admin = require('firebase-admin');

// Replace with the path to your service account JSON file
const serviceAccount = require('./saf.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
