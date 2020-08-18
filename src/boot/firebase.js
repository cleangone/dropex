import firebase from "firebase/app"
import 'firebase/firestore'
import { firebaseConfig } from './firebaseConfig.js';

import "firebase/auth"
import "firebase/database"
import "firebase/storage"

let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth();
let firestore = firebaseApp.firestore()
const { TimeStamp, GeoPoint } = firebase.firestore

export { firebaseAuth, firestore, TimeStamp, GeoPoint }
