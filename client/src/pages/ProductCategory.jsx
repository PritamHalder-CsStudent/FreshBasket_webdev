 import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
import { categories } from '../assets/assets'
import ProductCard from '../components/ProductCard'
 
 const ProductCategory = () => {

    const {products}=useAppContext()
    const {category}=useParams()

    const searchCategory=categories.find((item)=>item.path.toLocaleLowerCase() === category)
    const filteredProducts=products.filter((product)=>product.category.toLocaleLowerCase() ===category)
   return (
     <div className='mt-16'>
       {searchCategory && (
            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
                <div className='w-16 h-0.5 bg-green-500 rounded-full'></div>
            </div>
       )}
       {filteredProducts.length > 0 ? (
            <div className='p-4 md:p-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-6'>
                {
                    filteredProducts.map((product)=>(
                        <ProductCard key={product._id} product={product}/>
                    ))
                }
            </div>
       ):(
        <div className='flex items-center justify-center h-[60vh] '>
            <p className='text-2xl  font-medium text-primary'>No products founds in this categories</p>
        </div>
       )}
     </div>
   )
 }
 
 export default ProductCategory
 