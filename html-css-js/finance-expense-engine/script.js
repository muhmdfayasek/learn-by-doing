const incomeForm = document.querySelector('.income-form');
const expenseForm = document.querySelector('.expense-form');
const tableBody = document.querySelector('#table-tbody');
const totalMoneyCount = document.querySelectorAll('.money-count');
const editingBox = document.querySelector('.editing-box');

let financeDataArray = JSON.parse(localStorage.getItem('financeData')) || [];


function saveToLocalStorage() {
    localStorage.setItem('financeData', JSON.stringify(financeDataArray));
}


// Function to format the date from input - DD/MM/YYYY
function formatedDate(dateString) {
    if(!dateString) return "";
            
    const [year, month, day] = dateString.split('-');
            
    return `${day}/${month}/${year}`;
}

// Function to format the date to input - YYYY-MM-DD
const unFormatDate = (dateString) => {
    const [day, month, year] = dateString.split('/');

    return `${year}-${month}-${day}`;
} 

// Function to capitalize the first letter of user input
function capFirstLetter(nameString) {
    const changedName = nameString.charAt(0).toUpperCase() + nameString.slice(1);

    return changedName;
}


// Function to Display table contents of finance info
function renderTable() {

    tableBody.innerHTML = "";

    financeDataArray.forEach(item => {
        let tableRow = document.createElement('tr');
        
        if(item.type === 'Expense'){    // selecting bg color according to type
            tableRow.classList.add('tr-expense');
        } else{
            tableRow.classList.add('tr-income');
        }
        

        tableRow.innerHTML =   `<td>${item.name}</td>
                                <td>${item.amount}</td>
                                <td>${item.date}</td>
                                <td class="manipulation">
                                    <button class="edit-btn bi bi-pencil-fill" onclick="editItem(${item.id})"></button>
                                    <button class="dlt-btn bi bi-trash-fill" onclick="deleteItem(${item.id})"></button>
                                </td>`;

        tableBody.prepend(tableRow);
    });
}


// adding transactions to the array
function addTransaction(type) {

    if (type === "income"){     // accepting according to the form type
        const incomeName = document.querySelector('#income-name');
        const incomeAmount = document.querySelector('#income-amount');

        const newIncomeData = {id: Date.now(),
                                name: capFirstLetter(incomeName.value.trim()),
                                amount: parseFloat(incomeAmount.value.trim()),
                                date: new Date().toLocaleDateString(),
                                type: 'Income'
                            };


        financeDataArray.push(newIncomeData);
        
        incomeName.value = "";
        incomeAmount.value = "";
        
    } else{
        const expenseName = document.querySelector('#expense-name');
        const expenseAmount = document.querySelector('#expense-amount');
        const expenseDate = document.querySelector('#expense-date');

        const newExpenseData = {id: Date.now(),
                                name: capFirstLetter(expenseName.value.trim()),
                                amount: parseFloat(expenseAmount.value.trim()),
                                date: formatedDate(expenseDate.value),
                                type: 'Expense'
                            };
            
        
        financeDataArray.push(newExpenseData);
        
        expenseName.value = "";
        expenseAmount.value = "";
    }

    renderTable();
    saveToLocalStorage();
    updateTotal();
    // console.log(financeDataArray);
}


// function to update total income, expense & balance
function updateTotal(){
    let totalIncome = 0;
    let totalExpense = 0;
    let totalBalance = 0;

    financeDataArray.forEach((item) => {
        if(item.type ==='Income'){
           totalIncome += item.amount;
        } else{
            totalExpense += item.amount;
        }
    });

    totalBalance = totalIncome - totalExpense;

    if(totalBalance <= 0){   // changing style and value if balance is <= 0
        totalMoneyCount[2].style.color = 'red';
        totalMoneyCount[2].textContent = '0.00';
    } else{
        totalMoneyCount[2].textContent = totalBalance.toFixed(2);
        totalMoneyCount[2].style.color = 'green';
    }

    // changing style of income if it is <= expense
    if(totalIncome < totalExpense) totalMoneyCount[0].style.color = 'red';

    totalMoneyCount[0].textContent = totalIncome.toFixed(2);
    totalMoneyCount[1].textContent = totalExpense.toFixed(2);
}


// function to delete finance data
function deleteItem(itemToDelete) {

    const confirmation = window.confirm("Are you sure"); // confirm the deletion
    
    if (confirmation) {
        financeDataArray = financeDataArray.filter(item => item.id !== itemToDelete);
    }

    renderTable();
    saveToLocalStorage();
    updateTotal();
}


// function to edit finance data if needed
function editItem(itemToEdit) {

    const editingForm = document.querySelector('.editing-form');
    const cancelBtn = document.querySelector('#cancel-btn');

    const editedName = document.querySelector('#edited-name');
    const editedAmount = document.querySelector('#edited-amount');
    const editedDate = document.querySelector('#edited-date');

    editingBox.style.display = 'block';   // make popup the editing inputs

    const dataToEdit = financeDataArray.find(item => item.id === itemToEdit);

        // placing the old values to the editing inputs
        editedName.value = dataToEdit.name;
        editedAmount.value = dataToEdit.amount;  
        editedDate.value = unFormatDate(dataToEdit.date);

    editingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // replacing the old values with the new one
        const newName = capFirstLetter(editedName.value.trim());
        const newAmount = parseFloat(editedAmount.value.trim());
        const newDate = formatedDate(editedDate.value);

        financeDataArray = financeDataArray.map((item) => {
            if (itemToEdit === item.id) {

                return {...item, name: newName, amount: newAmount, date: newDate};
            }

            return item;
        });

        editingBox.style.display = 'none';
        renderTable();
        saveToLocalStorage();
        updateTotal();

    });    

    // function for cancel button of editing input form
    cancelBtn.onclick = function(){
        editingBox.style.display = 'none';
    }
}


// clear all data for fresh restart
function reset() {
    const confirmation = window.confirm("Are you sure. It will delete All");

    if(confirmation){
        financeDataArray = [];
        localStorage.removeItem('financeData');
        
        renderTable();
        updateTotal();

        setTimeout(() => {
            window.alert("Successfully cleared everything");
        },100);

    } else{
        window.alert("You excaped from a big problem");
    }
}


// calling functions

incomeForm.addEventListener('submit', event => {
    event.preventDefault();// To prevent automatic reloading of browser

    addTransaction('income');
});

expenseForm.addEventListener('submit', event => {
    event.preventDefault();// To prevent automatic reloading of browser

    addTransaction('expense');
});

renderTable();
updateTotal();
