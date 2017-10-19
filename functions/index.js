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

// Listens for any change on a session's "day" and created a field called day_room.
// It's a combined field for easier filtering.
exports.combineSessionDayAndRoomOnDay = functions.database.ref('/sessions/{sessionId}/day')
    .onWrite(event => {
        if (!event.data.exists()) {
            return;
        }

        const day = event.data.val();

        const roomRef = event.data.ref.parent.child('room');
        return roomRef.once("value")
            .then(snapshot => {
                const room = snapshot.val();

                console.log(`Day: ${day}, Room: ${room}`)

                return event.data.ref.parent.child("day_room").set(`${day}_${room}`)
            });

        console.log(`Day: ${day}, Room: ${room}`)

        return event.data.ref.parent.child("day_room").set(`${day}_${room}`)
    });

exports.combineSessionDayAndRoomOnRoom = functions.database.ref('/sessions/{sessionId}/room')
    .onWrite(event => {
        if (!event.data.exists()) {
            return;
        }

        const room = event.data.val();

        const dayRef = event.data.ref.parent.child('day');
        return dayRef.once("value")
            .then(snapshot => {
                const day = snapshot.val();

                console.log(`Day: ${day}, Room: ${room}`)

                return event.data.ref.parent.child("day_room").set(`${day}_${room}`)
            })
    });