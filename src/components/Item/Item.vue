<template>
	<q-card class="card q-pl-sm">
		<q-card-section class="q-px-xs">
         <div class="text-bold">{{ item.name }}</div>
         <div v-if="isAvailableForPurchase">
            <span>Price: ${{ currPrice }} </span>
            <span v-if="userIsCurrBidder" class="text-bold"> - You are the high-bidder</span>
            <span v-else-if="userIsOutbid" class="text-bold"> - You have been outbid</span>
         </div>
         <div v-else>
            On Hold
            <span v-if="userIsBuyer" class="text-bold"> - You are the the winning bidder</span>
         </div>
         <item-timer v-if="isDropping" :item="item"/>
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
			<item-add-edit type="edit" :item="item" @close="showEditModal=false" />
		</q-dialog> 
  	</q-card> 
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { ItemStatus } from 'src/constants/Constants.js'
   
   export default {
      props: ["item"],
      data() {
         return {
            showEditModal: false
         }
      },
      computed: {
         ...mapGetters('auth', ['loggedIn', 'userId']),
         ...mapGetters('user', ['getUser', 'isAdmin']),
         ...mapGetters('drop', ['dropsExist']),
         isAvailableForPurchase() { return this.item.status ==  ItemStatus.AVAILABLE || this.item.status ==  ItemStatus.DROPPING },
         isDropping() { return this.item.status == ItemStatus.DROPPING },
         currPrice() { return this.item.currPrice ? this.item.currPrice  : this.item.startPrice },
         userIsCurrBidder() { return this.item.currBidderId == this.userId },
         userIsOutbid() { return this.item.bidders.includes(this.userId) && !this.userIsHigherBidder},
         userIsBuyer() { return this.item.buyerId == this.userId },
         user() { return this.getUser(this.userId) },
         userIsAdmin() { return this.user && this.user.isAdmin }
      },
      methods: {
         ...mapActions('bid', ['createBid']),
         promptToBid() {
				let bidAmount = this.item.currPrice ? this.item.currPrice + 25 : this.item.startPrice
				this.$q.dialog({title: 'Confirm', message: 'Bid $' + bidAmount + ' on ' + this.item.name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
               this.createBid({ itemId: this.item.id, userId: this.userId, amount: bidAmount })
            })
			},
      },
      components: {
         'item-add-edit' : require('components/Item/ItemAddEdit.vue').default,
         'item-timer' : require('components/Item/ItemTimer.vue').default
      }
   }
</script>