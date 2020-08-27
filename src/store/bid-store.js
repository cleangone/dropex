import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { Notify, uid } from 'quasar'
import { BidStatus } from 'src/constants/Constants.js'
   
/*
   bid:
      id
      itemId
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
      if (!bid.itemId)      { error = "bid.itemId not set"}
      else if (!bid.userId) { error = "bid.userId not set"}
      else if (!bid.amount) { error = "bid.amount not set"}
      
      if (error)
      {
         console.log("Bid Error: " + error)
         return
      }
       
      bid.id = uid()
      bid.createdDate = Date.now()
      bid.status = BidStatus.CREATED
      firestore.collection('bids').doc(bid.id).set(bid)
   
      showPositiveNotify("Bid submitted")
   })
}

function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}

export default {
	namespaced: true,
	actions,
}