<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Drops" :data="getDrops" 
				:columns="columns" :visible-columns="visibleColumns" 
				row-key="name" :filter="tableDataFilter" 
            @row-click="onRowClick"
            :pagination.sync="pagination"
				:dense="$q.screen.lt.md" class="q-mb-sm">
				<template v-slot:top-right>
					<q-space />					
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
				<q-td slot="body-cell-actions" slot-scope="props" :props="props">
	            <q-btn icon="edit"   @click="editDrop(props.row.id)"           flat color="blue" />
    				<q-btn icon="delete" @click="promptToDeleteDrop(props.row.id)" flat color="red" />
  				</q-td>
			</q-table>
			<q-btn @click="showAddModal=true" icon="add" unelevated color="blue"/>
		</div>

		<!-- 2 modals - don't want a race condition updating type  -->
		<q-dialog v-model="showAddModal">	
			<drop-add-edit type="add" @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<drop-add-edit type="edit" :drop="dropToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'

	export default {
		data() {
	  	   return {
			   showAddModal: false,
				showEditModal: false,
				tableDataFilter: '',
            visibleColumns: [ 'name', 'actions'],
 				columns: [
               { name: 'id', field: 'id' },                 
               { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 30 },
            dropIdToEdit: '',
			}
		},
		computed: {
			...mapGetters('drop', ['dropsExist', 'getDrops', 'getDrop']),
         dropToEdit() { return this.getDrop(this.dropIdToEdit) },
      
		},
		methods: {
         ...mapActions('drop', ['bindDrops', 'deleteDrop']),
         onRowClick(event, row) {
            this.$router.push("/admin/dropitems/" + row.id)
         },
			editDrop(dropId) {
				console.log("editDrop", dropId)
				this.dropIdToEdit = dropId
				this.showEditModal = true
			},
			promptToDeleteDrop(dropId) {
            console.log("promptToDeleteDrop", dropId)
            
            this.$q.dialog({title: 'Confirm', message: 'Delete ' + this.getDrop(dropId).name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
					console.log("promptToDeleteDrop: calling deleteDrop", dropId)
					this.deleteDrop(dropId)
				})
         }
		},
		components: {
			'drop-add-edit' : require('components/Drop/DropAddEdit.vue').default
      },
      created() {
         // not necc for prod - here for restarts in dev
         if (!this.dropsExist) { this.bindDrops() }
      }
	}
</script>