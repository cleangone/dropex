<template>
	<q-card class="card q-pl-sm">
		<q-card-section class="q-px-xs">
         <div class="text-bold">{{ dropItem.name }}</div>
         <div v-if="isAvailableForPurchase">
            <span>Price: ${{ currPrice }} </span>
            <span v-if="userIsCurrBidder" class="text-bold"> - You are the high-bidder</span>
            <span v-else-if="userIsOutbid" class="text-bold"> - You have been outbid</span>
         </div>
         <div v-else>
            On Hold
            <span v-if="userIsBuyer" class="text-bold"> - You are the the winning bidder</span>
         </div>
         <drop-item-timer v-if="isDropping" :dropItem="dropItem"/>
      </q-card-section>	
      <q-card-section class="q-pa-md"/>
		<q-card-actions class="absolute-bottom q-pa-none">
         <div v-if="isAvailableForPurchase">
            <q-btn v-if="loggedIn" @click="promptToBid()" label="Bid" color="primary" class="q-ma-sm" small/>
            <q-btn v-else to="/auth/login" label="Login to Bid" color="primary" class="q-ma-sm" small/>
         </div>
         <q-btn v-if="userIsAdmin" @click="showEditModal = true" icon="edit" color="blue" flat small class="col" align="right"/>
		</q-card-actions> 
		<q-dialog v-model="showEditModal">
			<drop-item-add-edit type="edit" :dropItem="dropItem" @close="showEditModal=false" />
		</q-dialog> 
  	</q-card> 
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { DropItemStatus } from '../../constants/Constants.js'
   
   export default {
      props: ["dropItem"],
      data() {
         return {
            showEditModal: false
         }
      },
      computed: {
         ...mapGetters('auth', ['loggedIn', 'userId']),
         ...mapGetters('user', ['getUser', 'isAdmin']),
         ...mapGetters('drop', ['dropsExist']),
         isAvailableForPurchase() { return this.dropItem.status ==  DropItemStatus.AVAILABLE || this.dropItem.status ==  DropItemStatus.DROPPING },
         isDropping() { return this.dropItem.status == DropItemStatus.DROPPING },
         currPrice() { return this.dropItem.currPrice ? this.dropItem.currPrice  : this.dropItem.startPrice },
         userIsCurrBidder() { return this.dropItem.currBidderId == this.userId },
         userIsOutbid() { return this.dropItem.bidders.includes(this.userId) && !this.userIsHigherBidder},
         userIsBuyer() { return this.dropItem.buyerId == this.userId },
         user() { return this.getUser(this.userId) },
         userIsAdmin() { return this.user && this.user.isAdmin }
      },
      methods: {
         ...mapActions('dropItem', ['deleteDropItem']),
         ...mapActions('bid', ['createBid']),
         promptToBid() {
				let bidAmount = this.dropItem.currPrice ? this.dropItem.currPrice + 25 : this.dropItem.startPrice
				this.$q.dialog({title: 'Confirm', message: 'Bid $' + bidAmount + ' on ' + this.dropItem.name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
               this.createBid({ dropItemId: this.dropItem.id, userId: this.userId, amount: bidAmount })
            })
			},
      },
      components: {
         'drop-item-add-edit' : require('components/DropItem/DropItemAddEdit.vue').default,
         'drop-item-timer' : require('components/DropItem/DropItemTimer.vue').default
      }
   }
</script>