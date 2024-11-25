import express from "express";
import 'dotenv/config';
import cors from "cors";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";



const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

await connectDB();

app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);
app.get('/', (req, res) => res.send('API is running'));



app.listen(PORT, () => console.log('Server running on port ' + PORT));