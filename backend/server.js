import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postsRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js'


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
  
// Set up routes with paths
app.use('/api/users', userRoutes);
app.use('/api/posts', postsRoutes);
app.use(express.static("uploads"))


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const start = async () => { 

       const connectDB = await mongoose.connect("mongodb+srv://apnacollege37:hello@linkedlnclone.xtna8.mongodb.net/?retryWrites=true&w=majority&appName=Linkedlnclone")
       .then(() => console.log("Connected to MongoDB"))
       .catch((error) => console.error("MongoDB connection failed:", error));

        app.listen(8080, () => { 
            console.log("Server is running on port 8080");
        });
    
}

start();
