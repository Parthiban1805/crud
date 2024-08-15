const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 

const mongoURI = 'mongodb+srv://parthiban:Parthiban1805@cluster0.tv47pjs.mongodb.net/crud?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Error connecting to MongoDB:', err));

// Mongoose schema and model
const userSchema = new mongoose.Schema({
    topic_title: {
        type: String,
        required: true
    },
    topic_description: {
        type: String,
        required: true
    }
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);


// GET 
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); 
        return res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: 'Error fetching users' });
    }
});

// POST 
app.post('/users', async (req, res) => {
    const { topic_title, topic_description } = req.body;
    try {
        const newUser = new User({
            topic_title,
            topic_description
        });
        await newUser.save(); 
        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Error saving user:", error);
        return res.status(500).json({ message: 'Error saving user' });
    }
});
//UPDATE
app.put('/users/:id', async (req, res) => {
    const { id } = req.params; 
    const { topic_title, topic_description } = req.body; 

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { topic_title, topic_description },
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: 'Error updating user' });
    }
});
//DELETE
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params; 

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: 'Error deleting user' });
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
