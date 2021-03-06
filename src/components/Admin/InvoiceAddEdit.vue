<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">{{ type }} Invoice</div>

      <div v-if="invoiceError" class="text-red text-bold q-mt-sm">{{ invoiceError }}</div>
      <div v-else class="q-mt-sm">
         <q-table
            :title="'Buyer: ' + invoiceToSubmit.userName"
            :columns="columns"
            :visible-columns="visibleColumns"
            :data="invoiceToSubmit.items"
            row-key="name"
            :dense="$q.screen.lt.md"
            class="q-mb-none">
               
            <template v-slot:bottom-row >
               <q-tr>
                  <q-td class="text-bold bg-grey-2">Sub-Total</q-td>
                  <q-td class="text-bold bg-grey-2">${{ invoiceToSubmit.subTotal }}</q-td>
               </q-tr>
               <q-tr>
                  <q-td class="text-bold bg-grey-2">Shipping</q-td>
                  <q-td class="text-bold bg-grey-2">${{ invoiceToSubmit.shippingCharge }}</q-td>
               </q-tr>
               <q-tr v-if="invoiceToSubmit.priceAdjustment">
                  <q-td class="text-bold bg-grey-2">Adjustment</q-td>
                  <q-td class="text-bold bg-grey-2">(${{ invoiceToSubmit.priceAdjustment }})</q-td>
               </q-tr>
               <q-tr>
                  <q-td class="text-bold bg-grey-2">TOTAL</q-td>
                  <q-td class="text-bold bg-grey-2">${{total}}</q-td>
               </q-tr>
            </template>
         </q-table>
      </div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-sm q-gutter-sm">
         <q-input v-model.number="invoiceToSubmit.shippingCharge" label="Shipping" type=number prefix="$" filled class="col" />
			<q-input v-model.number="invoiceToSubmit.priceAdjustment" label="(Price Adjustment)" type=number prefix="$" filled class="col" />
		</div>
      <div class="row q-mb-none q-gutter-sm">
         <q-select v-if="isEdit" label="Status" v-model="invoiceToSubmit.status" :options="statusOptions" class="col" filled/>
         <div class="col"/>
		</div>
   </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn v-if="!invoiceError" @click="submitForm" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { date } from 'quasar'
   import { mapActions } from 'vuex'
   import { ItemStatus, InvoiceStatus } from 'src/constants/Constants.js'
   
	export default {
		props: ['type', 'items', 'invoice'],
		data() {
			return {
            invoiceError: null,
				invoiceToSubmit: {
               userId: null,
               userName: null, // first + last 
               items: [], // itemId, name, price
               status: InvoiceStatus.CREATED,
               subTotal: 0,
               shippingCharge: 25,
               priceAdjustment: 0,
            },
            statusOptions: [ InvoiceStatus.CREATED, InvoiceStatus.SENT, InvoiceStatus.PAID, InvoiceStatus.SHIPPED ],
            visibleColumns: [ 'name', 'price'],
 				columns: [
        			{ name: 'name',  label: 'Item Name', align: 'left', field: 'name' },
				 	{ name: 'price', label: 'Price',     align: 'left', field: 'price', format: val => val ? "$" + val : '' },
            ],
			}
		},
		computed: {	
         isEdit() { return this.type == "edit" },	
         total() { return this.invoiceToSubmit.subTotal + this.invoiceToSubmit.shippingCharge - this.invoiceToSubmit.priceAdjustment },	
    	},
		methods: {
			...mapActions('invoice', ['createInvoice', 'updateInvoice']),
			...mapActions('item', ['updateItem']),
			submitForm() {
				this.persistInvoice()
            this.$emit('close')
			},
			persistInvoice() {
            // console.log("persistInvoice", this.invoiceToSubmit)
            if (this.isEdit) { this.updateInvoice(this.invoiceToSubmit)}
            else { 
               this.createInvoice(this.invoiceToSubmit)
               for (var item of this.items) {
                  this.updateItem({ id: item.id, status: ItemStatus.INVOICED })
               }
            }
			}
      },
		mounted() {
         if (this.isEdit) {
            // slight delay because param update propagating as modal being popped up
            setTimeout(() => { this.invoiceToSubmit = Object.assign({}, this.invoice) }, 100)  
         }
         else {
            console.log("mounted", this.items)
            for (var item of this.items) {
               if (!item.buyerId) { 
                  this.invoiceError = "Not all items have a buyer" 
                  return 
               }

               if (this.invoiceToSubmit.userId == null) { 
                  this.invoiceToSubmit.userId = item.buyerId 
                  this.invoiceToSubmit.userName = item.buyerName
               }
               if (item.buyerId != this.invoiceToSubmit.userId) { 
                  this.invoiceError = "Not all items have the same buyer"
                  return 
               }
               if (item.status != ItemStatus.HOLD && item.status != ItemStatus.INVOICED) { 
                  this.invoiceError = "All item must be status Hold or Invoiced" 
                  return
               }

               this.invoiceToSubmit.items.push({ id: item.id, name: item.name, price: item.buyPrice })
               this.invoiceToSubmit.subTotal += item.buyPrice
            }
         }
		}
   }
   
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
	.thumbnail {
		max-width: 100px;
		max-height: 100px;
	}
	.form-card .q-img {
		height: 56px;
		width: 56px;
		border-radius: 10px;
	}
	.form-card .q-img__image { background-size: cover !important; }
	.form-card .q-rating__icon { opacity: 0.2; }
	.form-card .q-rating__icon--active { opacity: 1; }
</style>