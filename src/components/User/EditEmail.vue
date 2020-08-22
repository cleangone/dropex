<template>
	<q-card class="form-card">
      <q-form class="authentication q-gutter-y-md" ref="emailForm" @submit="submitForm"> 
         <q-card-section>
            <div class="text-h6 heading">Edit Email</div>
            <div class="row q-mt-md">
               <q-input v-model="emailToSubmit" label="Email" ref="email" type="email" 
                  autocomplete="email" class="col" filled 
                  lazy-rules :rules="[ val => isValidEmailAddress(val) || 'Not a valid email']"/>
            </div>
         </q-card-section>

         <q-card-actions align="right">
            <q-btn label="Cancel" color="grey" v-close-popup />
            <q-btn label="Save" type="submit" color="primary" />
         </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   
	export default {
		data() {
			return {
				emailToSubmit: ''
			}
		},
		computed: {		
         ...mapGetters('auth', ['currentUser']),
    	},
		methods: {
			...mapActions('auth', ['updateEmail', 'reload']),
         submitForm () {
            this.$refs.emailForm.validate().then(async success => {
               if (success) {
                  console.log("Updating email to " + this.emailToSubmit)
                  try {
                     await this.updateEmail(this.emailToSubmit)  
                     this.reload()
                     this.$emit('emailUpdated')
                  } catch (error) {
                     console.log("Error updating email to " + this.emailToSubmit, error.message)
                     let msg = "Cannot update email. " + error.message
                     this.$q.notify({ message: msg, color: 'negative' })
                  } 
               }    
            })
         },
         isValidEmailAddress(email) {
			   var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			   return regex.test(String(email).toLowerCase());
		   }
		},
		mounted() {
         this.emailToSubmit = this.currentUser.email
		}
   }

</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .q-card-section { width: 100%; }
</style>