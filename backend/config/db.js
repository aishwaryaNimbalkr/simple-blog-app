const mongoose=require('mongoose')
require('dotenv').config();
const connect=()=>{
    mongoose.connect(`${process.env.db}`).then(()=>console.log(`database connected successfully`)).catch((err)=>console.log(err))
}

module.exports={connect}