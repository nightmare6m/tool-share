const {Firestore} = require('@google-cloud/firestore');


// Create a new client
const firestore = new Firestore({ projectId:
    process.env.FIREBASE_PROJECT_ID, keyFilename: './gcp-key.json'
    });

async function setDocument(documentId, data){
    const document = firestore.doc(`${process.env.ROOT_COLLECTION}/${documentId}`);
    await document.set(data);
}
async function getDocument(documentId){
    const document = firestore.doc(`${process.env.ROOT_COLLECTION}/${documentId}`);
    const doc = await document.get();
    return doc.exists?doc.data():null;
}

module.exports = {
    getDocument,
    setDocument
}