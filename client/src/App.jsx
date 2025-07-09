import React from 'react'
import Navbar from './components/Navbar.jsx'
import { Route , Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer.jsx';
import { useAppContext } from './context/AppContext.jsx';
import Login from './components/Login.jsx';
import Allproduct from './pages/Allproduct.jsx';
import ProductCategory from './pages/ProductCategory.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Addaddress from './pages/Addaddress.jsx';
import MyOrder from './pages/MyOrder.jsx';
import SellerLogin from './components/SellerLogin.jsx';
import SellerLayout from './pages/seller/SellerLayout.jsx';
import ProductList from './pages/seller/ProductList.jsx';
import Orders from './pages/seller/Orders.jsx';
import Addproduct from './pages/seller/Addproduct.jsx';
import LoadingComponent from './components/LoadingComponent.jsx';


const App = () => {

  const isSellerPath=useLocation().pathname.includes("seller")
  const {showUserLogin,isSeller}=useAppContext()
  

  return (
    <div className='text-default min-h-screen-text-gray-700 bg-white'>

      {isSellerPath ? null: <Navbar/>}
      {showUserLogin ? <Login/>:null}

       <Toaster position="top-right" reverseOrder={false} />
       
      <div className={`${isSellerPath ? "" :"px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/products' element={<Allproduct/>} />
          <Route path='/products/:category' element={<ProductCategory/>} />
          <Route path='/products/:category/:id' element={<ProductDetails/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/add-address' element={<Addaddress/>} />
          <Route path='/my-orders' element={<MyOrder/>} />
          <Route path='/loader' element={<LoadingComponent/>} />
          
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin />}>
            <Route index element={<Addproduct />} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
          </Route>
          
          </Routes>
      </div>
        { !isSellerPath && <Footer/> }
    </div>
  )
}

export default App
