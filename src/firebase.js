import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const config = {
// Pick files from your cloud firestore authentication dashboard.
}

firebase.initializeApp(config);

//Export the database
export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

//SignIn and SignOut config
export const provider = new firebase.auth.GithubAuthProvider();
export const signInwithGoogle = () => auth.signInWithPopup(provider);
export const signOut = () => auth.signOut();

//Firestore settings
firestore.settings({ timestampsInSnapshots: true });

// For checking progress with web-dev tools
window.firebase = firebase;

//Create User profile and document for SignIn if No.account is available. 
export const createUserProfileDocument = async (user, additionalData) => {
    if (!user) return;

    //Get a reference to the place in the database where a user profile might be.
    const userRef = firestore.doc(`users/${user.uid}`);

    //Go fetch the document from that location.
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
        const { displayName, email, photoURL } = user;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName, email, photoURL, createdAt, ...additionalData
            })
        } catch (error) {
            console.error('Error creating user', error.message);
        }
    }
    return getUserDocument(user.uid);
};

//Remember to check permissions on firebase when dealing with a referenced document.
export const getUserDocument = async (uid) => {
    if (!uid) return null;

    try {
        const userDocument = await firestore.collection('users').doc(uid).get();
        return { uid, ...userDocument.data() };
    } catch (error) {
        console.error('Error fetching user', error.message);
    }
}

export default firebase;