import firebase from 'firebase'

// <script src="https://www.gstatic.com/firebasejs/4.13.0/firebase.js"></script>
// <script>
  // Initialize Firebase
const config = {
    apiKey: "AIzaSyBTudJmSTncvPdY-BBJKXpNvB6G9tt5JCs",
    authDomain: "timeforquiz-2323b.firebaseapp.com",
    databaseURL: "https://timeforquiz-2323b.firebaseio.com",
    projectId: "timeforquiz-2323b",
    storageBucket: "timeforquiz-2323b.appspot.com",
    messagingSenderId: "59523509856"
  };
  firebase.initializeApp(config);
// </script>

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const authfb = new firebase.auth.FacebookAuthProvider()
export default firebase;
