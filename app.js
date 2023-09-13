const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let tasks = [];

app.get('/', (req, res) => {
  console.log("welcom to ToDoList ....")
  res.send()
});

app.post('/saveTasks', (req, res) => {
  try {
    saveTasksToFile(tasks);
    res.json({ success: true, message: 'Tasks saved successfully.' });
  } catch (error) {
    res.json({ success: false, message: 'Failed to save tasks.' });
  }
});

app.get('/loadTasks', (req, res) => {
  try {
    tasks = loadTasksFromFile();
    res.json({ success: true, message: 'Tasks loaded successfully.' });
  } catch (error) {
    res.json({ success: false, message: 'Failed to load tasks.' });
  }
});


app.post('/addtask', (req, res) => {
  const task = req.body.task;
  if (task.trim() !== '') {
    tasks.push(task);
    saveTasks(tasks); // Save tasks to the JSON file
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.put('/edittask/:index', (req, res) => {
  const index = req.params.index;
  const updatedTask = req.body.task;
  if (index >= 0 && index < tasks.length && updatedTask.trim() !== '') {
    tasks[index] = updatedTask;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.delete('/deletetask/:index', (req, res) => {
  const index = req.params.index;
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get('/showtasks', (req, res) => {
  res.json({ tasks });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
