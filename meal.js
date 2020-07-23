const form = document.getElementById("form");
const desiredMeal = localStorage.getItem("meal");
let dataMeal = [];
let shouldEventStart = true;
let counter = 0;
let sortDirection = false;

window.onload = function () {
   
    loadTableData();
    
    let editable = new TableCellEditing(document.querySelector("table"))
    editable.init();
    dataMeal = JSON.parse(localStorage.getItem("mealData"));
   // console.log("page onload",JSON.parse(localStorage.getItem("mealData")));
    let data = document.querySelectorAll("#color")
    changeColor(data);
    
}
class TableCellEditing {
    constructor(table) {
        this.tbody = table.querySelector("tbody");
    }
    init(){
        this.tds = this.tbody.querySelectorAll("td");
        
        this.tds.forEach(td => {
            
            td.setAttribute("contenteditable",true);       
                td.addEventListener("click",() =>{
                    if(shouldEventStart){
                      
                        this.startEditing(td);
                    } 
                    shouldEventStart = false;
                            
                    })            
        });
    }
    startEditing(td){ 
        this.createButtonToolbar(td);
    }
    finishEditing(buttons){
        let dateData = document.querySelectorAll(".date-data");
        let mealNameData = document.querySelectorAll(".name-data");
        let caloriesData = document.querySelectorAll(".calories-data")
        //console.log(mealNameData);
        shouldEventStart = true;
        counter +=1;
        buttons.forEach(el => {
           
            el.style.display = "none";
            
        })
        dataMeal = this.changeData(dateData,caloriesData,mealNameData) ; 
        localStorage.setItem("mealData",JSON.stringify(dataMeal));
       // console.log("after finishing",JSON.parse(localStorage.getItem("mealData")));
        loadTableData();
        let data = document.querySelectorAll("#color")
        changeColor(data);
        this.init();
        sortDirection = true;
        sortColumn();
       
    }
    
    cancelEditing(buttons){
        counter +=1;
        shouldEventStart = true;
        buttons.forEach(el => {
           
            el.style.display = "none";
            
        })
        localStorage.setItem("mealData",JSON.stringify(dataMeal));
        loadTableData();
        this.init();
        let data = document.querySelectorAll("#color")
        changeColor(data);
        //td.innerHTML = td.getAttribute("data-old-value");
    }
    changeData(dateData,caloriesData,mealNameData){
        let changedData = [];
        for(let i = 0;i<dateData.length;i++){
           let changed = new MealsObj(dateData[i].innerHTML,caloriesData[i].innerHTML,mealNameData[i].innerHTML)
           changedData.push(changed);
        }
        return changedData;
    }
    createButtonToolbar(td,tds){

        let cancelButton = document.getElementById("cancel-button")
        let saveButton = document.getElementById("save-button")
        let buttons = [cancelButton,saveButton]
        
        buttons.forEach(el => {
            
            el.style.display = "inline-block";
        })
        if(counter === 0){
            cancelButton.addEventListener("click",() =>{
            
            this.cancelEditing(buttons)
        });
   
            saveButton.addEventListener("click",() =>{
            
            this.finishEditing(buttons)
        });
        }  
    }
}

const MealsObj = function(date,calorie,mealName){
    this.date = date;
    this.calorie = calorie;
    this.mealName = mealName;
}
form.addEventListener("submit",function(event){
    
    //get fields
    let date = document.getElementById("date");
    let calorie = document.getElementById("meal-field");
    let mealName = document.getElementById("meal-name");

    
   
    // create new obj
     let newObj = new MealsObj (date.value,calorie.value,mealName.value);
    dataMeal.push(newObj);
    
   
  
    localStorage.setItem("mealData",JSON.stringify(dataMeal));
    
    //render
    loadTableData();

    //edit table

    let editable = new TableCellEditing(document.querySelector("table"));
    editable.init();

    // check whether total meal is more than or less than desired meal prd
    let data = document.querySelectorAll("#color")
    changeColor(data);


    // clear input fields
    date.value = "";
    calorie.value = "";
    mealName.value = "";


   // console.log("after add button",JSON.parse(localStorage.getItem("mealData")));
    event.preventDefault();
})

function loadTableData(){
    const tableBody = document.getElementById("tableData");
    let localData = JSON.parse(localStorage.getItem("mealData"));

    let dataHtml = '';
    for(let data of localData){
        dataHtml += `<tr><td class="date-data">${data.date}</td><td class="name-data">${data.mealName}</td><td class="calories-data" id="color">${data.calorie}</td></tr>`;
    }    
    
    tableBody.innerHTML = dataHtml;
}

function changeColor(data){
    let totalMealCalories = 0;
    let localData = JSON.parse(localStorage.getItem("mealData"));
    
    for(let i = 0;i<localData.length;i++){
        totalMealCalories += parseInt(localData[i].calorie);
    }
    if(totalMealCalories > desiredMeal){
        Array.from(data).forEach(curr =>{
        curr.id = "red-data";
             })
    }else{
        Array.from(data).forEach(curr =>{
        curr.id="green-data";
    })
    }
}

function sortColumn(){
    
    sortDirection = !sortDirection; 
    if(sortDirection){
        dataMeal.sort((a,b) => compareArraysAccending(a.date.split("-").map(curr => parseInt(curr)),b.date.split("-").map(curr => parseInt(curr)) ))
    }else{
        dataMeal.sort((a,b) => compareArraysDeccending(a.date.split("-").map(curr => parseInt(curr)),b.date.split("-").map(curr => parseInt(curr)) ))
    }

    localStorage.setItem("mealData",JSON.stringify(dataMeal));
    
     loadTableData();
     let data = document.querySelectorAll("#color")
     changeColor(data);
     let editable = new TableCellEditing(document.querySelector("table"))
     editable.init();
    
}
function compareArraysAccending (a,b){
    for(let i = 0;i<a.length;i++ ){
      if(a[i] > b[i]){
        return 1;
      }else if(a[i] < b[i]){
        return -1;
      }
    }
    return 0;
  }
  function compareArraysDeccending (a,b){
    for(let i = 0;i<a.length;i++ ){
      if(a[i] < b[i]){
        return 1;
      }else if(a[i] > b[i]){
        return -1;
      }
    }
    return 0;
  }