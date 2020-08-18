<template>
  <q-page padding>  
	  <q-card class="form-card flat">
			<q-card-section>
				<div class="q-mb-sm">
					<q-input v-model="userToSubmit.firstName" label="First Name" stack-label />
				</div>
				<div class="q-mb-sm">
					<q-input v-model="userToSubmit.lastName" label="Last Name" stack-label />
				</div>
			</q-card-section>
		
			<q-card-actions >
				<q-btn @click="reset" label="Reset" color="grey" />
				<q-btn @click="submitUser" label="Save" color="primary" />
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
				userToSubmit: {}
			}
		},
		computed: {
			...mapState('auth', ['userId']),
         ...mapGetters('user', ['getUser']),
			user() { return this.getUser(this.userId) }, // if user does not exist, this is a placholder w/ the id
		},
		methods: {
			...mapActions('user', ['setUser']),
			reset() { this.userToSubmit = Object.assign({}, this.user) },
			submitUser() { this.setUser(this.userToSubmit) }
		},
		mounted() { this.reset() }
	}

</script>