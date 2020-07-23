class TableCellEditing{
    constructor(table) {
        this.tbody = table.qeurySelector("table");
    }
    init(){
        const tds = this.tbody.querySelectorAll("td");
        tds.forEach(td => {
            td.setAttribute("contenteditable",true);
        });
    }
}
