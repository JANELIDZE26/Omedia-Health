const form = document.getElementById("form");
const desiredMeal = localStorage.getItem("meal");
let dataMeal = [];

let groupedMeal = [];

let shouldEventStart = true;
let counter = 0;
let nodeElement;
let indexOfElement;
if(JSON.parse(localStorage.getItem("mealData")) === null){
  localStorage.setItem("mealData",JSON.stringify(dataMeal));
}
window.onload = function () {


loadTableData();
 
let editable = new TableCellEditing(document.querySelector("table"))
editable.init();

dataMeal = JSON.parse(localStorage.getItem("mealData")); 
//console.log("page onload",JSON.parse(localStorage.getItem("mealData")));

giveId();
groupedMeal = groupByDate();
  


let data = document.querySelectorAll("#color")
changeColor(data);

   
}
class TableCellEditing {
    constructor(table) {
        this.tbody = table.querySelector("tbody");
    }
    init(){
        this.tds = this.tbody.querySelectorAll("td");
        
        this.tds.forEach((td,index) => {
            
            td.setAttribute("contenteditable",true);       
                td.addEventListener("click",() =>{
                  indexOfElement = index;
                    if(shouldEventStart){
                      
                        this.startEditing();
                    } 
                    shouldEventStart = false;
                            
                    })            
        });
    }
    startEditing(){ 
        this.createButtonToolbar();
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
        sortColumn();
        localStorage.setItem("mealData",JSON.stringify(dataMeal));
        giveId();
        groupedMeal = groupByDate();
      
        loadTableData();
        let data = document.querySelectorAll("#color")
        changeColor(data);
        this.init();
      
       
       
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
        
    }
    deleteRow(buttons){
      counter +=1;
     

      shouldEventStart = true;
      buttons.forEach(el => {
         
          el.style.display = "none";
          
      });
      // sortColumn()
      // calculateBurnedCalories()
      // giveId();
      // groupedMeal = groupByDate();
      // localStorage.setItem("activityData",JSON.stringify(dataActivity));
      loadTableData();
      let data = document.querySelectorAll("#color")
      //console.log(data);
      changeColor(data);
      this.init();

      Array.from(data).forEach(curr => {
        if(curr.parentNode.isSameNode(this.tds[indexOfElement].parentNode)){
            indexOfElement = Array.from(data).indexOf(curr)
        }
    });
      dataMeal.splice(indexOfElement,1); 
      sortColumn();
      giveId();
      groupedMeal = groupByDate(); 

      localStorage.setItem("mealData",JSON.stringify(dataMeal));
      loadTableData();
      data = document.querySelectorAll("#color")
      //console.log(data);
      changeColor(data);
      this.init();
    }
    changeData(dateData,caloriesData,mealNameData){
        let changedData = [];
        for(let i = 0;i<dateData.length;i++){

          let date = dateData[i].innerHTML;
          let calories = caloriesData[i].innerHTML;


          date = date.split("-").map(y => y.split("").map(curr => parseInt(curr)).filter(curr => !isNaN(curr)).join("")).join("-");            
          calories = parseInt(calories.split("").map(curr => parseInt(curr)).filter(curr => !isNaN(curr)).join(""));
         
          
          if(!calories) calories = 0;
          if(!mealNameData) mealNameData = "~";
          if(!date) date = "yy-mm-dd";





          let changed = new MealsObj(date,calories,mealNameData[i].innerHTML)
          changedData.push(changed);
        }
        return changedData;
    }
    createButtonToolbar(){

        let cancelButton = document.getElementById("cancel-button")
        let saveButton = document.getElementById("save-button")
        let deleteButton = document.getElementById("delete-button");
        let buttons = [cancelButton,saveButton,deleteButton];
        
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
          deleteButton.addEventListener("click",() => {
            this.deleteRow(buttons);
        });
        }  
    }
}

const MealsObj = function(date,calorie,mealName){
    this.date = date;
    this.calorie = calorie;
    this.mealName = mealName;
    this.id = 0;
}
form.addEventListener("submit",addItem)
form.addEventListener("submit",function(event){
  if(event.keyCode===13 || event.which===13){
      addItem(event);
  }
});
function addItem(event){
    //get fields
    let date = document.getElementById("date");
    let calorie = document.getElementById("meal-field");
    let mealName = document.getElementById("meal-name");

    
    date.focus()
    // create new obj
    let newObj = new MealsObj (date.value,Math.abs(calorie.value),mealName.value);
    dataMeal.push(newObj);

    
    sortColumn()
   
    giveId();
    groupedMeal = groupByDate();

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
}
function loadTableData(){
  const tableBody = document.getElementById("tableData");
  let localData = JSON.parse(localStorage.getItem("mealData"));

  let dataHtml = '';
  for(let data of localData){
    dataHtml += `<tr><td class="date-data">${data.date}</td><td class="name-data">${data.mealName}</td><td class="calories-data" id="color">${data.calorie}</td></tr>`;
  }    
    
  tableBody.innerHTML = dataHtml;
}
function giveId(){
  let id = 0;
  for(let i = 0;i<dataMeal.length;i++){
    dataMeal[i].id = id;
    id +=1;
  }
}
// function changeColor(data){
//     let totalMealCalories = 0;
//     let localData = JSON.parse(localStorage.getItem("mealData"));
    
//     for(let i = 0;i<localData.length;i++){
//         totalMealCalories += parseInt(localData[i].calorie);
//     }
//     if(totalMealCalories > desiredMeal){
//         Array.from(data).forEach(curr =>{
//         curr.id = "red-data";
//              })
//     }else{
//         Array.from(data).forEach(curr =>{
//         curr.id="green-data";
//     })
//     }
// }

function changeColor(data){
  let totalMealCalories;
  let startId = 0;
  let endId = 0;
  //let localData = JSON.parse(localStorage.getItem("mealData"));
  //console.log(data);
  for(let i = 0;i<groupedMeal.length;i++){
    totalMealCalories = 0;
    startId = groupedMeal[i][0].id;
    endId = groupedMeal[i][groupedMeal[i].length-1].id;
    for (let j = 0;j<groupedMeal[i].length;j++){
      totalMealCalories += parseInt(groupedMeal[i][j].calorie)
    }
        
    if(totalMealCalories > desiredMeal){
      Array.from(data).slice(startId,endId+1).forEach(curr =>{
               
      curr.id = "red-data";
      })
      }else{
        Array.from(data).slice(startId,endId+1).forEach(curr =>{
        curr.id="green-data";
      })
    }
  }
   
}



function sortColumn(){
    
  dataMeal.sort((a,b) => compareArraysDeccending(a.date.split("-").map(curr => parseInt(curr)),b.date.split("-").map(curr => parseInt(curr)) ))
    
  localStorage.setItem("mealData",JSON.stringify(dataMeal));
    
  loadTableData();
  let data = document.querySelectorAll("#color")
  changeColor(data);
  let editable = new TableCellEditing(document.querySelector("table"))
  editable.init();
    
}
// function compareArraysAccending (a,b){
//   for(let i = 0;i<a.length;i++ ){
//     if(a[i] > b[i]){
//       return 1;
//     }else if(a[i] < b[i]){
//       return -1;
//     }
//   }
//     return 0;
// }


// sorts array deccending
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


// used for group elements in array by date
function groupByDate(){
    let grouped = [];
    let curr = [];
    for(let i = 0;i< dataMeal.length;i++){
      
    if(i === 0){
      elem = dataMeal[0];
      curr.push(elem);
      if(i+1 === dataMeal.length){
          
        grouped.push(curr)
      }
      continue;
}else{
     
  if(compare(dataMeal[i].date.split("-").map(curr => parseInt(curr)),elem.date.split("-").map(curr => parseInt(curr)) )){
    curr.push(dataMeal[i]);
    if(i+1 === dataMeal.length){
          
      grouped.push(curr)
    }
  }else{
    grouped.push(curr);
    curr = [];
    elem = dataMeal[i];
    curr.push(elem);
    if(i+1 === dataMeal.length){
          
      grouped.push(curr)
    }
  }
}
  }
  return grouped;
}
// To check if two arrays are equal
function  compare(a,b){
    // console.log("a:",a)
    // console.log("b",b)
    // console.log("--------------------------")
    if(a.length !== b.length){
      return false;
    }
    for(let i = 0;i<a.length;i++){
      if(a[i] !== b[i]){
        return false;
    }
  }
    
  return true;
}