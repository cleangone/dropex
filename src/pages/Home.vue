<template>
   <q-page class="q-pa-md justify-start">
      <div class="q-mt-md text-h6">Drops</div>
      <div v-if="dropsExist" class="q-mt-sm"> 
         <drop v-for="drop in getDrops" :key="drop.id" :drop="drop" class="q-mt-sm"/>
      </div>

      <q-btn @click="showAddModal=true" icon="add" unelevated class="q-mt-md" color="blue"/>
	   <q-dialog v-model="showAddModal">	
			<drop-add-edit type="add" @close="showAddModal=false" />
		</q-dialog>
   </q-page>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import User from 'src/models/User.js'
   
   export default {
      name: 'PageIndex',
      data() {
	  		return {
				showAddModal: false
			}
		},
      computed: {
         ...mapGetters('drop', ['dropsExist', 'getDrops']),
      },
      methods: {
         ...mapActions('drop', ['bindDrops']),
      },
      components: {
         'drop' : require('components/Drop/Drop.vue').default,
         'drop-add-edit' : require('components/Drop/DropAddEdit.vue').default
		},
      created() {
         this.bindDrops()
      }
   }
</script>
