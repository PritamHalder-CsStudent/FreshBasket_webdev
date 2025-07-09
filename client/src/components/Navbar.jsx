import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {assets} from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const {user, setUser, setShowUserLogin,navigate,searchQuery,setSearchQuery,getCardCount,axios}=useAppContext();

    const logout = async ()=>{
        try {
            const {data}=await axios.get('/api/user/logout')
            if(data.success){
                toast.success(data.message)
                setUser(null); 
                navigate('/') 
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
         
        
    }

    useEffect(()=>{
        if(searchQuery.length > 0){
            navigate("/products")
        }
    },[searchQuery])

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

    <NavLink to='/' onClick={()=>setOpen(false)}>
        <img className="w-40 md:w-52 h-auto" src={assets.logo} alt="logo" />
    </NavLink>

    {/* Desktop Menu */}
    <div className="hidden sm:flex items-center gap-8">
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/products'>All Product</NavLink>
        <NavLink to='/'>Contact</NavLink>
       

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input onChange={(e)=>setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent
             outline-none placeholder-gray-500" type="text" placeholder="Search products" />
            <img src={assets.search_icon} alt="search" className='w-4 h-4'/>
        </div>

        <div onClick={()=>navigate('/cart')} className="relative cursor-pointer">
            <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80'/>
            <button className="absolute -top-2 -right-3 text-xs text-black bg-green-500
             w-[18px] h-[18px] rounded-full">{getCardCount()}</button>
        </div>


        { !user ? (
        <button onClick={()=>{
            setShowUserLogin(true)
        }} className="cursor-pointer px-8 py-2 bg-green-500 hover:bg-green-600 transition text-black rounded-full">
            Login
        </button>):( 
            <div className='relative group'>
                <img src={assets.profile_icon} className='w-10' alt="" />
                <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200
                py-2.5 w-30 rounded-md text-sm z-40'>
                    <li onClick={()=>navigate("my-orders")} className='p-1.5 pl-3 hover:bg-green/10 cursor-pointer'>My orders</li>
                    <li onClick={logout} className='p-1.5 pl-3 hover:bg-green/10 cursor-pointer'>Logout</li>
                </ul>
            </div>

        )}

    </div>
    
    <div className='flex items-cener gap-6 sm:hidden'>

        <div onClick={()=>navigate('/cart')} className="relative cursor-pointer">
            <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80'/>
            <button className="absolute -top-2 -right-3 text-xs text-black bg-green-500
             w-[18px] h-[18px] rounded-full">{getCardCount()}</button>
        </div>
        <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" >
        <img src={assets.menu_icon} alt="menu" />
        </button>

    </div>
   


    
    { open && (
    <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
        <NavLink to='/' onClick={()=>setOpen(false)}>Home</NavLink>
        <NavLink to='/products' onClick={()=>setOpen(false)}>All products</NavLink>
        {user && 
        <NavLink to='/' onClick={()=>setOpen(false)}>My Orders</NavLink>
        }
        <NavLink to='/' onClick={()=>setOpen(false)}>Contact</NavLink>

        { !user ? (<button onClick={()=>{setOpen(false);
            setShowUserLogin(true);
        }} className="cursor-pointer px-6 py-2 mt-2 bg-green-500  hover:bg-green-600transition text-black rounded-full text-sm">
            Login
        </button>):
        (<button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-green-500  hover:bg-green-600 transition text-black rounded-full text-sm">
            Logout
        </button>)

        }
       
    </div>
     )}

</nav>
  )
}

export default Navbar
