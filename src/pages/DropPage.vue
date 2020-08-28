<template>
   <q-page class="q-pa-md">
      <q-btn @click="navBack()" icon="keyboard_arrow_left" color="blue" flat small dense />
      <div class="q-mt-md text-h6">{{ drop.name }} </div>
	
      <div class="q-mt-md text-body1 text-bold">Drop Items</div>
      
      
         <item v-for="item in items" :key="item.id" :item="item" class="q-mt-sm"/>
         
     
      
      <q-btn @click="showModal=true" icon="add" unelevated class="q-mt-md" color="primary"/>
      <q-dialog v-model="showModal">	
			<item-add-edit type="add" :dropId="dropId" @close="showModal=false" />
		</q-dialog>
   </q-page>
   
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	
	export default {
		data() {
			return {				
				dropId: 0,
				showModal: false,
        }
		},
	  	computed: {
         ...mapGetters('drop', ['dropsExist', 'getDrop']),
         ...mapGetters('item', ['itemsExist', 'getItems']),
         
         drop() { return this.getDrop(this.dropId) },
         items() { return this.getItems(this.dropId) },
		},
		methods: {
         ...mapActions('drop', ['bindDrops']),
			...mapActions('item', ['bindItems']),
			navBack() { this.$router.go(-1) },
		},
		components: {
	  		'item' : require('components/Item/Item.vue').default,
	  		'item-add-edit' : require('components/Item/ItemAddEdit.vue').default
      },
      created() {
         this.dropId = this.$route.params.dropId
         if (!this.dropsExist) { this.bindDrops() }   
         if (!this.itemsExist) { this.bindItems() }    
      },
	}

</script>