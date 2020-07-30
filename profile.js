if(JSON.parse(localStorage.getItem("activityData")) === null){
    localStorage.setItem("activityData", JSON.stringify([]));
}
if(JSON.parse(localStorage.getItem("mealData")) === null){
    localStorage.setItem("mealData",JSON.stringify([]));
}
if(JSON.parse(localStorage.getItem("weightData")) === null){
    localStorage.setItem("weightData",JSON.stringify([]));
}
let concatedArray = [];
let groupedData = [];
let mainArray = [];
let infoArray = [];
let activityData = JSON.parse(localStorage.getItem("activityData"))
let weightData = JSON.parse(localStorage.getItem("weightData"));
let mealData = JSON.parse(localStorage.getItem("mealData"));
let desiredWeight = localStorage.getItem("weight");
let desiredaActivity = localStorage.getItem("activity");
let desiredMeal = localStorage.getItem("meal");
const edit = document.getElementById("edit-button");
const cancel = document.getElementById("profile-edit-cancel");
const save = document.getElementById("profile-edit-save");
let counter = 0;


// editing profile start
edit.addEventListener("click",function(){
    if(counter ===0 ){
        document.getElementById("checkbox").checked = true;
        document.getElementById("profile-edit-save").style.display = "inline-block";
        document.getElementById("profile-edit-cancel").style.display = "inline-block";
        myfunc();
        infoArray.forEach(curr => {
            curr.setAttribute("contentEditable",true);
            curr.classList.toggle("edit");
            //curr.style.outline = "none";
           
            
        })
        }
        counter +=1;

})
save.addEventListener("click",function(){
    infoArray.forEach(curr => {
        
        curr.setAttribute("contentEditable",false)
        curr.classList.toggle("edit")
    })
    localStorage.setItem("name",infoArray[0].textContent);
    localStorage.setItem("email",infoArray[1].textContent);
    localStorage.setItem("password",infoArray[2].textContent);
    localStorage.setItem("weight",infoArray[3].textContent);
    localStorage.setItem("meal",infoArray[4].textContent);
    localStorage.setItem("activity",infoArray[5].textContent);

    desiredWeight = localStorage.getItem("weight");
    desiredaActivity = localStorage.getItem("activity");
    desiredMeal = localStorage.getItem("meal");

    loadTableData();
    changeColor();
    document.getElementById("checkbox").checked = false;
    myfunc();
    document.getElementById("profile-edit-save").style.display = "none";
    document.getElementById("profile-edit-cancel").style.display = "none";
    counter = 0;
})
cancel.addEventListener("click",function(){
    infoArray.forEach(curr => {
        curr.setAttribute("contentEditable",false)
        curr.classList.toggle("edit")
    })
    document.getElementById("checkbox").checked = false;
    document.getElementById("profile-edit-save").style.display = "none";
    document.getElementById("profile-edit-cancel").style.display = "none";
    counter = 0;
    initializeInfo();
})

function initializeInfo(){
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const name = document.getElementById("name");
    const weight = document.getElementById("weight");
    const meal = document.getElementById("meal");
    const activity = document.getElementById("activity");
    infoArray = [name,email,password,weight,meal,activity];

    email.textContent = localStorage.getItem("email");
    password.textContent = "*".repeat(localStorage.getItem("password").length)
    name.textContent = localStorage.getItem("name");
    weight.textContent = localStorage.getItem("weight");
    meal.textContent = localStorage.getItem("meal");
    activity.textContent = localStorage.getItem("activity");
}
  // controls if the password should appear
function myfunc(){
    if(document.getElementById("checkbox").checked){
        password.textContent = localStorage.getItem("password");
    }else{
        password.textContent = "*".repeat(localStorage.getItem("password").length);
    }
}
// editing profile end




// dashboard
const DashObj = function(date,weight,totalMealCalories,totalBurnedCalories){
    this.date = date;
    this.weight = weight;
    this.totalMealCalories = totalMealCalories;
    this.totalBurnedCalories = totalBurnedCalories;
}
window.onload = function(){
 
    init();
    
}
function init(){
    initializeInfo()
    concatedArray = [...activityData,...mealData,...weightData]
    sortColumn();
    groupedData = groupByDate()
    calculateTotals();
    loadTableData();
    changeColor();
}

function loadTableData(){
    const tableBody = document.getElementById("tableData");
   
    //console.log(dataActivity)
    let dataHtml = '';
    for(let data of mainArray){
        if(data.weight === undefined || data.weight === 0){
            data.weight = "~";
        }
        if(data.date === undefined || data.date === ""){
            data.date = "~";
        }
        if(data.totalBurnedCalories === 0 ){
            data.totalBurnedCalories = "~";
        }
        if(data.totalMealCalories === 0){
            data.totalMealCalories = "~";
        }
        dataHtml += `<tr><td class="date-data">${data.date}</td><td class="weight-data" id="weight-color">${data.weight}</td><td class="meal-calories" id="meal-color">${data.totalMealCalories}</td><td class="burned-calories" id="burned-color">${data.totalBurnedCalories}</td></tr>`;
    }    
    
    tableBody.innerHTML = dataHtml;
}
function changeColor(){
    const weightColor = document.querySelectorAll("#weight-color");
    const mealColor = document.querySelectorAll("#meal-color");
    const burnedColor = document.querySelectorAll("#burned-color");
   
    Array.from(weightColor).forEach(curr =>{
       
        if(parseInt(curr.textContent) > parseInt(desiredWeight)){

          curr.id = "red-data";
        }else if(parseInt(curr.textContent) <= parseInt(desiredWeight)){
          curr.id="green-data";
        }
    })
    Array.from(mealColor).forEach(curr =>{
       
        if(parseInt(curr.textContent) > parseInt(desiredMeal)){

          curr.id = "red-data";
        }else if(parseInt(curr.textContent) <= parseInt(desiredMeal)){
          curr.id="green-data";
        }
    })
    Array.from(burnedColor).forEach(curr =>{
       
        if(parseInt(curr.textContent) < parseInt(desiredaActivity)){

          curr.id = "red-data";
        }else if(parseInt(curr.textContent) >= parseInt(desiredaActivity)){
          curr.id="green-data";
        }
    })
}
function calculateTotals(){
    let date,weight,totalBurnedCalories,totalMealCalories;
    for(let i = 0;i<groupedData.length;i++){
        totalBurnedCalories = 0;
        totalMealCalories = 0 ;
        weight = 0;
        for(let j = 0;j<groupedData[i].length;j++){
            date = groupedData[i][j].date;
            if(groupedData[i][j].hasOwnProperty("weight")){
                weight = groupedData[i][j].weight;
            }
            if(groupedData[i][j].hasOwnProperty("burned")){
                totalBurnedCalories += parseInt(groupedData[i][j].burned);
            }
            if(groupedData[i][j].hasOwnProperty("calorie")){
                totalMealCalories +=parseInt(groupedData[i][j].calorie);
            }
        }
        let newObj = new DashObj(date,weight,totalMealCalories,totalBurnedCalories);
        mainArray.push(newObj);
    }
}
function groupByDate(){
    let grouped = [];
    let curr = [];
   
    for(let i = 0;i< concatedArray.length;i++){
        
        if(i === 0){
            elem = concatedArray[0];
            curr.push(elem);
            if(i+1 === concatedArray.length){
                
            grouped.push(curr)
            }
            continue;
        }else{
       
        if(compare(concatedArray[i].date.split("-").map(curr => parseInt(curr)),elem.date.split("-").map(curr => parseInt(curr)) )){
        curr.push(concatedArray[i]);
        if(i+1 === concatedArray.length){
                
            grouped.push(curr)
            }
        }else{
            grouped.push(curr);
            curr = [];
            elem = concatedArray[i];
            curr.push(elem);
            if(i+1 === concatedArray.length){
                
            grouped.push(curr)
            }
        }
            }
    }
    return grouped;
  }
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
  function sortColumn(){
    
    concatedArray.sort((a,b) => compareArraysDeccending(a.date.split("-").map(curr => parseInt(curr)),b.date.split("-").map(curr => parseInt(curr)) ))  
  }