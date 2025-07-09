import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
 
 const Allproduct = () => {
    const {products, searchQuery}=useAppContext()
    const [filteredProducts,setFilteredProducts]=useState([])

    useEffect(()=>{
        if(searchQuery.length > 0 ){
            setFilteredProducts(products.filter(
                product=>product.name.toLowerCase().includes(searchQuery.toLowerCase())))
        }else{
            setFilteredProducts(products)
        }
    },[products,searchQuery])
    
   return (
     <div className='mt-16 flex flex-col'>
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium uppercase'>All Products</p>
            <div className='w-16 h-0.5 bg-green-500 rounded-full'></div>
        </div>

        <div className='p-4 md:p-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-6'>
           {filteredProducts.filter((product)=>product.inStock).map((product,index)=>(
            <ProductCard key={index} product={product}/>
           ))} 
        </div>
       
     </div>
   )
 }
 
 export default Allproduct
 