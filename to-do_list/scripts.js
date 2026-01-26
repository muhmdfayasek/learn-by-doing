const habitInput = document.querySelector("#habit-input");
const addBtn = document.querySelector(".add-btn");
const habitCount = document.querySelectorAll(".habit-count");

let habitList = document.querySelector("#habit-list");
let completedHabitList =  document.querySelector("#completed-habit-list");

let habitArray = JSON.parse(localStorage.getItem('habitTracker')) || [];


function saveToLocalStorage(){
    localStorage.setItem('habitTracker', JSON.stringify(habitArray));
}


//Render the page to display every list items or habits
function showHabits(){
    habitList.innerHTML = ""; //clear existing li elements
    completedHabitList.innerHTML = "";

    //Intializing the count
    let countOfIncompletedTask = 0;
    let countOfCompletedTask = 0;

    //Loop to display every habits
    habitArray.forEach((value) => {

        if(!value.completed) { //Display incompleted tasks

            let li = document.createElement("li");
            
            li.setAttribute("data-id", value.id);
            li.innerHTML = `<div>
            <h4 class="habit-date">${value.date}</h4>
            <p class="habit-display">${value.habit}</p>
            </div>
            <div class="section-btn">
            <button class="list-btn edit-btn"><i class="bi bi-pencil-fill"></i></button>
            <button class="list-btn delete-btn"><i class="bi bi-trash-fill"></i></button>
            <input type="checkbox" class="list-btn isCompleted ">
            </div>`;
            
            habitList.appendChild(li);

            //Count the number of incompleted task
            countOfIncompletedTask++;
            
        } else { //Display completed tasks
            
            let li = document.createElement("li");
            
            li.setAttribute("data-id", value.id);
            li.innerHTML = `<div>
            <h4 class="habit-date">${value.date}</h4>
            <p class="habit-display">${value.habit}</p>
            </div>
            <div class="section-btn">
            <button class="list-btn delete-btn"><i class="bi bi-trash-fill"></i></button>
            <input type="checkbox" ${value.completed ? 'checked' : ''}  class="list-btn isCompleted ">
            </div>`;
            
            completedHabitList.appendChild(li);
            
            //Count the number of incompleted task
            countOfCompletedTask++;
            
        }
    });

    //Inserting the count to HTML
    habitCount[0].textContent = countOfIncompletedTask;
    habitCount[1].textContent = countOfCompletedTask;

}


//Take value and add it to array (take, validate, add)
const getHabit = () => {
        let habitVal = habitInput.value.trim();
        habitVal = habitVal.charAt(0).toUpperCase() + habitVal.slice(1);

        if (habitVal !== "") {
            const newDate = new Date();  //Array structure
            const newHabit = {
                id: Date.now(),
                date: newDate.toDateString(),
                habit: habitVal,
                completed: false,
            };

            habitArray.push(newHabit); //Adding elements to the array

            showHabits();
            saveToLocalStorage();

            //clear the input filed and make focus after every enter
            habitInput.value = "";
            habitInput.focus();
        } else {
            window.alert("Enter a habit.... It's empty buddy.....");
        }
}    


//Delete habit
const deleteHabit = (event) => {

    //Checks where user clicked
    if(event.target.closest(".bi-trash-fill") || event.target.classList.contains("delete-btn")) {

        // console.log('clicked', event.target, 'closest .delete-btn ->', event.target.closest('.delete-btn'));

        //Find the closest li element, it's data-id
        const getLiId = event.target.closest('li');
        const idToDelete = Number(getLiId.getAttribute('data-id'));

        //Then delete if the id is correct
        habitArray = habitArray.filter(habit => habit.id !== idToDelete);

        showHabits();
        saveToLocalStorage();
    }
}


//Edit existing habit
const editHabit = (event) => {

    //Checkes where user clicked
    if(event.target.closest(".bi-pencil-fill") || event.target.classList.contains("edit-btn")) {
        const getLiId = event.target.closest('li');
        const idToEdit = Number(getLiId.getAttribute('data-id'));

        //console.log('clicked', event.target, 'closest .edit-btn ->', event.target.closest('.edit-btn'));

        //Find the closest li element, it's data-id
        newHabitArray = habitArray.map((habits) => {
            
            //If find then change the habit
            if(habits.id === idToEdit) {
                let editedHabit = window.prompt("Edit you habit", habits.habit);
                editedHabit = editedHabit.trim();
                editedHabit = editedHabit.charAt(0).toUpperCase() + editedHabit.slice(1);

                if(editedHabit !== null && editedHabit !== "") {
                    habits.habit = editedHabit;

                    showHabits();
                    saveToLocalStorage();
                }
            }
        });

        // console.log(newHabitArray);
    }
}


//Allow user to enter task completed or not
function checkCompleted(event)  {

    // console.log('checkbox change', event.target, event.target.checked);
    
    if (event.target.type === 'checkbox') {
        
        const idToToggle = Number(event.target.closest('li').getAttribute('data-id'));
        
        habitArray = habitArray.map((habit) => {
            
            if(habit.id === idToToggle) {
                return {...habit, completed: event.target.checked};
            }

            return habit;
        });

        showHabits();
        saveToLocalStorage();
    }
}


//Intializing every functions
showHabits();

addBtn.addEventListener("click", getHabit);
habitInput.addEventListener("keydown", event => {
    if (event.key === 'Enter') {
        getHabit();
    }
});

habitList.addEventListener("click", deleteHabit);
completedHabitList.addEventListener("click", deleteHabit);

habitList.addEventListener("click", editHabit); 

habitList.addEventListener("change", checkCompleted);
completedHabitList.addEventListener("change", checkCompleted);

