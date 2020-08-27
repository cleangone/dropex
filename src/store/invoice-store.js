import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { uid } from 'quasar'

/*
   invoice
      id
      userId
      createdDate
      items[] - itemId, name, price
      status: created, sent, paid, shipped
      subTotal
      shippingCharge
      priceAdjustment
      total
*/

const state = {   
    invoices: []
}

const actions = {
   bindInvoices: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('invoices', collection())
   }),
   createInvoice: firestoreAction((context, invoice) => {
      console.log("createInvoice", invoice)
      invoice.id = uid()
      invoice.createdDate = Date.now()
      invoice.total = invoice.subTotal + invoice.shippingCharge - invoice.priceAdjustment 
   
      collection().doc(invoice.id).set(invoice)
   }),
   updateInvoice: firestoreAction((context, invoice) => {
      console.log("updateInvoice", invoice)
      collection().doc(invoice.id).set(invoice)
   }),
   deleteInvoice: firestoreAction((context, id) => { 
      console.log("deleteInvoice", id)
      collection().doc(id).delete()
   }),
}

function collection() { return firestore.collection('invoices') }

const getters = {
   invoicesExist: state => { return state.invoices && state.invoices.length > 0 },
   getInvoices: state => { 
      return state.invoices
   },
   getInvoice: state => invoiceId => {
      for (var invoice of state.invoices) {
         if (invoice.id == invoiceId) { return invoice }
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