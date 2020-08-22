<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row">
        <q-btn @click="leftDrawerOpen = !leftDrawerOpen" icon-right="menu" flat dense/>
        <q-toolbar-title class="col absolute-center text-h5">Dropzone Testbed</q-toolbar-title>
        <span class="col"/>
        <q-btn v-if="loggedIn" icon-right="account_circle" :label="userFirstName" flat dense >
          <q-menu content-class="bg-grey-4 ">
            <q-list dense style="min-width: 100px">
              <q-item clickable to="/account" v-close-popup><q-item-section style="bg-black">Account</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section @click="logout">Logout</q-item-section></q-item>
            </q-list>
          </q-menu>
        </q-btn>        
        <q-btn v-else icon-right="account_circle" to="/auth/login" label="Login" dense flat />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <q-list>
         <q-item-label header>Navigation</q-item-label>
         <layout-item path="/" label="Home" iconName="home"/>
         <div v-if="loggedIn">
            <layout-item path="/account" label="My Account" iconName="account_circle"/>       
         </div>
         <div v-else>
            <layout-item path="/auth/login"    label="Login"    iconName="account_circle"/>       
            <layout-item path="/auth/register" label="Register" iconName="account_box"/>       
         </div>
         <div v-if="userIsAdmin">
          <q-item-label header>Admin</q-item-label>
          <layout-item path="/users"   label="Users"    iconName="group"/>
          <layout-item path="/invoice" label="Invoices" iconName="shopping_cart"/>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'

   export default {
      name: 'MainLayout',
      data () {
         return {
            leftDrawerOpen: false
         }
      },
      computed: {
         ...mapGetters('auth', ['loggedIn', 'userId']),
         ...mapGetters('user', ['getUser', 'isAdmin']),
         user() { return this.getUser(this.userId) },
         userFirstName() { return this.user && this.user.firstName ? this.user.firstName : "Logged In" },
         userIsAdmin() { return this.user && this.user.isAdmin }
      },
      methods: {
         ...mapActions('auth', ['logoutUser']),
         ...mapActions('user', ['bindUsers']),
         logout() {        
            this.logoutUser()
            if (this.$route.path != "/") { this.$router.push("/") }
         },
      },
      components: {
         'layout-item' : require('layouts/LayoutItem.vue').default
      },
      created() {
         this.bindUsers()
      },
   }
</script>
