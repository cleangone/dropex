<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Users" :data="getUsers" :columns="columns" :visible-columns="visibleColumns" row-key="name" :filter="tableDataFilter">
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

	export default {
		data() {
	  		return {
				showEditModal: false,
				userToEdit: {},
				tableDataFilter: '',
				visibleColumns: [ 'firstName', 'lastName', 'admin', 'edit'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'firstName', label: 'First Name', align: 'left', field: 'firstName', sortable: true },
				 	{ name: 'lastName',  label: 'Last Name',  align: 'left', field: 'lastName',  sortable: true },
					{ name: 'admin', label: 'Permissions', align: 'center', field: 'isAdmin', sortable: true, sort: (a, b) => a - b, format: val => val ? 'Admin' : '' }, 
					{ name: 'edit' },
				],
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

</script>