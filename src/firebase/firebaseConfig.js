import * as firebase from 'firebase/app'
import 'firebase/database'

let firebaseConfig = {
    apiKey: "AIzaSyBLEAMTyc9vc44vT6UxnYvIYU_WDQXBJFE",
    authDomain: "onlinebooking-74b8a.firebaseapp.com",
    databaseURL: "https://onlinebooking-74b8a.firebaseio.com",
    projectId: "onlinebooking-74b8a",
    storageBucket: "onlinebooking-74b8a.appspot.com",
    messagingSenderId: "330945837242",
    appId: "1:330945837242:web:426266d0ab59480f082a83",
    measurementId: "G-ZJZVRGT0XD"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export let db =  firebase.database();
export default firebase;