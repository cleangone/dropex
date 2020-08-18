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
   hasUsers: state => { return state.users && state.users.length > 0 },
   getUsers: state => { return state.users },
   getUser: state => userId => {
      //console.log("getUser", userId, state.users)
      let user = { id: userId }
      state.users.forEach(u => {
         //console.log("getUser: checking " + u.id + " == " + userId)
         if (u.id == userId) { 
            //console.log("getUser: match")
            user = u }
      })
      return user
   }, 
   isAdmin: state => userId => {
      state.users.forEach(user => {
         if (user.id == userId) { return user.isAdmin }
      })
      return false
   }
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}