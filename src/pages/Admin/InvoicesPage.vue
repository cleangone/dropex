<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Invoices" :data="invoices" 
				:columns="columns" :visible-columns="visibleColumns" 
				row-key="id" :filter="tableDataFilter"  :pagination.sync="pagination"
				:dense="$q.screen.lt.md" class="q-mb-sm">
				<template v-slot:top-right>
					<q-space />					
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>            
            <template v-slot:header="props">
               <q-tr :props="props">
                  <q-th auto-width /> <!-- expand col -->
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                  <q-th auto-width /> <!-- actions col -->
               </q-tr>
            </template>

            <template v-slot:body="props">
               <q-tr :props="props">
                  <q-td auto-width>
                     <q-btn size="xs" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
                  </q-td>
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
                  <q-td auto-width>
                     <q-btn icon="edit" @click="editInvoice(props.row.id)" size="sm" color="primary" flat dense/>
                  </q-td>
               </q-tr>
               
               <template v-if="props.expand">
                  <q-tr v-for="item in getItems(props.row.id)" :key="item.name" :props="props">
                     <q-td />
                     <q-td class="text-left bg-grey-2">{{ item.name }}</q-td>
                     <q-td class="text-right bg-grey-2">${{ item.price }}</q-td>
                  </q-tr>
               </template>
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
            visibleColumns: ['userFullName', 'total', 'status'],
 				columns: [
               { name: 'id', field: 'id' },                 
               { name: 'userFullName', label: 'User', align: 'left', field: 'userFullName', sortable: true },
					{ name: 'total',  label: 'Total',  align: 'right',  field: 'total',  sortable: true, format: val => val ? "$" + val : '' },
					{ name: 'status', label: 'Status', align: 'center', field: 'status', sortable: true },
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
         getItems(invoiceId) { return this.getInvoice(invoiceId).items },
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