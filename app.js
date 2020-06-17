//Data encapsulation allows us to hide the implementation details of specific modules from ourside scope so we only show a public interface which is sometimes called api
var budgetController = (function(){//no one can access this function from outside .this is iife function.
  var Expense = function(id,description,value){//we create function constructor as we have lots of objects to store in that function
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function(totalIncome){
      if(totalIncome>0){
       this.percentage = Math.round((this.value/totalIncome)*100);
      }else{
          this.percentage  = -1;
      }
  };

  Expense.prototype.getpercentage = function(){
       return this.percentage;
  };

  var Income = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
};

var calculateTotal = function(type){
    var sum=0;
    data.allItems[type].forEach(function(cur){
     sum = sum + cur.value;
    });
    data.totals[type] = sum;
};

var data = {
    allItems:{
        exp: [],
        inc: []
    },
    totals: {
        exp:0,
        inc:0
    },
    budget:0,
    percentage:-1
};

return {
    addItem: function(type,des,val){
        var newItem,ID;
        
        if(data.allItems[type].length>0){
        ID=data.allItems[type][data.allItems[type].length -1].id + 1;
        }else{
            ID=0;
        }
        if(type === 'exp'){
            newItem = new Expense(ID,des,val);
        }else if(type === 'inc'){
            newItem = new Income(ID,des,val);
        }
        data.allItems[type].push(newItem);
        return newItem;
    },

     deleteItem: function(type,id){
        
       var ids,index;
       
       ids = data.allItems[type].map(function(current){
           return current.id;
       });

       index = ids.indexOf(id);

       if(index !== -1){
           data.allItems[type].splice(index,1);
       }
         
     },

    calculateBudget: function(){
        calculateTotal('exp');
        calculateTotal('inc');

        data.budget = data.totals.inc-data.totals.exp;
          
        if(data.totals.inc>0){
        data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
        }else{
            data.percentage = -1;
        }

    },

    calculatePercentages: function(){
      
    data.allItems.exp.forEach(function(cur){
        cur.calcPercentage(data.totals.inc);
    });
    },

    getpercentage: function(){
        var allPer = data.allItems.exp.map(function(cur){
            return cur.getpercentage();
        });
        return allPer;
    },

    getBudget: function(){
       return{
           budget:data.budget,
           totalInc: data.totals.inc,
           totalExp: data.totals.exp,
           percentage: data.percentage
       };
    },
         testing: function(){
             console.log(data);
         }
};

})();

var UIcontroller = (function(){//iife function which we created is immediately invoked
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPerLabel: '.item__percentage'
    };
    return {
      getInput: function(){
          return{//return as a object to all three input values
            type:document.querySelector(DOMstrings.inputType).value,
            description:document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
          };
      },
     addListItem: function(obj,type){
         var html,newHtml,element;
         if(type === 'inc'){
             element = DOMstrings.incomeContainer;
          html= '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
         }
         else if(type === 'exp'){
             element = DOMstrings.expenseContainer;
         html= '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }
         newHtml = html.replace('%id%',obj.id);
         newHtml = newHtml.replace('%description%',obj.description);
         newHtml = newHtml.replace('%value%',obj.value);

         document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
     },

     deletListItem: function(selectorID){
       var el = document.getElementById(selectorID);
       el.parentNode.removeChild(el);
     },

     clearFields: function(){
         var fields,fieldsArr;

         fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);//slice is what which return a list of arrays

         fieldsArr =  Array.prototype.slice.call(fields);//we have use function constructor of array prototype.As it was a list n we need to convert it into array.

         fieldsArr.forEach(function(current,index,array){//foreach function accepts an anonymous function which will have exact 3 arguments...first is for current value second is for its index n third is the whole array.
            current.value = "";
         });
         fieldsArr[0].focus();
     },

     displayBudget: function(obj){

        document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
        
        if(obj.percentage>0){
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        }else{
            document.querySelector(DOMstrings.percentageLabel).textContent = '--';
        }
     },

     displaypercentages: function(percentages){
            
       var fields = document.querySelectorAll(DOMstrings.expensesPerLabel);

       var nodeListForEach = function(list,callback){
           for(var i=0;i<list.length;i++){
               callback(list[i],i);
           }
       };

       nodeListForEach(fields,function(current,index){
               if(percentages[index] > 0){
            current.textContent = percentages[index] + '%';
               }else{
                   current.textContent = '---';
               }

       });

     },

      getDOMstrings: function(){
          return DOMstrings;
      }
  };
})();

var controller = (function(budgetctrl,UIctrl){//controller is the place where we tell other modules to what to do.
  
    var setUpEventListener = function(){
        var DOM = UIctrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){//this is something for global documentation change
        if(event.keyCoode === 13 || event.which === 13){//this would return informatioj as soon as we press enter key
           ctrlAddItem();
     }
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);//this is event delegation as items like expense n income both have a common parent elemnt as container so it can manupilate the target child elements.
//With event delegation instaed of adding event in one element we do it multiple childs.
    };

    var updateBudget = function(){
        budgetctrl.calculateBudget();

        var budget = budgetctrl.getBudget();

        UIctrl.displayBudget(budget);

    }

    var updatePercentages = function(){

        budgetctrl.calculatePercentages();

        var percentages = budgetctrl.getpercentage();

        UIctrl.displaypercentages(percentages);

    }


var ctrlAddItem = function(){
    var input,newItem;

    input = UIctrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value>0){

    newItem =  budgetctrl.addItem(input.type,input.description,input.value);

    UIctrl.addListItem(newItem,input.type);

    UIctrl.clearFields();

    updateBudget();

    updatePercentages();
    }

};

var ctrlDeleteItem = function(event){//it refers to that target element only.
      var itemId,splitID,type,ID;
      itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

      if(itemId){
          splitID = itemId.split('-');
          type = splitID[0];
          ID = parseInt(splitID[1]);

          budgetctrl.deleteItem(type,ID);

          UIctrl.deletListItem(itemId);

          updateBudget();
      }
};
return {
    init: function(){
        console.log('Application has started');
        UIctrl.displayBudget({
            budget:0,
           totalInc: 0,
           totalExp: 0,
           percentage: -1
        });
        setUpEventListener();
    }
};


})(budgetController,UIcontroller);

controller.init();