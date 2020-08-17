import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { Notify, uid } from 'quasar'
import { BidStatus } from '../constants/Constants.js'
   
const state = {   
   userId: "test123", // hardcoded for initial testing
}

const getters = {
   loggedIn: (state) => { return state.userId != null }
}

export default {
	namespaced: true,
   state,
   getters
}