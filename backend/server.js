const express = require('express')
const cors = require('cors');
const app=express();
require('dotenv').config();
const port=process.env.port || 5000
require('./config/db').connect()
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());
const BlogRoutes=require('./routes/blogRoutes')
const UserRoutes=require('./routes/userRoutes')
app.use('/api/blog',BlogRoutes);
app.use('/api/user',UserRoutes)
app.listen(port,()=>console.log(`we are listening to port ${port}`))