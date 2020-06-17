//Data encapsulation allows us to hide the implementation details of specific modules from ourside scope so we only show a public interface which is sometimes called api
var budgetController = (function(){//no one can access this function from outside .this is iife function.
    var x = 23;
  var add = function(a){
      return x + a;
  }
  return{
      publictest: function(b){//it return an objext which is a function
          return add(b);//It works because of closures as inner function has always access to outer function.
      }//Only publictest method have access them because its inner function returning the function
  }
})();

var UIcontroller = (function(){//iife function which we created is immediately invoked

})();

var controller = (function(budgetctrl,UIctrl){
   var z = budgetctrl.publictest(5);
   return{
       anotherPublic: function(){
           console.log(z);
       }
   }
})(budgetController,UIcontroller);