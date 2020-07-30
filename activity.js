const form = document.getElementById("form");
const desiredaActivity = localStorage.getItem("activity");
const filterButton = document.getElementById("filter-button");
const filterCancelButton = document.getElementById("filter-cancel-button");
let dataActivity = [];
let groupedMeal = [];
let unfilteredData = [];
let shouldEventStart = true;
let counter = 0;
let counter1 = 0;
let nodeElement;
let indexOfElement;
if(JSON.parse(localStorage.getItem("activityData")) === null){
    localStorage.setItem("activityData", JSON.stringify(dataActivity));
}
window.onload = function () {
    
    //console.log(dataActivity);

    dataActivity = JSON.parse(localStorage.getItem("activityData"));
    
    //console.log("page onload",JSON.parse(localStorage.getItem("activityData")));
  
    sortColumn();
    calculateBurnedCalories();
    giveId();
    groupedMeal = groupByDate();
  

    loadTableData();

    let data = document.querySelectorAll("#color");
    changeColor(data);
    
    

    let editable = new TableCellEditing(document.querySelector("table"));
    editable.init();
   
    
}

class TableCellEditing{
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
        counter1 = 0;
        let dateData = document.querySelectorAll(".date-data");
        let activityTypeData = document.querySelectorAll(".activity-type");
        let distanceData = document.querySelectorAll(".distance");
        let burnedCaloriesData = document.querySelectorAll(".burned-calories");
        //console.log(distanceData[0])
       
        shouldEventStart = true;
        counter +=1;
        buttons.forEach(el => {
           
            el.style.display = "none";
            
        })
        dataActivity = this.changeData(dateData,activityTypeData,distanceData,burnedCaloriesData) ; 
        dataActivity = dataActivity.concat(unfilteredData);
        unfilteredData = [];
        sortColumn()
        calculateBurnedCalories()
       
        giveId();
        groupedMeal = groupByDate();
        localStorage.setItem("activityData",JSON.stringify(dataActivity));
        loadTableData();
        let data = document.querySelectorAll("#color")
        //console.log(data);
        changeColor(data);
        this.init();
        
       
    }
    // this.date = date;
    // this.activityType = activityType;
    // this.distance = distance;
    // this.burned = 0;
    // this.id = 0;
    changeData(dateData,activityTypeData,distanceData,burnedCaloriesData){
        let changedData = [];
        for(let i = 0;i<dateData.length;i++){

            let date = dateData[i].innerHTML;
            let activityType = activityTypeData[i].innerHTML;
            let distance = distanceData[i].innerHTML;


            date = date.split("-").map(y => y.split("").map(curr => parseInt(curr)).filter(curr => !isNaN(curr)).join("")).join("-")            
            activityType = activityType.split("").filter(curr => { if(isNaN(curr)) { return true; } }).join("")
            distance = parseInt(distance.split("").map(curr => parseInt(curr)).filter(curr => !isNaN(curr)).join(""));
           
            
            if(!distance) distance = 0;
            if(!activityType) activityType = "~";
            if(!date) date = "yy-mm-dd";

           activityType = activityType.replace(activityType[0],activityType[0].toUpperCase());
           var changed = new ActivityObj(date,activityType,distance)
           changed.burned = burnedCaloriesData[i].innerHTML;
           changedData.push(changed);
           
        }
        return changedData;
    }
    cancelEditing(buttons){
        counter +=1;
        counter1 = 0;
        shouldEventStart = true;
        buttons.forEach(el => {
           
            el.style.display = "none";
            
        })
        //localStorage.setItem("activityData",JSON.stringify(dataActivity));
        loadTableData();
        this.init();
        let data = document.querySelectorAll("#color")
        changeColor(data);
        
    }

    deleteRow(buttons){
       
        counter +=1;
        counter1 = 0;

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
       
        changeColor(data);
        this.init();

        //console.log(data)
        Array.from(data).forEach(curr => {
            if(curr.parentNode.isSameNode(this.tds[indexOfElement].parentNode)){
                indexOfElement = Array.from(data).indexOf(curr)
            }
        });
        dataActivity.splice(indexOfElement,1);  
        dataActivity = dataActivity.concat(unfilteredData);
        unfilteredData = [];
        sortColumn()
        calculateBurnedCalories()
        giveId();
        groupedMeal = groupByDate();
        localStorage.setItem("activityData",JSON.stringify(dataActivity));
        loadTableData();
        data = document.querySelectorAll("#color")
        //console.log(data);
        changeColor(data);
        this.init();
        //console.log(this.tds[nodeElement].parentNode)

    }
    createButtonToolbar(){

        let cancelButton = document.getElementById("cancel-button");
        let saveButton = document.getElementById("save-button");
        let deleteButton = document.getElementById("delete-button");
        let buttons = [cancelButton,saveButton,deleteButton];
        
        buttons.forEach(el => {
            
            el.style.display = "inline-block";
        })
        if(counter === 0){
            cancelButton.addEventListener("click",() =>{
            
                this.cancelEditing(buttons);
            });
   
            saveButton.addEventListener("click",() =>{
            
                this.finishEditing(buttons);
            });

            deleteButton.addEventListener("click",() => {
                this.deleteRow(buttons);
            });
        }  
    }
}

const ActivityObj = function(date,activityType,distance){
    this.date = date;
    this.activityType = activityType;
    this.distance = distance;
    this.burned = 0;
    this.id = 0;
}
form.addEventListener("submit",addItem)
form.addEventListener("submit",function(event){
  if(event.keyCode===13 || event.which===13){
      addItem(event);
  }
});
function addItem(event){
 // Get input fields

 let date = document.getElementById("date");
 let activityType = document.getElementById("activity-type");
 let distance = document.getElementById("distance");

 date.focus()
 //console.log(Math.abs(distance.value))
 dataActivity = JSON.parse(localStorage.getItem("activityData"));
 
 // create new obj push it to the array and create localStorage
 let newObj = new ActivityObj(date.value,activityType.value,Math.abs(distance.value));
 dataActivity.push(newObj);
 sortColumn()

 
 // give elements id and group them by date
 giveId();
 groupedMeal = groupByDate();

 // calculate burned calories
 calculateBurnedCalories();
 localStorage.setItem("activityData",JSON.stringify(dataActivity));

 // render the table
 loadTableData();

 // edit table

 let editable = new TableCellEditing(document.querySelector("table"));
 editable.init();


 // change colors
 let data = document.querySelectorAll("#color")
 changeColor(data);



 // clear fields
 date.value = "";
 activityType.value ="Hiking";
 distance.value ="";

 // prevent any default actions
 event.preventDefault()
}


filterButton.addEventListener("click",function(){
    if(counter1 === 0){
        const filterValue = document.getElementById("table-filter").value;

        unfilteredData = dataActivity.filter(elem=>elem.activityType !== filterValue);
        dataActivity = dataActivity.filter(elem=>elem.activityType === filterValue);
      
    
    
        sortColumn()
    
        
        // give elements id and group them by date
        giveId();
        groupedMeal = groupByDate();
       
        // calculate burned calories
        calculateBurnedCalories();
    
    
        loadTableData();
    
        // edit table
    
        let editable = new TableCellEditing(document.querySelector("table"));
        editable.init();
    
    
        // change colors
        let data = document.querySelectorAll("#color")
        
        changeColor(data);
    }
   
    counter1 +=1;
    
})

filterCancelButton.addEventListener("click",cancel);
    
function cancel(){
    dataActivity = JSON.parse(localStorage.getItem("activityData"));
    
    unfilteredData = [];
    sortColumn()

    
    // give elements id and group them by date
    giveId();
    groupedMeal = groupByDate();
   
    // calculate burned calories
    calculateBurnedCalories();


    loadTableData();

    // edit table

    let editable = new TableCellEditing(document.querySelector("table"));
    editable.init();


    // change colors
    let data = document.querySelectorAll("#color")
    changeColor(data);

    counter1 =0;
}
function loadTableData(){
    const tableBody = document.getElementById("tableData");
   
    //console.log(dataActivity)
    let dataHtml = '';
    for(let data of dataActivity){
        dataHtml += `<tr><td class="date-data">${data.date}</td><td class="activity-type">${data.activityType}</td><td class="distance">${data.distance}</td><td class="burned-calories" id="color">${data.burned}</td></tr>`;
    }    
    
    tableBody.innerHTML = dataHtml;
}
function giveId(){
    let id = 0;
   
    for(let i = 0;i<dataActivity.length;i++){
        dataActivity[i].id = id;
      id +=1;
    }
    
}

function changeColor(data){
    let totalBurnedCalories;
    let startId = 0;
    let endId = 0;
    
    //console.log(data);
    for(let i = 0;i<groupedMeal.length;i++){
        totalBurnedCalories = 0;
        startId = groupedMeal[i][0].id;
        endId = groupedMeal[i][groupedMeal[i].length-1].id;
        for (let j = 0;j<groupedMeal[i].length;j++){
            totalBurnedCalories += parseInt(groupedMeal[i][j].burned)
      }
          
        if(totalBurnedCalories < desiredaActivity){
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
function calculateBurnedCalories(){
    let sum = 0;
    const activityCalories = {
        hiking:40,
        running:140,
        swimming:300
    }
    let calorie =0;
    // console.log(dataActivity);
   
   
    dataActivity.forEach(function(curr){
      sum = 0;
      switch(curr.activityType){
        case "Hiking":
            calorie = activityCalories.hiking;
            break;
        case "Running":
            calorie = activityCalories.running;
            break;
        case "Swimming":
            calorie = activityCalories.swimming;
            break;
        default:
            alert("One Of Your Activity Type Is Incorrect");
            break;                
      }

      sum += parseInt(curr.distance) * calorie;
      curr.burned = sum;
  }) 
  //localStorage.setItem("activityData",JSON.stringify(dataActivity));
}
function sortColumn(){
    
    dataActivity.sort((a,b) => compareArraysDeccending(a.date.split("-").map(curr => parseInt(curr)),b.date.split("-").map(curr => parseInt(curr)) ))
      
    //localStorage.setItem("activityData",JSON.stringify(dataActivity));
      
    loadTableData();
    let data = document.querySelectorAll("#color")
    changeColor(data);
    let editable = new TableCellEditing(document.querySelector("table"))
    editable.init();
      
  }
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
  
  
// used for group elements in  the array by the date
function groupByDate(){
    let grouped = [];
    let curr = [];
   
    for(let i = 0;i< dataActivity.length;i++){
        
        if(i === 0){
            elem = dataActivity[0];
            curr.push(elem);
            if(i+1 === dataActivity.length){
                
            grouped.push(curr)
            }
            continue;
        }else{
       
        if(compare(dataActivity[i].date.split("-").map(curr => parseInt(curr)),elem.date.split("-").map(curr => parseInt(curr)) )){
        curr.push(dataActivity[i]);
        if(i+1 === dataActivity.length){
                
            grouped.push(curr)
            }
        }else{
            grouped.push(curr);
            curr = [];
            elem = dataActivity[i];
            curr.push(elem);
            if(i+1 === dataActivity.length){
                
            grouped.push(curr)
            }
        }
            }
    }
    return grouped;
  }
// check if two arrays are equal
function  compare(a,b){
    // console.log("a:",a)
    // console.log("b:",b)
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