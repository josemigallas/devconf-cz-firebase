const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// Listens for new feedback added to /votes/:userId/sessionId and creates 
// another one at /sessions/sessionId/votes/userId
exports.duplicateFeedback = functions.database.ref('/votes/{userId}/{sessionId}')
    .onWrite(event => {
        const userId = event.params.userId;
        const sessionId = event.params.sessionId;
        const vote = event.data.val();

        const baseNode = event.data.ref.parent.parent.parent;

        return baseNode.child('sessions').child(sessionId).child('votes').child(userId).set(vote);
    });