import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import { Link,Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerLayout = () => {
   
    const {axios,navigate}=useAppContext()
    const logout= async()=>{
        try {
            const {data}= await axios.get('/api/seller/logout');
            if(data.success){
                toast.success(data.message);
                navigate('/');
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            
        }
    }

    const sidebarLinks = [
  { name: "Add Product", path: "." ,icon:assets.add_icon}, // points to /seller
  { name: "Product List", path: "product-list", icon: assets.product_list_icon },
  { name: "Orders", path: "orders", icon: assets.order_icon },
 ];


  return (
    <>
        <div className="flex items-center justify-between px-4 md:px-8 
            border-b border-gray-300 py-3 bg-white">
                <Link to='/'>
                    <img src={assets.logo} alt="logo"  className='cursor-pointer w-35 md:w-38'/>
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <p>Hi! Admin</p>
                    <button onClick={logout} className='border rounded-full text-sm px-4 py-1 text-green-500'>Logout</button>
                </div>
            </div>

            <div className='flex'>
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 
                pt-4 flex flex-col">
                {sidebarLinks.map((item) => (
                    <NavLink to={item.path} key={item.name} end
                        className={({isActive})=>`flex items-center py-3 px-4 gap-3 
                            ${isActive ? "border-r-4 md:border-r-[6px] bg-green-500/10 border-green-500 text-green-500"
                                : "hover:bg-green-100/90 border-white text-green-600"
                            }`
                        }
                    >
                        <img src={item.icon} alt=""  className='w-7 h-7'/>
                        <p className="md:block hidden text-center">{item.name}</p>
                    </NavLink>
                ))}
            </div>
            <div className="flex-1 p-6 bg-gray-50 min-h-[calc(100vh-64px)] overflow-y-auto">
                <Outlet />
             </div>
        </div>
            
        </>
  )
}

export default SellerLayout
