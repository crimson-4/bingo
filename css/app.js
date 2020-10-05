var budgetController=(function (){

var Income=function(id,description,value){

    this.id=id;
  this.description=description;
  this.value=value;

};

var Expense=function(id,description,value){

    this.id=id;
  this.description=description;
  this.value=value;
  this.percentage=-1;
};
 Expense.prototype.CalcPercentage=function(totalIncome){
  if(totalIncome>0){
    this.percentage=Math.round((this.value/totalIncome)*100); 
  }
  else {this.percentage=-1;}

 };
 Expense.prototype.getPercentage=function(){
    return this.percentage;   
 };

calculateTotal=function(type){
  var sum=0;
    data.allItems[type].forEach(function(cur){
        sum +=cur.value;
    });
data.totals[type]=sum;

}
 var data={
     allItems:{
         exp:[],
         inc:[]
     },
     totals: {
         exp:0,
         inc:0
     },
     budget:0,
     percentage:-1
 };
 return{

// calculate the budget
    calculateBudget:function(){
        //calculate income and expense
calculateTotal("inc");
calculateTotal("exp");

        //calculate budget:income-expenses
        data.budget=data.totals.inc-data.totals.exp;

        //calculate the expenses in  percentage
        if(data.totals.inc>0){
            data.percentage=Math.round(data.totals.exp/data.totals.inc *100);
        }else{data.percentage=-1;}
    },
   calculatePercentages:function(){
  data.allItems.exp.forEach(function(cur){
cur.CalcPercentage(data.totals.inc);
  })

 },
 getPercentages:function(){
   var allPerc=  data.allItems.exp.map(function(cur){
 return cur.getPercentage();
     });
     return allPerc;
 },
     
    getBudget:function(){
       return{
           budget:data.budget,
           totalInc:data.totals.inc,
           totalExp:data.totals.exp,
           percentage:data.percentage
       };

    },

     addItems:function(type,des,val){
      var newItem,ID;

//creating id
 if(data.allItems[type].length>0)
 { ID=data.allItems[type][data.allItems[type].length-1].id+1;}
else{
    ID=0;
}
//create new item based on 'inc' or 'exp' type
      if(type==='exp')
     { newItem=new Expense(ID,des,val);}
    else if(type==='inc'){
        newItem=new Income(ID,des,val);
    }
// push into data structure
    data.allItems[type].push(newItem);
    //Return the new element
    return newItem; 

     },
     deleteItem:function(type,id){
      var ids,index;

    ids= data.allItems[type].map(function(current){
            return current.id;
        })
        index=ids.indexOf(id);
     if(index !==-1){
         data.allItems[type].splice(index,1);


     }


     },
      testing:function(){
          console.log(data);
      }
 }



})();




 
var UIController=(function (){

    var DomStrings={inputType:'.add__type',
    inputDescription:'.add__description',
    inputValue:'.add__value',
    inputBtn:'.add__btn',
    incomeContainer:'.income__list',
    expenseContainer:'.expenses__list',
    budgetLabel:'.budget__value',
    incomeLabel:'.budget__income--value',
    expensesLabel:'.budget__expenses--value',
    percentageLabel:'.budget__expenses--percentage',
    container:'.container',
    expensesPercLabel:'.item__percentage',
    dateLabel:'.budget__title--month'

    };

    var formatNumber=function(num,type){
        var numSplit,int,dec,sign;
       
       num=Math.abs(num);
       num=num.toFixed(2);
       numSplit=num.split('.');
         int=numSplit[0];
         if(int.length>3){
         int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
       }
        dec=numSplit[1];
         type==='inc'?sign='+':sign='-';
       return sign +' '+int+'.'+dec;
          
           };
           var nodeListForEach=function(list,callback){
            for(var i=0;i<list.length;i++)
            callback(list[i],i);
        };


    return{
        getInput:function(){
            return{ type:document.querySelector(DomStrings.inputType).value,
            description:document.querySelector(DomStrings.inputDescription).value,
           value:parseFloat(document.querySelector(DomStrings.inputValue).value)

        };
        
    },
    changeType:function(){

 var fields=document.querySelectorAll(

 DomStrings.inputType+','+
 DomStrings.inputDescription+','+
 DomStrings.inputValue
);
nodeListForEach(fields,function(curr){
    curr.classList.toggle('red-focus');
});
 document.querySelector(DomStrings.inputBtn).classList.toggle('red');


    },

displayMonth:function(){
    var now,year,month,months;

    now=new Date();
    month=now.getMonth();
months=["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
  year=now.getFullYear();
  document.querySelector(DomStrings.dateLabel).textContent=months[month]+' '+year;
},



    addListItem:function(obj,type){
        var html,newHtml,element;
  //Create HTML string with placeholder text
  if(type==='inc')
 { element=DomStrings.incomeContainer;
     html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div></div>'}


else if(type==='exp')
 { element=DomStrings.expenseContainer;
     html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>'}
   // Replace string with some actual data

 newHtml=html.replace('%id%',obj.id);
 newHtml=newHtml.replace('%description%',obj.description);
 newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
 //insert html into DOM

  document.querySelector(element).insertAdjacentHTML('beforeend',newHtml); 
    },

    deleteListItem:function(selectorID){
 var el=document.getElementById(selectorID);
    el.parentNode.removeChild(el);

    },
       getDomStrings:function(){
        return DomStrings;
    },
    clearFields:function(){
 var fields,fieldsArr;

       fields= document.querySelectorAll(DomStrings.inputDescription+', '+DomStrings.inputValue);
       fieldsArr=Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current,index,array){
          current.value="";
      });
      fieldsArr[0].focus();
    },

    displayBudget:function(obj){
        var type;
        obj.budget>0?type='inc':type='exp';
   document.querySelector(DomStrings.budgetLabel).textContent=formatNumber(obj.budget,type);
   document.querySelector(DomStrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
   document.querySelector(DomStrings.expensesLabel).textContent=formatNumber(obj.totalExp,'exp');
    if(obj.percentage>0){
        document.querySelector(DomStrings.percentageLabel).textContent=obj.percentage +'%';
    }
else{document.querySelector(DomStrings.percentageLabel).textContent='--';}
    },
    displayPercentage:function(percentages){
   var fields=document.querySelectorAll(DomStrings.expensesPercLabel);
  
   nodeListForEach(fields,function(curr,index){
       if(percentages[index]>0){
        curr.textContent=percentages[index]+'%';
       }else{
           curr.textContent='---';
       }
   });


    },
  

    
}
})();    




var Controller=(function(budgetCtrl,UICtrl){
 
 var setupEventListeners= function(){
    var Dom=UICtrl.getDomStrings();
  
    document.querySelector(Dom.inputBtn).addEventListener('click',CtrlAddItem);

    document.addEventListener('keypress',function(event){
     if(event.keyCode===13||event.which===13){
        CtrlAddItem();
     }
   
    });
    document.querySelector(Dom.container).addEventListener('click',ctrlDeleteItem);
    document.querySelector(Dom.inputType).addEventListener('change',UICtrl.changeType);
 }
  
    
   var updateBudget=function(){
   // 4.calculate the budget
   budgetCtrl.calculateBudget();
   //5. return the budget
   var budget=budgetCtrl.getBudget();
   // 6.display the budget on UI
    UICtrl.displayBudget(budget);
   };

   var updatepercentages  = function(){
  // Calculate percentages
 budgetCtrl.calculatePercentages();

  //  get percentages from budget controller
  var percentages= budgetCtrl.getPercentages();
  // update the user interface with new percentages
  UICtrl.displayPercentage(percentages);
   };


    var CtrlAddItem=function(){ // 1.Get the filled input data
 var input,newItem;

         input=UICtrl.getInput();
     if(input.description!==""&&! isNaN(input.value)&&input.value>0)
{
       //2. add the item to the budgetController

       newItem = budgetCtrl.addItems(input.type,input.description,input.value);

       // 3. add the item to the UIcontroller
       UICtrl.addListItem(newItem,input.type)
       // 4.clear the fields
       UICtrl.clearFields();

       //5.calculate and update budget
       updateBudget();
       // calculte and update the percentages
       updatepercentages();
};

  };
   // function to delete item
   var ctrlDeleteItem=function(event){
       var itemID,splitID,type,ID;
       itemID=(event.target.parentNode.parentNode.parentNode.parentNode.id);
       if(itemID){

      splitID=  itemID.split('-');
       type=splitID[0];
       ID=parseInt(splitID[1]);
      //delete item from data structure
 budgetCtrl.deleteItem(type,ID);

      //delete item from UI
UIController.deleteListItem(itemID);
      // Update and show the budget
      updateBudget(); 

      //calculate and update the percentages
      updatepercentages();
       }
   };



   return{ 
       init:function(){
           console.log('application started');
           UICtrl.displayMonth();
           UICtrl.displayBudget( 
              { budget:0,
                totalInc:0,
                totalExp:0,
                percentage:0});
           setupEventListeners();
       }
   };



})(budgetController,UIController);
 

Controller.init();