const form = document.getElementById("form");
const desiredaActivity = localStorage.getItem("activity");
let dataActivity = [];
let shouldEventStart = true;
let counter = 0;
let sortDirection = false;


const ActivityObj = function(date,activityType,distance){
    this.date = date;
    this.activityType = activityType;
    this.distance = distance;
    this.burned = 0;
}
form.addEventListener("submit",function(event){
    // Get input fields
    let date = document.getElementById("date");
    let activityType = document.getElementById("activity-type");
    let distance = document.getElementById("distance");

    // create new obj push it to the array and create localStorage
    let newObj = new ActivityObj(date.value,activityType.value,distance.value);
    dataActivity.push(newObj);
    localStorage.setItem("activityData",dataActivity);


   
    // calculate burned calories
    calculateBurnedCalories();

    // render the table
    loadTableData();


    // change colors
    let data = document.querySelectorAll("#color")
    changeColor(data);



    // clear fields
    date.value = "";
    activityType.value ="Hiking";
    distance.value ="";

    event.preventDefault()
})

function loadTableData(){
    const tableBody = document.getElementById("tableData");
   

    let dataHtml = '';
    for(let data of dataActivity){
        dataHtml += `<tr><td class="date-data">${data.date}</td><td class="activity-type">${data.activityType}</td><td class="burned-calories" id="color">${data.burned} (${data.distance} Km)</td></tr>`;
    }    
    
    tableBody.innerHTML = dataHtml;
}
function changeColor(data){
    let totalActivityCalories = 0;
    
    
    for(let i = 0;i<dataActivity.length;i++){
        totalActivityCalories += parseInt(dataActivity[i].burned);
    }
    if(totalActivityCalories > desiredaActivity){
        Array.from(data).forEach(curr =>{
        curr.id = "red-data";
             })
    }else{
        Array.from(data).forEach(curr =>{
        curr.id="green-data";
    })
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
   console.log(dataActivity);
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
            console.log("i dont know this type of activity");
            break;                
      }

      sum += parseInt(curr.distance) * calorie;
      curr.burned = sum;

  })

  
}