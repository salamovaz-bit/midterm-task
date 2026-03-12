import express from "express"
import Task from "./models/Task.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const PORT = 3000;


app.post('/tasks', async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title,
            description: req.body.description
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.patch('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/tasks/stats', async (req, res) => {
    try {
        const tasks = await Task.find();
        const stats = { todo: 0, inProgress: 0, done: 0 };
        tasks.forEach(task => {
            if (task.status === "todo") stats.todo++;
            if (task.status === "in-progress") stats.inProgress++;
            if (task.status === "done") stats.done++;
        });
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


async function startProject() {
    try {
        await mongoose.connect('mongodb+srv://khasanovar_db_user:kiuI04FuzL7wsHdi@cluster0.bkpj51g.mongodb.net/?appName=Cluster0');
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log("Server started on port " + PORT);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}

startProject();
