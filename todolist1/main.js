const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const users = [
    {
        username: 'tina vakili', password: '1234'
    }
]

const loggedInUser = { username: '', authenticated: false };

const status = false ;
const filePath = 'data.json';

function login() {
    rl.question('Enter username: ', (username) => {
        rl.question('Enter password: ', (password) => {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                loggedInUser.username = user.username;
                loggedInUser.authenticated = true;
                console.log(`Logged in as ${user.username}`);
                showOptions();
            } else {
                console.log('Invalid username or password.\n press 1 to try again ...ef');
                rl.prompt();
            }
        });
    });
}
function loadTasks() {
    try {
        const jsonData = fs.readFileSync(filePath, 'utf8');//reading filePath data(data.json)
        return JSON.parse(jsonData);
    } catch (err) {
        return [];
    }
}
function saveTasks(tasks) {
    const jsonData = JSON.stringify(tasks, null, 2);// JSON.stringify is for convert json data to string
    fs.writeFileSync(filePath, jsonData);
}

const tasks = [];

function printTasks() {
    console.log('Tasks:');
    for (let i = 0; i < tasks.length; i++) {
        console.log(`${i + 1}. ${tasks[i].task} [${tasks[i].checked ? 'checked' : ' '}]`);//print number of work and name
    }
}

function addTask() {
    rl.question('Enter the task: ', (task) => {
        tasks.push({ task: task , checked: false });
        console.log('Task added successfully.');
        saveTasks(tasks);
        printTasks();
        rl.prompt();
    });
}
function checkTask() {
    printTasks();
    rl.question('Enter the task number you want to check/uncheck: ', (indexStr) => {
        const index = parseInt(indexStr) - 1;
        if (index >= 0 && index < tasks.length) {
            tasks[index].checked = !tasks[index].checked;
            console.log(`Task ${index + 1} is  ${tasks[index].checked ? 'checked' : 'unchecked'}.`);
            saveTasks(tasks);
            printTasks();
            rl.prompt();
        } else {
            console.log('Invalid task number.');
            rl.prompt();
        }

    });
}

function editTask() {
    printTasks();
    rl.question('Enter the task number you want to edit: ', (indexStr) => {
        const index = parseInt(indexStr) - 1;
        if (index >= 0 && index < tasks.length) {
            rl.question('Enter the new task text: ', (newTask) => {
                tasks[index].task = newTask;
                console.log('Task edited successfully.');
                saveTasks(tasks);
                printTasks();
                rl.prompt();
            });
        } else {
            console.log('Invalid task number.');
            rl.prompt();
        }
    });
}

function deleteTask() {
    printTasks();
    rl.question('Enter the task number you want to delete: ', (indexStr) => {
        const index = parseInt(indexStr) - 1;
        if (index >= 0 && index < tasks.length) {
            tasks.splice(index, 1);
            console.log('Task deleted successfully.');
            saveTasks(tasks);
            printTasks();
            rl.prompt();
        } else {
            console.log('Invalid task number.');
            rl.prompt();
        }
    });
}
function mostTaskToTop(taskNumber) {
    if (taskNumber >= 1 && taskNumber <= tasks.length) {
        const taskIndex = taskNumber - 1;
        const taskToMove = tasks.splice(taskIndex, 1)[0]; // Remove the task from the array
        tasks.unshift(taskToMove); // Add the task to the beginning of the array
        console.log(`Task ${taskNumber} moved to the top.`);
        saveTasks(tasks);
        printTasks();
    } else {
        console.log('Invalid task number.');
    }
    rl.prompt();
}



function showOptions() {
    console.log('\nOptions:');
    if (loggedInUser.authenticated) {

        console.log('1. Add a task');
        console.log('2. Edit a task');
        console.log('3. Delete a task');
        console.log('4. Check a task');
        console.log('5. Logout');
        console.log('6. Prioritizing your tasks')
        console.log('7. Display the most important task');
        console.log('8. Show Options')
        console.log('9. Exit');
    } else {
        login();
    }
    rl.prompt();
}
function authenticate() {// for login
    if (loggedInUser.authenticated) {
        showOptions();
    } else {
        login();
    }
}


rl.on('line', (input) => {
    switch (input.trim()) {
        case '1':
            authenticate();
            addTask();
            break;
        case '2':
            authenticate();
            editTask();
            break;
        case '3':
            authenticate();
            deleteTask();
            break;
        case '4':
            authenticate();
            checkTask();
            break;

        case '5':
            loggedInUser.authenticated = false;
            loggedInUser.username = '';
            console.log('Logged out.');
            showOptions();
            break;

        case '6':
            authenticate();
            rl.question('Enter the task number you want to move to the top: ', (taskNumberStr) => {
                const taskNumber = parseInt(taskNumberStr);
                mostTaskToTop(taskNumber);
            });
            break;
        case '7':
            authenticate();
            const mostImportantTask = tasks[0] ? tasks[0].task : "No tasks yet.";
            console.log(`The most important task you have is: ${mostImportantTask}`);
            rl.prompt();
            break;


        case '8':
            showOptions();
            break;

        case '9':
            rl.close();
            break;
        default:
            console.log('Invalid option. Try again.');
            showOptions();
            break;
    }
});

console.log('Welcome to the To-Do List App!\n');
showOptions();
