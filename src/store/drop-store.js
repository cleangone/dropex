import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { uid } from 'quasar'

/*
   drop:
      id
      name
      startDate
      bidAdditionalSeconds
*/

const state = {   
    drops: []
}

const actions = {
   bindDrops: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('drops', collection())
   }),
   createDrop: firestoreAction((context, drop) => {
      console.log("createDrop", drop)
      drop.id = uid()
      collection().doc(drop.id).set(drop)
   }),
   updateDrop: firestoreAction((context, drop) => {
      console.log("updateDrop", drop)
      collection().doc(drop.id).set(drop)
   }),
   deleteDrop: firestoreAction((context, id) => { 
      console.log("deleteDrop", id)
      collection().doc(id).delete()
   }),
}

function collection() { return firestore.collection('drops') }

const getters = {
   dropsExist: state => { return state.drops && state.drops.length > 0 },
   getDrops: state => { 
      // const sortedNotes = []
      // Object.assign(sortedNotes, state.notes)
      // sortedNotes.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
      
      return state.drops
   },
   getDrop: state => dropId => {
      let returnDrop = null

      //console.log("getDrop: dropId", dropId) 
      state.drops.forEach(drop => {
         //console.log("getDrop: checking", drop) 
         if (drop.id == dropId) {
            //console.log("getDrop", drop) 
            returnDrop = drop
         }
      })
      return returnDrop
  },
}

export default {
	namespaced: true,
	state,
	// mutations,
	actions,
	getters
}