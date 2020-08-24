<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Users" :data="getUsers" :columns="columns" :visible-columns="visibleColumns" row-key="name" 
            :pagination.sync="pagination" :filter="tableDataFilter">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
				<q-td slot="body-cell-edit" slot-scope="props" :props="props">
    				<q-btn flat icon="edit" @click="edit(props.row.id)" />
  				</q-td>
			</q-table>
		</div>
		<q-dialog v-model="showEditModal">
			<edit-user :user="userToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { mapGetters } from 'vuex'

   // TODO - need email in user - should it keep a copy of the auth email?
	export default {
		data() {
	  		return {
				showEditModal: false,
				userToEdit: {},
				tableDataFilter: '',
				visibleColumns: [ 'firstName', 'lastName', 'payPalEmail', 'admin', 'edit'],
 				columns: [
               { name: 'id', field: 'id' },
               leftAlignedCol('firstName',   'First Name'),
				 	leftAlignedCol('lastName',    'Last Name'),
				 	leftAlignedCol('payPalEmail', 'PayPal'),
				 	{ name: 'admin', label: 'Permissions', align: 'center', field: 'isAdmin', sortable: true, sort: (a, b) => a - b, format: val => val ? 'Admin' : '' }, 
					{ name: 'edit' },
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
			...mapGetters('user', ['getUsers', 'getUser']),
		},
		methods: {
			edit(userId) {
				console.log("edit", userId)
				this.userToEdit = this.getUser(userId)
				this.showEditModal = true
			}
		},
		components: {
			'edit-user' : require('components/Admin/EditUser.vue').default
		},
   }

   function leftAlignedCol(name, label) { 
      return { name: name, label: label, align: 'left', field: name, sortable: true } 
   }

</script>