<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table
			  :title="'Drop Items - ' + drop.name"
			  :columns="columns"
			  :visible-columns="visibleColumns"
			  :data="dropItems"
			  row-key="name"
			  :filter="tableDataFilter"
			  :dense="$q.screen.lt.md"
           selection="multiple"
           :selected.sync="selectedRowItems"
           :pagination.sync="pagination"
			  class="q-mb-xs">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
				<q-td slot="body-cell-actions" slot-scope="props" :props="props">
					<a v-if="props.row.bids" :href="'#/bids/' + dropId + '/' + props.row.id">Bids</a>
	            <q-btn icon="edit"   @click="editDropItem(props.row.id)"           flat color="blue" />
    				<q-btn icon="delete" @click="promptToDeleteDropItem(props.row.id, props.row.name)" flat color="red" />
  				</q-td>
			</q-table>
         <div class="q-mt-md">
			   <q-btn v-if="!rowsSelected" @click="showAddModal=true" icon="add" unelevated color="blue"/>
            <q-btn v-if="showInvoiceButton" @click="showInvoiceModal=true" label="Create Invoice" unelevated color="blue"/>
         </div>
		</div>

		<!-- 2 drop-item modals - don't want a race condition updating type  -->
		<q-dialog v-model="showAddModal">	
			<drop-item-add-edit type="add" :dropId="dropId" @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<drop-item-add-edit type="edit" :dropId="dropId" :dropItem="dropItemToEdit" @close="showEditModal=false" />
		</q-dialog>
      <q-dialog v-model="showInvoiceModal">	
			<add-edit-invoice type="create" :dropItems="selectedRowItems" @close="showInvoiceModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapGetters, mapActions } from 'vuex'

	export default {
		data() {
	  		return {
				dropId: '',
				showAddModal: false,
				showEditModal: false,
				showInvoiceModal: false,
				dropItemIdToEdit: '',
            tableDataFilter: '',
            selectedRowItems: [],
				visibleColumns: [ 'name', 'saleType', 'buyerName', 'price', 'currPrice', 'bids', 'status', 'actions'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',      label: 'Name',        align: 'left',   field: 'name',      sortable: true },
				 	{ name: 'saleType',  label: 'Type',        align: 'center', field: 'saleType',  sortable: true },
					{ name: 'buyerId',   label: 'BuyerId',     align: 'left',   field: 'buyerId',   sortable: true },
					{ name: 'buyerName', label: 'Buyer',       align: 'left',   field: 'buyerName', sortable: true },
					{ name: 'price',     label: 'Start Price', align: 'right',  field: 'price',     sortable: true, format: val => val ? "$" + val : '' },
					{ name: 'currPrice', label: 'Curr Price',  align: 'right',  field: 'currPrice', sortable: true, format: val => val ? "$" + val : '' },
					{ name: 'bids',      label: 'Bids',        align: 'center', field: 'bids',      sortable: true },
					{ name: 'status',    label: 'Status',      align: 'center', field: 'status',    sortable: true },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
			...mapGetters('drop', ['getDrop']),
			...mapGetters('dropItem', ['dropItemsExist', 'getDropItems']),
			drop() { return this.getDrop(this.dropId) },
			dropItemToEdit() { return this.dropItemIdToEdit ? getDropItem(this.dropItems, this.dropItemIdToEdit) : null },
         dropItems() { return this.getDropItems(this.dropId) },
         rowsSelected() { return this.selectedRowItems.length > 0 },
         showInvoiceButton() { 
            if (this.selectedRowItems.length == 0) { return false } 
            
            let buyerId = null
            for (var rowItem of this.selectedRowItems) {
               if (!rowItem.buyerId) { return false }
               if (buyerId == null) { buyerId = rowItem.buyerId }
               if (rowItem.buyerId != buyerId) { return false }
            }

            return true
         }
		},
		methods: {
			...mapActions('dropItem', ['bindDropItems', 'deleteDropItem']),
			editDropItem(dropItemId) {
				// console.log("editDropItem", dropItemId)
				this.dropItemIdToEdit = dropItemId
				this.showEditModal = true
			},
			promptToDeleteDropItem(dropItemId, name) {
            this.$q.dialog({title: 'Confirm', message: 'Delete ' + name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.deleteDropItem(dropItemId) })
			}
		},
		components: {
			'drop-item-add-edit' : require('components/DropItem/DropItemAddEdit.vue').default,
      	'add-edit-invoice' : require('components/Admin/AddEditInvoice.vue').default
      },
      created() {
			console.log("DropItemsAdminPage: dropId=" + this.dropId)
         this.dropId = this.$route.params.dropId

         if (!this.dropItemsExist) { this.bindDropItems() }    
      },
	}

   function getDropItem(dropItems, dropItemId) { 
      for (var dropItem of dropItems) {
         if (dropItem.id == dropItemId) { return dropItem }
      }

      return null
   }
</script>