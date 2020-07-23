const form = document.getElementById("form");
let Dataweight = [];
let desiredWeight = localStorage.getItem("weight")

let shouldEventStart = true;
let counter = 0;

window.onload = function () {
   
    loadTableData();
    
    let editable = new TableCellEditing(document.querySelector("table"))
    editable.init();
    Dataweight = JSON.parse(localStorage.getItem("weightData"));
    let data = document.querySelectorAll("#color")
    changeColor(data);
    
}

class TableCellEditing{
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
        
        
        //td.setAttribute("data-old-value",td.innerHTML);
        this.createButtonToolbar(td);
    }
    finishEditing(buttons,td){
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
           var changed = new WeightObj(dateData[i].innerHTML,weightData[i].innerHTML)
           changedData.push(changed);
        }
        return changedData;
    }
    cancelEditing(td,buttons){
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
    createButtonToolbar(td,tds){

        let cancelButton = document.getElementById("cancel-button")
        let saveButton = document.getElementById("save-button")
        let buttons = [cancelButton,saveButton]
        
        buttons.forEach(el => {
            
            el.style.display = "inline-block";
        })
        if(counter === 0){
            cancelButton.addEventListener("click",() =>{
            
            this.cancelEditing(td,buttons)
        });
   
            saveButton.addEventListener("click",() =>{
            
            this.finishEditing(buttons,td,tds)
        });
        }  
    }
}

let WeightObj = function(date,weight){
    this.date = date;
    this.weight = weight;
}
form.addEventListener("submit",function(event){
    // get fields
    let date = document.getElementById("date");
    let weight = document.getElementById("weight-field");

    // create new obj
    let newOBj  = new WeightObj(date.value,weight.value);
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
})

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