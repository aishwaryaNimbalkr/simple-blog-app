const User= require('../model/userSchema')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken');



exports.Register = async (req, res) => {
    const { userName, userEmail, userPassword } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(userPassword, 10);
  
      // Check if the email already exists
      const existingUser = await User.findOne({ userEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
  
      const user = new User({
        userName,
        userEmail,
        userPassword: hashedPassword
       
      });
  
      await user.save();
      res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
exports.Login=async(req,res)=>{
 const {userEmail,userPassword} = req.body
    try{
        const user = await User.findOne({userEmail})
        if(!user)
            return res.status(401).json({message:"User does not exist"})

        const compare =await bcrypt.compare(userPassword,user.userPassword)
        if(!compare)
            return res.status(400).json({message:"invalid credentials"})

        const token = jwt.sign({id:user._id,userName: user.userName},'SECRETEKEY')
        console.log(token)
      
res.status(201).json({ token, user })
    }catch(err){
        res.status(400).json({message:err})
    }
}

