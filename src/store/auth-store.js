import { firebaseAuth } from 'boot/firebase'

const state = {
    userId: null,
}

const mutations = {
    setUserId(state, value) { state.userId = value }
}

const actions = {
    // payload = {email, password}
    async registerUser({}, payload) { return firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password) },
    async loginUser({}, payload) { return firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password) },
    logoutUser() { firebaseAuth.signOut() },
    handleAuthStateChange({commit, dispatch}) { 
        //console.log('handleAuthStateChange')
        firebaseAuth.onAuthStateChanged(user => {
            if (user) { 
                //console.log('handleAuthStateChange: logged in', user)
                commit ('setUserId', user.uid)    
            }
            else { 
                //console.log('handleAuthStateChange: logged out')
                commit ('setUserId', null) 
            }
        })
   }
}

const getters = {
    loggedIn: (state) => { return state.userId != null }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
