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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
  <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-3">
    {/* Logo */}
    <NavLink to='/' onClick={() => setOpen(false)}>
      <img className="w-36 md:w-44 h-auto" src={assets.logo} alt="logo" />
    </NavLink>

    {/* Desktop Menu */}
    <div className="hidden sm:flex items-center space-x-6">
      <NavLink to='/' className="text-gray-700 hover:text-green-600">Home</NavLink>
      <NavLink to='/products' className="text-gray-700 hover:text-green-600">All Products</NavLink>
      <NavLink to='/' className="text-gray-700 hover:text-green-600">Contact</NavLink>

      {/* Search bar */}
      <div className="hidden lg:flex items-center border border-gray-300 px-3 rounded-full">
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          className="py-1.5 w-40 bg-transparent outline-none placeholder-gray-500 text-sm"
          type="text"
          placeholder="Search products"
        />
        <img src={assets.search_icon} alt="search" className="w-4 h-4" />
      </div>

      {/* Cart */}
      <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
        <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80" />
        <span className="absolute -top-2 -right-3 text-xs text-black bg-green-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
          {getCardCount()}
        </span>
      </div>

      {/* Login / Profile */}
      {!user ? (
        <button
          onClick={() => setShowUserLogin(true)}
          className="cursor-pointer px-6 py-2 bg-green-500 hover:bg-green-600 transition text-black rounded-full text-sm"
        >
          Login
        </button>
      ) : (
        <div className="relative group">
          <img src={assets.profile_icon} className="w-10" alt="Profile" />
          <ul className="hidden group-hover:block absolute top-12 right-0 bg-white shadow border border-gray-200 py-2.5 w-40 rounded-md text-sm z-40">
            <li onClick={() => navigate("my-orders")} className="p-2 pl-4 hover:bg-green-50 cursor-pointer">My Orders</li>
            <li onClick={logout} className="p-2 pl-4 hover:bg-green-50 cursor-pointer">Logout</li>
          </ul>
        </div>
      )}
    </div>

    {/* Mobile: Cart + Hamburger */}
    <div className="flex items-center gap-4 sm:hidden">
      <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
        <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80" />
        <span className="absolute -top-2 -right-3 text-xs text-black bg-green-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
          {getCardCount()}
        </span>
      </div>
      <button onClick={() => setOpen(!open)} aria-label="Toggle Menu">
        <img src={assets.menu_icon} alt="menu" className="w-6" />
      </button>
    </div>
  </div>

  {/* Mobile Menu Dropdown */}
  {open && (
    <div className="sm:hidden flex flex-col items-start gap-3 px-6 py-4 text-sm bg-white shadow-md border-t border-gray-100 z-40">
      <NavLink to='/' onClick={() => setOpen(false)} className="text-gray-700">Home</NavLink>
      <NavLink to='/products' onClick={() => setOpen(false)} className="text-gray-700">All Products</NavLink>
      {user && <NavLink to='/my-orders' onClick={() => setOpen(false)} className="text-gray-700">My Orders</NavLink>}
      <NavLink to='/' onClick={() => setOpen(false)} className="text-gray-700">Contact</NavLink>

      {!user ? (
        <button
          onClick={() => {
            setOpen(false)
            setShowUserLogin(true)
          }}
          className="cursor-pointer px-5 py-2 bg-green-500 hover:bg-green-600 transition text-black rounded-full text-sm mt-2"
        >
          Login
        </button>
      ) : (
        <button
          onClick={logout}
          className="cursor-pointer px-5 py-2 bg-green-500 hover:bg-green-600 transition text-black rounded-full text-sm mt-2"
        >
          Logout
        </button>
      )}
    </div>
  )}
</nav>

  )
}

export default Navbar
 