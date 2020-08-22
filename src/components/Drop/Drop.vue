<template>
	<q-card class="card q-pa-sm">
		<q-card-section class="q-px-xs q-py-md" @click="navToDrop">
         <!-- <router-link :to="{ name: 'Drop', params: { dropId: drop.id } }"> -->
			{{ drop.name }}
         <!-- </router-link> -->
      </q-card-section>		
		<q-card-actions class="absolute-bottom q-pa-none">
         <!-- first button is hidden but takes click on card -->
			<q-btn @click="navToDrop" flat class="col" />
         <q-btn @click="showEditModal = true" icon="edit" color="blue" flat small dense class="col" align="right"/>
         <q-btn icon="delete" @click="promptToDelete()" flat dense color="red" />
		</q-card-actions> 
		<q-dialog v-model="showEditModal">
			<drop-add-edit type="edit" :drop="drop" @close="showEditModal=false" />
		</q-dialog>
  	</q-card> 
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'

   export default {
      props: ["drop"],
      data() {
         return {
            showEditModal: false
         }
      },
      computed: {
         ...mapGetters('drop', ['dropsExist']),
      },
      methods: {
         ...mapActions('drop', ['deleteDrop']),
         promptToDelete() {
				// console.log("promptToDelete", dropItemId)
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + this.drop.name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.deleteDrop(this.drop.id) })
         },
         navToDrop() {
            this.$router.push('/drop/' + this.drop.id)
         }
      },
      components: {
         'drop-add-edit' : require('components/Drop/DropAddEdit.vue').default
      }
   }
</script>