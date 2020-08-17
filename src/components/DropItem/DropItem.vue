<template>
	<q-card class="card q-pl-sm">
		<q-card-section class="q-px-xs">
         <div class="text-bold">{{ dropItem.name }}</div>
         <div v-if="isHold" class="text-bold">On Hold</div>
         <div v-else>Price: ${{ currPrice }}</div>
         <drop-item-timer v-if="isDropping" :dropItem="dropItem"/>
      </q-card-section>	
      <q-card-section class="q-pa-md"/>
		<q-card-actions class="absolute-bottom q-pa-none">
         <q-btn v-if="!isHold" @click="promptToBid()" label="Bid" color="primary" class="q-ma-sm" small/>
			<q-btn @click="showEditModal = true" icon="edit" color="blue" flat small class="col" align="right"/>
         <q-btn icon="delete" @click="promptToDelete()" flat color="red" />
		</q-card-actions> 
		<q-dialog v-model="showEditModal">
			<drop-item-add-edit type="edit" :dropItem="dropItem" @close="showEditModal=false" />
		</q-dialog> 
  	</q-card> 
</template>

<script>
   import { mapState, mapGetters, mapActions } from 'vuex'
   import { DropItemStatus } from '../../constants/Constants.js'
   
   export default {
      props: ["dropItem"],
      data() {
         return {
            showEditModal: false
         }
      },
      computed: {
         ...mapState('auth', ['userId']),
         ...mapGetters('drop', ['dropsExist']),
         isDropping() { return this.dropItem.status == DropItemStatus.DROPPING },
         isHold() { return this.dropItem.status ==  DropItemStatus.HOLD },
         currPrice() { return this.dropItem.currPrice ? this.dropItem.currPrice  : this.dropItem.startPrice }
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
         promptToDelete() { 
				// console.log("promptToDelete", dropItemId)
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + this.dropItem.name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.deleteDropItem(this.dropItem.id) })
         }
      },
      components: {
         'drop-item-add-edit' : require('components/DropItem/DropItemAddEdit.vue').default,
         'drop-item-timer' : require('components/DropItem/DropItemTimer.vue').default
      }
   }
</script>