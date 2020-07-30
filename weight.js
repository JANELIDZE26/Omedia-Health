const form = document.getElementById("form");
let Dataweight = [];
let desiredWeight = localStorage.getItem("weight");
let nodeElement;
let indexOfElement;
let shouldEventStart = true;
let counter = 0;
if(JSON.parse(localStorage.getItem("weightData")) === null){
    localStorage.setItem("weightData",JSON.stringify(Dataweight));
  }
window.onload = function () {
   
    loadTableData();
    
    let editable = new TableCellEditing(document.querySelector("table"))
    editable.init();
   
    let data = document.querySelectorAll("#color")
    changeColor(data);
     Dataweight = JSON.parse(localStorage.getItem("weightData"));
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
        
        
        //td.setAttribute("data-old-value",td.innerHTML);
        this.createButtonToolbar();
    }
    finishEditing(buttons){
        let dateData = document.querySelectorAll(".date-data");
        let weightData = document.querySelectorAll(".weight-data");
        
        
        shouldEventStart = true;
        counter +=1;
        buttons.forEach(el => {
           
            el.style.display = "none";
            
        })
        Dataweight = this.changeData(dateData,weightData) ; 
        localStorage.setItem("weightData",JSON.stringify(Dataweight));
        loadTableData();
        let data = document.querySelectorAll("#color")
        changeColor(data);
        this.init();
        
       
    }
    changeData(dateData,weightData){
        let changedData = [];
        for(let i = 0;i<dateData.length;i++){

            let date = dateData[i].innerHTML;
            let weight = weightData[i].innerHTML;


            date = date.split("-").map(y => y.split("").map(curr => parseInt(curr)).filter(curr => !isNaN(curr)).join("")).join("-")            
            weight = parseInt(weight.split("").map(curr => parseInt(curr)).filter(curr => !isNaN(curr)).join(""));
           
            
            if(!weight) weight = 0;
            if(!date) date = "yy-mm-dd";




           var changed = new WeightObj(date,weight)
           changedData.push(changed);
        }
        return changedData;
    }
    deleteRow(buttons){
        counter +=1;
       

        shouldEventStart = true;
        buttons.forEach(el => {
           
            el.style.display = "none";
            
        });
        loadTableData();
        let data = document.querySelectorAll("#color")
        //console.log(data);
        changeColor(data);
        this.init();

        Array.from(data).forEach(curr => {
            //console.log(this.tds[indexOfElement].parentNode)
            if(curr.parentNode.isSameNode(this.tds[indexOfElement].parentNode)){
                indexOfElement = Array.from(data).indexOf(curr)
            }
        });
        Dataweight.splice(indexOfElement,1);  
        localStorage.setItem("weightData",JSON.stringify(Dataweight));
        loadTableData();
        data = document.querySelectorAll("#color")
        //console.log(data);
        changeColor(data);
        this.init();
    }
    cancelEditing(buttons){
        counter +=1;
        shouldEventStart = true;
        buttons.forEach(el => {
           
            el.style.display = "none";
            
        })
        localStorage.setItem("weightData",JSON.stringify(Dataweight));
        loadTableData();
        this.init();
        let data = document.querySelectorAll("#color")
        changeColor(data);
        //td.innerHTML = td.getAttribute("data-old-value");
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

let WeightObj = function(date,weight){
    this.date = date;
    this.weight = weight;
}
form.addEventListener("submit",addItem);
form.addEventListener("submit",function(event){
    if(event.keyCode===13 || event.which===13){
        addItem(event);
    }
  });



 function addItem (event){
    // get fields
    let date = document.getElementById("date");
    let weight = document.getElementById("weight-field");
    date.focus()
    // create new obj
    let newOBj  = new WeightObj(date.value,Math.abs(weight.value));
    Dataweight.push(newOBj);

    localStorage.setItem("weightData",JSON.stringify(Dataweight));

    // render 
    loadTableData();

    //edit table
    let editable = new TableCellEditing(document.querySelector("table"));
    editable.init();

    // check if weight is more than desired weight
    let data = document.querySelectorAll("#color")

    changeColor(data);

    //clear fields
    date.value="";
    weight.value="";
    event.preventDefault();
}


function loadTableData(){
    const tableBody = document.getElementById("tableData");
    let localData = JSON.parse(localStorage.getItem("weightData"));
    
    let dataHtml = ''

        for(let data of localData){
        dataHtml += `<tr><td id="data-date" class="date-data" >${data.date}</td><td class="weight-data" id="color">${data.weight}</td></tr>`   
    }
    tableBody.innerHTML = dataHtml;
}

function changeColor(data){
   
    Array.from(data).forEach(curr =>{
       
        if(parseInt(curr.textContent) > parseInt(desiredWeight)){

          curr.id = "red-data";
        }else{
          curr.id="green-data";
        }
    })
}