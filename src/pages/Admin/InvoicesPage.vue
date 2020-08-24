<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Invoices" :data="invoices" 
				:columns="columns" :visible-columns="visibleColumns" 
				row-key="name" :filter="tableDataFilter"  :pagination.sync="pagination"
				:dense="$q.screen.lt.md" class="q-mb-sm">
				<template v-slot:top-right>
					<q-space />					
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
            <template v-slot:body="props">
               <q-tr :props="props">
                  <!-- todo - expands all rows -->
                  <q-td key="expand" :props="props" :style="{width: '30px'}">
                     <q-btn size="xs" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
                  </q-td>
                  <q-td v-for="col in props.cols" v-if="isDataCol(col.name)" :key="col.name" :props="props">
                     {{ col.value }}
                  </q-td>
                  <q-td key="actions" :props="props">
                     <q-btn icon="edit" @click="editInvoice(props.row.id)" flat color="blue" />
                     <!-- <q-btn icon="delete" @click="promptToDeleteInvoice(props.row.id)" flat color="red" /> -->
                  </q-td>
               </q-tr>
               <q-tr v-show="props.expand" :props="props">
                  <q-td colspan="100%">
                     <div class="text-left">Invoice items</div>
                  </q-td>
               </q-tr>
            </template>
			</q-table>
		</div>

		<q-dialog v-model="showEditModal">
			<add-edit-invoice type="edit" :invoice="invoiceToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapGetters, mapActions } from 'vuex'

	export default {
		data() {
	  	   return {
			   showEditModal: false,
				tableDataFilter: '',
            visibleColumns: ['expand', 'userFullName', 'total', 'status', 'actions'],
 				columns: [
               { name: 'expand', align: 'center' },
               { name: 'id', field: 'id' },                 
               { name: 'userFullName', label: 'User', align: 'left', field: 'userFullName', sortable: true },
					{ name: 'total',  label: 'Total',  align: 'right',  field: 'total',  sortable: true, format: val => val ? "$" + val : '' },
					{ name: 'status', label: 'Status', align: 'center', field: 'status', sortable: true },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 30 },
            invoiceIdToEdit: '',
			}
		},
		computed: {
			...mapGetters('invoice', ['invoicesExist', 'getInvoices', 'getInvoice']),
         invoiceToEdit() { return this.getInvoice(this.invoiceIdToEdit) },
         invoices() {
            let invs = this.getInvoices
            console.log("invoices", invs)
            return invs
         }
      
		},
		methods: {
         ...mapActions('invoice', ['bindInvoices', 'deleteInvoice']),
         isDataCol(colName) { return (colName !== 'expand' && colName !== 'actions') },
         editInvoice(invoiceId) {
				this.invoiceIdToEdit = invoiceId
				this.showEditModal = true
			},
			// promptToDeleteInvoice(dropId) {
         //    console.log("promptToDeleteDrop", dropId)
            
         //    this.$q.dialog({title: 'Confirm', message: 'Delete ' + this.getDrop(dropId).name + '?', persistent: true,			
	      //   		ok: { push: true }, cancel: { push: true, color: 'grey' }
			// 	}).onOk(() => {
			// 		console.log("promptToDeleteDrop: calling deleteDrop", dropId)
			// 		this.deleteDrop(dropId)
			// 	})
         // }
		},
		components: {
			'add-edit-invoice' : require('components/Admin/AddEditInvoice.vue').default
      },
      created() {
         if (!this.invoicesExist) { this.bindInvoices() }
      }
	}

</script>