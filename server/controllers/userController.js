import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Register a new user :/api/user/register

export const registerUser = async(req, res) => {

 try{

    const { name, email, password } = req.body;

  // Basic validation
   if (!name || !email || !password) {
    return res.json({success:false, message: 'All fields are required' });
   }

  // Check if user exists
  const userExists = await User.findOne({email})
  if (userExists) {
    return res.json({ success:false, message: 'User already exists' });
  }

  const hashedPassword=await bcrypt.hash(password,10)
   // Save new user with hashing 
  const user = await User.create({ name, email, password:hashedPassword });

  const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

  res.cookie('token',token ,{
    httpOnly:true, // prevent javascript to access cookie 
    secure:process.env.NODE_ENV === 'production', // use scure cookie in production 
    sameSite:process.env.NODE_ENV === 'production' ? 'none': 'strict',
    maxAge:7*24*60*60*1000,
  })

  return res.json({ success:true, user:{email:user.email,name:user.name}})

    }
    catch(error){
        console.log(error.message);
        res.json({ success:false, message: error.message});
    }

} 



//Login user :/api/user/login
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.json({success:false, message: 'Email and password are required' });
        }

        const user=await User.findOne({email});

        if(!user){
            return res.json({success:false, message: 'invalid email and password' });
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false, message: 'Invalid email or password'});  
        }

        const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token ,{
        httpOnly:true, 
        secure:process.env.NODE_ENV === 'production', 
        sameSite:process.env.NODE_ENV === 'production' ? 'none': 'strict',
        maxAge:7*24*60*60*1000,
        })

        return res.json({ success:true, user:{email:user.email,name:user.name}})

    }
    catch(error){
        console.log(error.message);
        res.json({ success:false, message: error.message});
    }
}

// check Authorized user : api/user/is-auth
export  const isAuth=async(req,res)=>{
    try{
        const userId = req.userId; 
        const user=await User.findById(userId).select("-password")
        return res.json({success:true,user})

    }catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//logout user : api/user/logout

export const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{
             httpOnly:true, // prevent javascript to access cookie 
             secure:process.env.NODE_ENV === 'production', // use scure cookie in production 
             sameSite:process.env.NODE_ENV === 'production' ? 'none': 'strict'
        });

        return res.json({success:true, message:"Logged out"})

    }catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}



