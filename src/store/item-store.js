import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { uid } from 'quasar'

/*
   item
      id
      dropId
      name
      createdDate
      startPrice
      bidderIds
      currBidderId
      buyerId
      buyerName
      buyPrice
      lastUserActivityDate
      status: Available, Dropping, Hold
      dropDoneDate
*/

const state = { 
   items: [] 
}

const actions = {
   bindItems: firestoreAction(({ bindFirestoreRef }) => { return bindFirestoreRef('items', collection()) }),
   createItem: firestoreAction((context, item) => {
      item.id = uid()
      item.createdDate = Date.now()
      collection().doc(item.id).set(item)
   }),
   setItem: firestoreAction((context, item) => { collection().doc(item.id).set(item) }),
   updateItem: firestoreAction((context, item) => { collection().doc(item.id).update(item) }),
   deleteItem: firestoreAction((context, id) => { collection().doc(id).delete() }),
}

function collection() { return firestore.collection('items') }

const getters = {
   itemsExist: state => { return state.items && state.items.length > 0 },
   getItems: state => dropId => { 
      // console.log("getItems", state.items)
      let items = []
      state.items.forEach(item => {
         if (item.dropId == dropId) {
            items.push(item)
         }
      })

      items.sort((a, b) => (a.name > b.name) ? 1 : -1)
      return items
   },
   getItem: state => itemId => { 
      for (var item of state.items) {
         if (item.id == itemId) { return item }
      }
      return null
   },
}

export default {
	namespaced: true,
	state,
	// mutations,
	actions,
	getters
}