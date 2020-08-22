import { firebaseAuth } from 'boot/firebase'

const state = {
   // vuex goes crazy if the entire user is stored 
   userId: null,
}

const mutations = {
   setUserId(state, id) { state.userId = id  }
}

const actions = {
   // firebase.auth accesses the default Auth, i.e. firebase.auth.Auth
   async reload({}) { return firebaseAuth.currentUser.reload() },
   async registerUser({}, payload) { return firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password) },
   async loginUser({}, payload) { return firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password) },
   async sendPasswordResetEmail({}, email) { return firebaseAuth.sendPasswordResetEmail(email) },
   async updateEmail({}, email) { return firebaseAuth.currentUser.updateEmail(email) },
   
   // todo - cannot figure out how to dynamically update user once verify email acted on
   // async sendEmailVerification({}) { 
   //    console.log("sendEmailVerification", firebaseAuth.currentUser)
   //    return firebaseAuth.currentUser.sendEmailVerification() 
   // },
   logoutUser() { firebaseAuth.signOut() },
   handleAuthStateChange({commit, dispatch}) { 
      firebaseAuth.onAuthStateChanged(user => {
         if (user) { 
               // console.log('handleAuthStateChange: logged in', user)
               commit ('setUserId', user.uid)    
         }
         else { 
               // console.log('handleAuthStateChange: logged out')
               commit ('setUserId', null) 
               this.$router.push("/").catch(err => {}) // will error if already on "/"
         }
      })
   },
   // todo: not firing when user changes password via email link
   handleAuthTokenChange({commit, dispatch}) { 
      firebaseAuth.onIdTokenChanged(user => {
   
         // console.log("onIdTokenChanged", user, firebaseAuth.currentUser)
      })
      // .catch(error => { 
      //    console.log("onIdTokenChanged error", error)
      // })
   },

   
}

const getters = {
   loggedIn: (state) => { return state.userId != null },
   userId: (state) => { return state.userId },
   currentUser: (state) => { 
      console.log("auth-store.currentUser")
      return state.userId ? firebaseAuth.currentUser : null },


      userEmail() { return this.currentUser ? this.currentUser.email : null },
      emailVerified() { 
         console.log("emailVerified", this.currentUser)
         // await firebaseAuth.currentUser.reload();
         return (this.currentUser ? this.currentUser.emailVerified : false) } 


}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
