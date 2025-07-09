import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const {isSeller,setIsSeller,navigate,axios}=useAppContext();
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const onSubmitHandler=async(event)=>{
           try {
             event.preventDefault();
             const {data}= await axios.post('/api/seller/login',{email,password}) 
             console.log(data)
             if(data.success){
                setIsSeller(true)
                navigate('/seller')
             }else{
                toast.error(data.message);
             }
           }catch (error) {
            toast.error(error.message)   
           }
    }

    useEffect(()=>{
        if(isSeller){
            navigate("/seller")
        }
    },[isSeller])

  return !isSeller && (
    <form onSubmit={onSubmitHandler} className=' min-h-screen flex items-center text-sm text-gray-600'>
        <div className='flex flex-col gap-4 m-auto items-start 
                p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white'>
            <p className="text-2xl font-medium m-auto">
                <span className="text-green-500">Seller</span> Login
            </p>

            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} type='email' placeholder="Enter Email" 
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500"  required />
            </div>

            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} value={password}   placeholder="Enter password" 
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500" type="password" required />
            </div>

            <button className="bg-green-500 hover:bg-green-600 transition-all 
            text-white w-full py-2 rounded-md cursor-pointer">
              Login  
            </button>

        </div>
      
    </form>
  )
}

export default SellerLogin
