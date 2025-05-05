import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/usersRoute.js';
import { configDotenv } from 'dotenv';

// app.use("/api/admin", adminRoutes);


// app config
const app = express()
const port = process.env.PORT || 4000
configDotenv();
connectDB()
connectCloudinary();

// middleware
app.use(express.json())
// app.use(bodyParser.json());
app.use(express.static('dist'))
app.use('/admin', express.static('dist_admin'));
app.use(cors())
app.use(express.urlencoded({ extended: true }));



// api endpoints
app.use("/api/admin", adminRouter); // ✅ Base path


// // localhost:5000/api/admin/add-doctor

app.use('/api/doctor', doctorRouter)
app.use('/api/user' , userRouter)

// app.get('/' ,(req,res)=>{
//     res.send('API WORKING ')
// })

app.use((req, res, next) => {
    console.log("❌ Route not found:", req.method, req.originalUrl);
    res.status(404).json({ error: "Route not found" });
  });
  
app.listen(port, ()=> console.log("Server Started" , port ) )