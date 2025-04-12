import React, { useEffect, useState } from "react";
import axios from "axios";


const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;


function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    axios.get(API_URL).then((response) => setTasks(response.data));
  }, []);

  // Add new task
  const addTask = async () => {
    if (!newTask) return;
    const response = await axios.post(API_URL, { title: newTask });
    setTasks([...tasks, response.data]);
    setNewTask("");
  };

  // Toggle task completion
  const toggleTask = async (id, completed) => {
    const response = await axios.put(`${API_URL}/${id}`, { completed: !completed });
    setTasks(tasks.map(task => (task.id === id ? response.data : task)));
  };

  // Delete task
  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>To-Do List</h2>
      <input 
        value={newTask} 
        onChange={(e) => setNewTask(e.target.value)} 
        placeholder="Enter a task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.completed ? "line-through" : "" }}>
            {task.title}
            <button onClick={() => toggleTask(task.id, task.completed)}>
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
