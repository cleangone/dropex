<template>
	<div v-if="timerSeconds > 0">Dropping ({{ timerSeconds }})</div>
	<div v-else>Dropping</div> 
</template>

<script>
   import Vue from 'vue'
	var timeouts = {};
	
	export default {
		props: ['dropItem'], 
		data() {
			return {
				timerSeconds: 0
			}
		},
		computed: {
			dropDoneDate() { return this.dropItem.dropDoneDate ? this.dropItem.dropDoneDate : 0 },
		},
		methods: {
			setTimerSeconds() {
				console.log("setTimerSeconds")
				let nowTime = new Date().getTime()
				let dropDoneTime = this.dropItem.dropDoneDate ? this.dropItem.dropDoneDate : 0
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
            let timeout = timeouts[this.dropItem.id]
				if (timeout != null) { 
               // console.log("found timeout for " + this.dropItem.id)
               clearTimeout(timeout) 
               Vue.delete(timeouts, this.dropItem.id)
            }

				if (value > 0) {
               // console.log("Timer changed " + value)
               let timeout = setTimeout(() => { this.timerSeconds-- }, 1000) 
               Vue.set(timeouts, this.dropItem.id, timeout) 
            }
			}}
      },
		mounted() { this.setTimerSeconds() }
	}
</script>



