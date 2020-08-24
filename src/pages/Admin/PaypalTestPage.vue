<template>
  <div class="q-pa-md q-gutter-md"> 
	   <div> paypalAccessToken = {{ paypalAccessToken }} </div>
		<q-btn @click="getInvoiceNumber()" label="Get Invoice Number" color="blue"/>
      <q-btn @click="createDraftInvoice()" label="Create Draft Invoice" color="blue"/>
      <div v-if="invoiceNumber"> invoiceNumber = {{ invoiceNumber }} </div>
      <div v-if="draftInvoice"> draftInvoice = {{ draftInvoice }} </div>

      
	</div> 
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
   import { Base64 } from 'js-base64'
   import { paypalConfig } from 'src/boot/paypalConfig.js'

   const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
   const oauthAPI = paypalConfig.apiUrl + 'v1/oauth2/token/'      
   const nextInvoiceNumberAPI = paypalConfig.apiUrl + "v2/invoicing/generate-next-invoice-number/"
   const draftInvoiceAPI = paypalConfig.apiUrl + "v2/invoicing/invoices/"
            

	export default {
		data() {
	  		return {
            paypalAccessToken: null,
            invoiceNumber: null,
            draftInvoice: null
			}
		},
		computed: {
			// ...mapState('auth', ['userId']),
			// ...mapGetters('auth', ['loggedIn']),
			// ...mapGetters('user', ['getUser', 'isAdmin']),
			// user() { return this.getUser(this.userId)},
		},
		methods: {
			// ...mapActions('user', ['updateUser']),
			getInvoiceNumber() { 
            const nextInvoiceNumberRequest = new XMLHttpRequest();
            nextInvoiceNumberRequest.onload = () => {
               // console.log('nextInvoiceNumber response', nextInvoiceNumberRequest)
               // console.log('nextInvoiceNumber status', nextInvoiceNumberRequest.status)
               // console.log('nextInvoiceNumber responseText', nextInvoiceNumberRequest.responseText)

               var responseObject = JSON.parse(nextInvoiceNumberRequest.responseText)
               this.invoiceNumber = responseObject.invoice_number
            }

            nextInvoiceNumberRequest.open('POST', nextInvoiceNumberAPI, true);
            nextInvoiceNumberRequest.setRequestHeader('Accept', 'application/json')
            nextInvoiceNumberRequest.setRequestHeader('Authorization', 'Bearer ' + this.paypalAccessToken)
            nextInvoiceNumberRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')         
            nextInvoiceNumberRequest.send()
         },
         createDraftInvoice() { 
            const draftInvoiceRequest = new XMLHttpRequest();
            draftInvoiceRequest.onload = () => {
               console.log('draftInvoice response', draftInvoiceRequest)
               console.log('draftInvoice status', draftInvoiceRequest.status)
               console.log('draftInvoice responseText', draftInvoiceRequest.responseText)

               // var responseObject = JSON.parse(nextInvoiceNumberRequest.responseText)
               // this.invoiceNumber = responseObject.invoice_number
            }

            console.log("paypalAccessToken", this.paypalAccessToken)
            draftInvoiceRequest.open('POST', draftInvoiceAPI, true);
            draftInvoiceRequest.setRequestHeader('Accept', 'application/json')
            draftInvoiceRequest.setRequestHeader('Authorization', 'Bearer ' + this.paypalAccessToken)
            draftInvoiceRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
         
            let data = {
               detail: {
                  invoice_number: this.invoiceNumber,
                  invoice_date: "2020-08-22",
                  currency_code: "USD",
               },
               invoicer: {
                  name: {
                     given_name: "Danny",
                     surname: "Boy"
                  },
                  address: {
                     address_line_1: "1234 First Street",
                     admin_area_2: "Anytown",
                     admin_area_1: "CA",
                     postal_code: "98765",
                     country_code: "US"
                  },
                  email_address: "merchant@example.com",
               },
               primary_recipients: [{
                  billing_info: {
                     name: {
                        given_name: "Stephanie",
                        surname: "Meyers"
                     },
                  },
                  address: {
                     address_line_1: "1234 Main Street",
                     admin_area_2: "Attletown",
                     admin_area_1: "MA",
                     postal_code: "02703",
                     country_code: "US"
                  },
                  email_address: "bill-me@example.com",
               }],
               items: [
                  {
                     name: "Yoga Mat",
                     description: "Elastic mat to practice yoga",
                     quantity: "1",
                     unit_amount: {
                        currency_code: "USD",
                        value: "50.00"
                     },
                     unit_of_measure: "QUANTITY"
                  }
               ],
               amount: {
                  shipping: {
                     amount: {
                        currency_code: "USD",
                        value: "10.00"
                     }
                  }
               }
            }

            let stringData = JSON.stringify(data);
            const encodedData = Base64.encode(stringData)

 
            console.log('draftInvoice data', stringData)


            let data2 = '{"detail":{"invoice_number":"0001"}}'
            draftInvoiceRequest.send()
            

         }
		},
      mounted() {
         const basicAuthString = paypalConfig.clientId + ':' + paypalConfig.secretKey
         const basicAuth = Base64.encode(basicAuthString)

         const authRequest = new XMLHttpRequest()
         authRequest.onload = () => {
            // console.log('Recieved auth response:', auth)
            // console.log('Recieved auth status:', auth.status)
            // console.log('Recieved auth responseText:', auth.responseText)
            var responseObject = JSON.parse(authRequest.responseText)
            this.paypalAccessToken = responseObject.access_token
         }

         authRequest.open('POST', oauthAPI, true);
         authRequest.setRequestHeader('Accept', 'application/json');
         authRequest.setRequestHeader('Accept-Language', 'en_US');
         authRequest.setRequestHeader('Authorization', 'Basic ' + basicAuth);
         authRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
         
         let data = 'grant_type=client_credentials'
         authRequest.send(data)
      }
	}

</script>