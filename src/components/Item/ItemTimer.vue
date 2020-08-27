<template>
	<div v-if="timerSeconds > 0">Dropping ({{ timerSeconds }})</div>
	<div v-else>Dropping</div> 
</template>

<script>
   import Vue from 'vue'
	var timeouts = {};
	
	export default {
		props: ['item'], 
		data() {
			return {
				timerSeconds: 0
			}
		},
		computed: {
			dropDoneDate() { return this.item.dropDoneDate ? this.item.dropDoneDate : 0 },
		},
		methods: {
			setTimerSeconds() {
				console.log("setTimerSeconds")
				let nowTime = new Date().getTime()
				let dropDoneTime = this.item.dropDoneDate ? this.item.dropDoneDate : 0
				if (dropDoneTime == 0 || dropDoneTime < nowTime) { 
					this.timerSeconds = 0
					return
				}

				this.timerSeconds = Math.floor((dropDoneTime - nowTime)/1000)
			}
		},
		watch: {
			dropDoneDate: { handler(value) { this.setTimerSeconds() }}, // data is twitchy - watch will report blips not in db
			timerSeconds: { handler(value) {
            let timeout = timeouts[this.item.id]
				if (timeout != null) { 
               clearTimeout(timeout) 
               Vue.delete(timeouts, this.item.id)
            }

				if (value > 0) {
               // console.log("Timer changed " + value)
               let timeout = setTimeout(() => { this.timerSeconds-- }, 1000) 
               Vue.set(timeouts, this.item.id, timeout) 
            }
			}}
      },
		mounted() { this.setTimerSeconds() }
	}
</script>



