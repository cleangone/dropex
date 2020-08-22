export default class User {
   
   id = ''
   firstName = ''
   lastName = ''
   isAdmin = false
   
   /**
    * usage: 
    *    id = "blah"
    *    user = User(id)
    */
   constructor (args) {
      Object.keys(args).forEach((key, i) => {
         this[key] = args[key]
      })
 
     // ... as a prefix is the spread operator - ex. { id: "123", firstName: "Meg", lastName: "White"}
     return { ...this }
   }
 }
 