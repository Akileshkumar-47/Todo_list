const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("DB CONNECTED"))
.catch(err => console.log(err));

// Define Schema & Model
const todoSchema = new mongoose.Schema({
    title: {
        required:true,
        type:String
    },
    description: String
});
const todoModel = mongoose.model('Todo', todoSchema);

// Create a new todo
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating todo" });
    }
});

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update todo item
app.put("/todos/:id", async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        
        const updateTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true } // Return the updated document
        );

        if (!updateTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json(updateTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//delete todo item
app.delete('/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await todoModel.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



// Start server
const port = 8000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
