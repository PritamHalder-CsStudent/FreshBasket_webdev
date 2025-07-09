import Address from "../models/Address.js";


// add address :/api/adress/add
export  const addAddress=async(req,res)=>{
    try {
        const {address}=req.body;
        const userId=req.userId;
        await Address.create({...address,userId})
        res.json({success:true,message:"address added successfully"})
    } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})  
    }
}

// add address :/api/adress/get

export const getAddress=async(req,res)=>{
    try {
        const userId = req.userId;
        const address = await Address.find({userId});

        res.json({success:true,message:"address found successfully",address})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})  
    }
}

