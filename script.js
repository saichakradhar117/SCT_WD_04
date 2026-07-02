const taskInput = document.getElementById("taskInput");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Add Task
addTaskBtn.addEventListener("click", addTask);

function addTask() {

    const text = taskInput.value.trim();

    if (text === "" || startDate.value === "" || endDate.value === "") {
        alert("Please fill all fields!");
        return;
    }

    if (new Date(endDate.value) < new Date(startDate.value)) {
        alert("End Date cannot be before Start Date.");
        return;
    }

    tasks.push({
        text: text,
        startDate: startDate.value,
        endDate: endDate.value,
        completed: false
    });

    taskInput.value = "";
    startDate.value = "";
    endDate.value = "";

    saveTasks();
    renderTasks();
}

// Render Tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach((task, index) => {

        const li = document.createElement("li");
        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div class="left">

                <input type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleComplete(${index})">

                <div class="task-info">

                    <h3>${task.text}</h3>

                    <p>📅 Start Date: ${task.startDate}</p>

                    <p>🏁 End Date: ${task.endDate}</p>

                </div>

            </div>

            <div class="actions">

                <button class="edit"
                    onclick="editTask(${index})">
                    Edit
                </button>

                <button class="delete"
                    onclick="deleteTask(${index})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);

    });

    taskCount.textContent = `Total Tasks : ${tasks.length}`;
}

// Toggle Complete
function toggleComplete(index) {

    tasks[index].completed = !tasks[index].completed;

    saveTasks();

    renderTasks();

}

// Delete Task
function deleteTask(index) {

    if (confirm("Delete this task?")) {

        tasks.splice(index, 1);

        saveTasks();

        renderTasks();

    }

}

// Edit Task
function editTask(index) {

    const newText = prompt("Edit Task", tasks[index].text);

    if (newText === null || newText.trim() === "") return;

    const newStart = prompt(
        "Edit Start Date (YYYY-MM-DD)",
        tasks[index].startDate
    );

    if (newStart === null) return;

    const newEnd = prompt(
        "Edit End Date (YYYY-MM-DD)",
        tasks[index].endDate
    );

    if (newEnd === null) return;

    if (new Date(newEnd) < new Date(newStart)) {
        alert("End Date cannot be before Start Date.");
        return;
    }

    tasks[index].text = newText.trim();
    tasks[index].startDate = newStart;
    tasks[index].endDate = newEnd;

    saveTasks();

    renderTasks();

}

// Save to Local Storage
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// Filter Buttons
filters.forEach(button => {

    button.addEventListener("click", () => {

        filters.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});

// Initial Load
renderTasks();