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
   setDrop: firestoreAction((context, drop) => {
      console.log("setDrop", drop)
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
      for (var drop of state.drops) {
         if (drop.id == dropId) { return drop }
      }

      return null
  },
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}