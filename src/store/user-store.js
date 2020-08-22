import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import User from 'src/models/User'
	
/*
    user: 
      id (auth userId)    
      firstName
      lastName
      isAdmin   
*/  

const state = {
	users: []
}

const actions = {
   bindUsers: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('users', collection())
   }),
   setUser: firestoreAction((context, user) => {
      console.log("setUser", user)
      collection().doc(user.id).set(user)
   })
}

function collection() { return firestore.collection('users') }

const getters = {
   hasUsers: state => { return state.users && state.users.length > 0 },
   getUsers: state => { return state.users },
   getUser: state => userId => {
      for (var user of state.users) {
          if (user.id == userId) { return user }
      }
      return { id: userId }
   }, 
   isAdmin: state => userId => { 
      let user = getters.getUser(userId)
      console.log("isAdmin", user)
      return user.isAdmin
   }
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}