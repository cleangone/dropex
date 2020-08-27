<template>
   <q-page class="q-pa-md">
      <item :item="item" class="q-mt-sm"/>      
   </q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	
	export default {
		data() {
			return {				
				itemId: ''
        }
		},
	  	computed: {
         ...mapGetters('item', ['itemsExist', 'getItem']),
         item() { return this.getItem(this.itemId) },
		},
		methods: {
         ...mapActions('item', ['bindItems']),
		},
		components: {
	  		'item' : require('components/Item/Item.vue').default,
	  	},
      created() {
         this.itemId = this.$route.params.itemId
         if (!this.itemsExist) { this.bindItems() }    
      },
	}

</script>