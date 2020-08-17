import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { Notify, uid } from 'quasar'
import { BidStatus } from '../constants/Constants.js'
   
/*
   bid:
      id
      dropItemId
      userId
      createdDate
      amount
      status: Submitted, Processed 
         todo: no Error state anymore - can't figure out how to set it in functions w/ async delay of processed
      processedDate
*/

const actions = {
   createBid: firestoreAction((context, bid) => {
      console.log("createBid", bid)
      
      let error = null
      if (!bid.dropItemId)  { error = "bid.dropItemId not set"}
      else if (!bid.userId) { error = "bid.userId not set"}
      else if (!bid.amount) { error = "bid.amount not set"}
      
      if (error)
      {
         console.log("Bid Error: " + error)
         showNegativeNotify("Bid submitted")
         return
      }
       
      bid.id = uid()
      bid.createdDate = Date.now()
      bid.status = BidStatus.SUBMITTED
      firestore.collection('bids').doc(bid.id).set(bid)
   
      showPositiveNotify("Bid submitted")
   })
}

function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}
function showNegativeNotify(msg) { Notify.create( {type: "negative", timeout: 5000, message: msg} )}

export default {
	namespaced: true,
	actions,
}