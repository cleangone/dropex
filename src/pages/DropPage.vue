<template>
   <q-page class="q-pa-md" :class="purple">
      <q-btn @click="navBack()" icon="keyboard_arrow_left" color="blue" flat small dense :class="pink" />
      <div class="q-mt-md text-h6" :class="red">{{ drop.name }} </div>
	
      <div class="q-mt-md text-body1 text-bold">Drop Items</div>
      
      <drop-item v-for="dropItem in dropItems" :key="dropItem.id" :dropItem="dropItem" class="q-mt-sm"/>
      
      <q-btn @click="showModal=true" icon="add" unelevated class="q-mt-md" color="blue"/>
	   
      <q-dialog v-model="showModal">	
			<drop-item-add-edit type="add" :dropId="dropId" @close="showModal=false" />
		</q-dialog>
   </q-page>
   
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex'
	
	export default {
		data() {
			return {				
				dropId: 0,
				showModal: false,
        }
		},
		created() {
         this.dropId = this.$route.params.dropId
         this.bindDropItems()
      },
	  	computed: {
         ...mapGetters('drop', ['getDrop']),
         ...mapGetters('dropItem', ['getDropItems']),
         ...mapGetters('color', ['red', 'pink', 'orange', 'yellow', 'blue', 'green', 'indigo', 'purple' ]),
			
         drop() { return this.getDrop(this.dropId) },
         dropItems() { 
            
            
            return this.getDropItems(this.dropId) },
		},
		methods: {
         ...mapActions('dropItem', ['bindDropItems']),
			navBack() { this.$router.go(-1) },
		},
		components: {
	  		'drop-item' : require('components/DropItem/DropItem.vue').default,
	  		'drop-item-add-edit' : require('components/DropItem/DropItemAddEdit.vue').default
      },
	}

</script>