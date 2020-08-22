<template>
  <q-page padding="padding">
    <q-form class="authentication q-gutter-y-md" ref="forgotPasswordForm" @submit="onSubmit">
      <h5 class="q-mb-none">Forgot Password</h5>
      <div class="inst q-mb-lg">Enter your email and a link wil be sent to reset your password.</div>
      <q-input v-model="email" label="Email" name="email" type="email" outlined autocomplete="email"
        color="primary" for="email"
        lazy-rules="lazy-rules" :rules="[ val => isValidEmailAddress(val) || 'Not a valid email']"/>
      
      <q-btn class="full-width q-mt-md" color="primary" label="Reset Password" @click="onSubmit">
        <template v-slot:loading>
          <q-spinner-gears></q-spinner-gears>
        </template>
      </q-btn>
    </q-form>
  </q-page>
</template>

<script>
   import { mapActions } from 'vuex'
   import { Notify, Loading } from 'quasar'

   export default {
      name: 'ForgotPassword',
      data () {
         return {
            email: '',
            loading: false
         }
      },
      methods: {
         ...mapActions('auth', ['sendPasswordResetEmail']),
         isValidEmailAddress(email) {
            var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(String(email).toLowerCase());
		   },
         onSubmit () {
            this.$refs.forgotPasswordForm.validate()
               .then(async success => {
                  Loading.show({
                     message: 'Attempting to reset your password.',
                     backgroundColor: 'grey',
                     customClass: 'loader'
                  })
                  if (success) {
                     try {
                        await this.sendPasswordResetEmail(this.email)
                        Notify.create({ type: 'positive', message: 'Password reset email was sent.' })
                     } catch (err) {
                        Notify.create({ type: 'negative', message: `There was an error: ${err}` })
                     }
                  }
                  Loading.hide()
               })
         }
      }
   }
</script>

<style lang="stylus" scoped>
   .authentication
      margin auto
      max-width 30em
      width 100%
</style>

