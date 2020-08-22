<template>
  <div class=q-pa-md> 
	  
		<q-btn @click="paypal()" icon="shopping_cart" unelevated color="blue"/>

		<div id=“paypal-button-container” />
	</div> 
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'

// paypal.Buttons().render('body');
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
			paypal() { 
				console.log("paypal")
				paypal.Buttons().render('#paypal-button-container') 
			},
			submitUpdate() { this.updateUser({ id: this.userId, user: this.userToUpdate }) }
		}
	}

</script>