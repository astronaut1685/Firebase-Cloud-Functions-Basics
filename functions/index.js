// Definetly use local testing by writing 

const functions = require('firebase-functions');
// Admin SDK Module, using Node 'require' statement
const admin = require('firebase-admin');
const { object } = require('firebase-functions/lib/providers/storage');

// initilization is the process of locatng and using the defind values for variable data. 
//      it can be done either by sttically embedding the value at comile time or by assignemtn at run time.
//      it can be performed by a constructor in OOP or by initializer/instance method
admin.initializeApp();
// Admin allows for powerful way to integrate firebase using cloud functions

// This will take the text parameter passed to this HTTP endpoint and insert it into 
        // cloud firestore under the path /messages/:documentId/origina;
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // we grab the text of the parameter 
    try {
    functions.logger.log(req, res);
    // To give origianl value write addMessage?customField=uppercaseme
    const original = req.query.customField;
    functions.logger.log(original);
    // Push the new message into clod firestore using 
    const writeResult = admin.firestore().collection('messages').add({"test": "test", "original" : original});
    functions.logger.log(writeResult);
    // ESLint doesn't allow normal singal quotes but insists on bakquotes
    // This is how I managed to return the ID of the store
    return res.json({result: `Message with ID: ${(await writeResult).id} added.`});
    }
    catch(error) {
        res.send(`error ${error}`);
        // to terminate a http functions you can use res.redirect(), res.send(), res.end()
        // to terminate an asynchrounous processing return a JavaScript promise
        // to terminate a syncronous function wit a return; statement
        // Promises are a modern alternative to callback  for asynchronous code. 
        //  Promise represents an operation and the future value it may return. 
    }
});

// Listens for new messages added to /messages/:documentId/original and creates an
//  uppercase version of the message to /messages/:documentId/uppercase
// this function will execute when Cloud Firestore is written to.
exports.makeUppercase 
    // Cloud firestore triggers the onWrite() callback whenever data is written or updated on given document
    = functions.firestore
    // {documentId} surround 'parameters' wildcards that expose their matched data in the callback
        .document('/messages/{documentId}')
        .onCreate((snap, context) => {  
            // Grab the current value of what was wrritten to cloud Firestore
            const original = snap.data().original;

            // Access the parameter `{documentId}` with `context.params`
            functions.logger.log('Uppercasing', context.params.documentID, original);

            const uppercase = original.toUpperCase();

            // You must return a Promise when perofrming asynchronous tasks inside 
            //    Writing to Cloud Firestore
            // Setting an 'uppercase' field in Cloud Firestore document returns a Promise. 
            // The ref.set function defines the document to listen on - for performacne reasons
            //  be as specific as possible
            // Event-driven functions such as Cloud Firestore events are asynchronous. The callback function 
            //  should return either a null, an object, or a promise. If you do not return anything the function times out signaling an error and is retired
            return snap.ref.set({uppercase}, {merge: true});
        // Be careful to avoid any situation where functins 
        //  results actually retriggers the functions and thus creating an infinite loop
       });



exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


// Firebase cli automatically install the firebase and firebase sdk for cloud functions node modules, 
//     for adding additional dependancies you can modify package.json and run NPM install