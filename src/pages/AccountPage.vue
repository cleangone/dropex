<template>
  <q-page padding>  
	  <q-card class="form-card flat">
			<q-card-section>
				<div class="q-mb-sm">
					<q-input v-model="userToUpdate.firstName" label="First Name" stack-label />
				</div>
				<div class="q-mb-sm">
					<q-input v-model="userToUpdate.lastName" label="Last Name" stack-label />
				</div>
			</q-card-section>
		
			<q-card-actions >
				<q-btn @click="reset" label="Reset" color="grey" />
				<q-btn @click="submitUpdate" label="Save" color="primary" />
			</q-card-actions>
  		</q-card>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'

	export default {
		data() {
	  		return {
				userToUpdate: {}
			}
		},
		computed: {
			...mapState('auth', ['userId']),
			...mapGetters('auth', ['loggedIn']),
			...mapGetters('user', ['getUser', 'isAdmin']),
			user() { return this.getUser(this.userId)},
		},
		methods: {
			...mapActions('user', ['updateUser']),
			reset() { this.userToUpdate = Object.assign({}, this.user) },
			submitUpdate() { this.updateUser({ id: this.userId, user: this.userToUpdate }) }
		},
		mounted() { this.reset() }
	}

</script>