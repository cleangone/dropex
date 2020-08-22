import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { uid } from 'quasar'

/*
   dropItem:
      id
      dropId
      name
      startPrice
      currPrice
      currBidderId
      lastUserActivityDate
      status: Available, Dropping, Hold
      dropDoneDate
*/

const state = {   
    dropItems: []
}

const actions = {
   bindDropItems: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('dropItems', collection())
   }),
   createDropItem: firestoreAction((context, dropItem) => {
      // console.log("createDropItem", dropItem)
      dropItem.id = uid()
      collection().doc(dropItem.id).set(dropItem)
   }),
   updateDropItem: firestoreAction((context, dropItem) => {
      // console.log("updateDropItem", dropItem)
      collection().doc(dropItem.id).set(dropItem)
   }),
   deleteDropItem: firestoreAction((context, id) => { 
      // console.log("deleteDropItem", id)
      collection().doc(id).delete()
   }),
}

function collection() { return firestore.collection('dropItems') }

const getters = {
   dropItemsExist: state => { return state.drops && state.drops.length > 0 },
   getDropItems: state => dropId => { 
      // console.log("getDropItems: dropId", dropId) 
      let dropItems = []
      state.dropItems.forEach(dropItem => {
         if (dropItem.dropId == dropId) {
            dropItems.push(dropItem)
         }
      })

      dropItems.sort((a, b) => (a.name > b.name) ? 1 : -1)

      return dropItems
   },
}

export default {
	namespaced: true,
	state,
	// mutations,
	actions,
	getters
}