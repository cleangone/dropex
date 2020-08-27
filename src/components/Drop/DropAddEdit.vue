<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">{{ type }} Drop</div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-sm">
	      <q-input v-model="dropToSubmit.name" label="Name" ref="name" filled class="col"
	      	:rules="[ val => !!val || '* Required',
	          	val => val.length < 21 || 'Please use maximum 20 characters' ]" />
    	</div>
	   <div class="row q-mb-xs q-gutter-sm">
         <q-input label="Start Date" v-model="startDate" mask="date" :rules="['date']" class="col" filled>
            <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
               <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
               <q-date v-model="startDate"  />
               </q-popup-proxy>
            </q-icon>
            </template>
         </q-input>
         <q-input :label="'Start Time ' + timezone" v-model="startTime" mask="time" :rules="['time']" class="col" filled>
            <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
               <q-popup-proxy transition-show="scale" transition-hide="scale">
               <q-time v-model="startTime" />
               </q-popup-proxy>
            </q-icon>
            </template>
         </q-input>
    	</div>
      <div class="row q-gutter-sm">
	      <q-input v-model.number="dropToSubmit.bidAdditionalSeconds" label="Bid Timer (seconds)" type=number filled class="col" />
         <div class="col"/>
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
   
	export default {
		props: ['type', 'drop'],
		data() {
			return {
				dropToSubmit: {
               name: '',	
               startDate: null,
               bidAdditionalSeconds: 60
            },
            startDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
            startTime: '09:00',
            timezone: localTimezone()
			}
		},
		computed: {		
    	},
		methods: {
			...mapActions('drop', ['createDrop', 'setDrop']),
			submitForm() {
				console.log("submitForm")
				this.$refs.name.validate()

				if (!this.$refs.name.hasError) {
					this.$emit('close')
					this.createUpdateDrop()
				}
			},
			createUpdateDrop() {
            // console.log("createUpdateDrop", this.dropToSubmit)

            let timezoneOffset = date.formatDate(new Date(), 'Z')
            var isoDate = this.startDate.replace("/", "-").replace("/", "-")
            let formattedStartDate = isoDate + "T" + this.startTime + ":00.000" + timezoneOffset 
            this.dropToSubmit.startDate = new Date(formattedStartDate)
            
            if (this.type == 'add') { this.createDrop(this.dropToSubmit) }
				else { this.setDrop(this.dropToSubmit) }
			}
		},
		mounted() {
			if (this.type == 'edit') {
            // slight delay because param update propagating as modal being popped up
            setTimeout(() => {               
               this.dropToSubmit = Object.assign({}, this.drop)

               let datetime = new Date(this.dropToSubmit.startDate.seconds * 1000)
               this.startDate = date.formatDate(datetime, 'YYYY-MM-DD')
               this.startTime = date.formatDate(datetime, 'HH:mm')
            }, 100)  
			}
		}
   }
   
   function localTimezone() {
		let dateString = new Date(Date.now()).toString()
      let timezone = dateString.slice(dateString.indexOf("("), dateString.indexOf(")") + 1)
      if (timezone == "(Eastern Daylight Time)") { timezone = "(EDT)" }
      else if (timezone == "(Pacific Daylight Time)") { timezone = "(PDT)" }
      return timezone
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