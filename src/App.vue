<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
  import { mapActions } from 'vuex' 

  export default {
    methods: {
      ...mapActions('auth', ['handleAuthStateChange'])
    },
    mounted() {
      console.log("App.mounted")
      this.handleAuthStateChange()
    }
}
</script>
