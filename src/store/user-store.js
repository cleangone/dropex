import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
	
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
   getUsers: state => { return state.users },
   getUser: state => userId => {
      for (var user of state.users) {
          if (user.id == userId) { return user }
      }
      return { id: userId }
   }, 
   isAdmin: state => userId => { 
      let user = getters.getUser(userId)
      return user ? user.isAdmin : false
   }
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}