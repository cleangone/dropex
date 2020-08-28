<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">{{ type }} Item</div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-none">
	      <q-input v-model="itemToSubmit.name" label="Name" ref="name" filled class="col"
	      	:rules="[ val => !!val || '* Required',
	          	val => val.length < 21 || 'Please use maximum 20 characters' ]" />
    	</div>
      <div class="row q-mb-none q-gutter-sm">
         <q-select label="Status" v-model="itemToSubmit.status" :options="statusOptions" class="col" filled/>
			<q-input v-model.number="itemToSubmit.startPrice" label="Price" type=number prefix="$" filled class="col" />
		</div>
   </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn @click="submitForm" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { date } from 'quasar'
   import { mapActions } from 'vuex'
   import { ItemStatus } from 'src/constants/Constants.js'
	
	export default {
		props: ['type', 'item', 'dropId'],
		data() {
			return {
				itemToSubmit: {
               name: '',
               dropId: '',	
               status: ItemStatus.AVAILABLE,
               startPrice: 0,
					currPrice: 0,
					bidderIds: []
            },
            statusOptions: [ ItemStatus.AVAILABLE, ItemStatus.DROPPING, ItemStatus.HOLD ],
						
			}
		},
		methods: {
			...mapActions('item', ['createItem', 'setItem']),
			submitForm() {
				// console.log("submitForm")
				this.$refs.name.validate()

				if (!this.$refs.name.hasError) {
               if (this.itemToSubmit.status == ItemStatus.AVAILABLE) { 
                  this.itemToSubmit.buyPrice = 0 
                  this.itemToSubmit.bidderIds = []
                  this.itemToSubmit.currBidderId = ''
                  this.itemToSubmit.buyerId = ''
                  this.itemToSubmit.buyerName = ''
                  this.itemToSubmit.dropDoneDate = 0 
						this.itemToSubmit.lastUserActivityDate = 0 
               }
					this.$emit('close')
					this.persistItem()
				}
			},
			persistItem() {
            // console.log("persistItem", this.itemToSubmit)
            if (this.type == 'add') { this.createItem(this.itemToSubmit) }
				else { this.setItem(this.itemToSubmit) }
			}
		},
		mounted() {
			if (this.type == 'edit') {
            // slight delay because param update propagating as modal being popped up
            setTimeout(() => { this.itemToSubmit = Object.assign({}, this.item) }, 100)  
         }
         else {
            // slight delay because param update propagating as modal being popped up
            setTimeout(() => { this.itemToSubmit.dropId = this.dropId }, 100)  
			}
		}
   }
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
	.thumbnail {
		max-width: 100px;
		max-height: 100px;
	}
	.form-card .q-img {
		height: 56px;
		width: 56px;
		border-radius: 10px;
	}
	.form-card .q-img__image { background-size: cover !important; }
	.form-card .q-rating__icon { opacity: 0.2; }
	.form-card .q-rating__icon--active { opacity: 1; }
</style>