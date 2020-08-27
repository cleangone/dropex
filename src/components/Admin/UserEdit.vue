<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">Edit User</div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-sm">
	      <q-input v-model="userToUpdate.firstName" label="First Name" filled class="col"/>
    	</div>
		<div class="row q-mb-sm">
	      <q-input v-model="userToUpdate.lastName" label="Last Name" filled class="col"/>
    	</div>
		<div class="row q-mb-sm">
	      <q-input v-model="userToUpdate.payPalEmail" label="PayPal Email" filled class="col"/>
    	</div>
      <div v-if="!isEditingSelf" class="row q-mb-sm">
	      <q-toggle v-model="userToUpdate.isAdmin" label="Admin" class="col"/>
    	</div>
       
	</q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn @click="updateUser" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	
	export default {
		props: ['user'],
		data() {
			return {
				userToUpdate: {},
			}
      },
      computed: {
         ...mapGetters('auth', ['userId']),
         isEditingSelf() { return this.userId == this.userToUpdate.id }
      },
		methods: {
			...mapActions('user', ['setUser']),
			updateUser() {
				console.log("updateUser")
            this.setUser(this.userToUpdate)
            this.$emit('close')
			}
		},
		mounted() {
         // user param update propagating as modal being popped up
		   setTimeout(() => { this.userToUpdate = Object.assign({}, this.user) }, 100)  
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