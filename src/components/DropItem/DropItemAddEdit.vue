<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">{{ type }} Drop Item</div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-none">
	      <q-input v-model="dropItemToSubmit.name" label="Name" ref="name" filled class="col"
	      	:rules="[ val => !!val || '* Required',
	          	val => val.length < 21 || 'Please use maximum 20 characters' ]" />
    	</div>
      <div class="row q-mb-none q-gutter-sm">
         <q-select label="Status" v-model="dropItemToSubmit.status" :options="statusOptions" class="col" filled/>
			<q-input v-model.number="dropItemToSubmit.startPrice" label="Price" type=number prefix="$" filled class="col" />
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
   import { DropItemStatus } from '../../constants/Constants.js'
	
	export default {
		props: ['type', 'dropItem', 'dropId'],
		data() {
			return {
				dropItemToSubmit: {
               name: '',
               dropId: '',	
               status: DropItemStatus.AVAILABLE,
               startPrice: 0,
					currPrice: 0,
					bidders: []
            },
            statusOptions: [ DropItemStatus.AVAILABLE, DropItemStatus.DROPPING, DropItemStatus.HOLD ],
						
			}
		},
		methods: {
			...mapActions('dropItem', ['createDropItem', 'updateDropItem']),
			submitForm() {
				console.log("submitForm")
				this.$refs.name.validate()

				if (!this.$refs.name.hasError) {
               if (this.dropItemToSubmit.status == DropItemStatus.AVAILABLE) { 
                  this.dropItemToSubmit.currPrice = 0 
                  this.dropItemToSubmit.currBidderId = ''
                  this.dropItemToSubmit.winningBidderId = ''
                  this.dropItemToSubmit.dropDoneDate = 0 
						this.dropItemToSubmit.lastUserActivityDate = 0 
						this.dropItemToSubmit.bidders = []
               }
					this.$emit('close')
					this.createUpdateDropItem()
				}
			},
			createUpdateDropItem() {
            console.log("createUpdateDrop", this.dropToSubmit)
            if (this.type == 'add') { this.createDropItem(this.dropItemToSubmit) }
				else { this.updateDropItem(this.dropItemToSubmit) }
			}
		},
		mounted() {
			if (this.type == 'edit') {
            // slight delay because param update propagating as modal being popped up
            setTimeout(() => { this.dropItemToSubmit = Object.assign({}, this.dropItem) }, 100)  
         }
         else {
            // slight delay because param update propagating as modal being popped up
            setTimeout(() => { this.dropItemToSubmit.dropId = this.dropId }, 100)  
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