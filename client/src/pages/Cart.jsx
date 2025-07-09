import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const Cart = () => {
  const {
    products, currency,  updateCartItem,
    removeFromCart, cartItems,setCartItems, getTotalAmount,
    getCardCount, navigate, axios, user
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  // Generate cart array based on cartItems object
  const getCart = () => {
    const tempArray = [];
    for (const key in cartItems) {
      const product = products.find(item => item._id === key);
      if (product) {
        product.quantity = cartItems[key];
        tempArray.push(product);
      }
    }
    setCartArray(tempArray);
  };

  // Fetch user address from backend
  const getUserAddress = async () => {
    try {
      const { data } = await axios.get('/api/address/get');
      if(data.success && Array.isArray(data.address)){
        setAddresses(data.address);
        if (data.address.length > 0) {
          setSelectedAddress(data.address[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const placeOrder = async () => {
    try {
        if(!selectedAddress){
            toast.error('please select the order Address');
        }
        //placed order with 'COD'
        if(paymentOption === 'COD'){
            const {data}=await axios.post('/api/order/cod',{
                items:cartArray.map(item=>({product:item._id,quantity:item.quantity})),
                address:selectedAddress._id
            })
            if(data.success){
                toast.success(data.message)
                setCartItems({})
                navigate('/my-orders')
            }else{
                toast.error(data.message)
            }

        }else{
          //placed order with stripe 
          const {data}=await axios.post('/api/order/stripe',{
                items:cartArray.map(item=>({product:item._id,quantity:item.quantity})),
                address:selectedAddress._id
            })
          if(data.success){
                window.location.replace(data.url)
            }else{
                toast.error(data.message)
            }  

        }
    } catch (error) {
        toast.error(error.message)
    }
  }



  useEffect(() => {
    if (products.length > 0 && cartItems) getCart();
  }, [products, cartItems]);

  useEffect(() => {
    if (user) getUserAddress();
  }, [user]);

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-16 mb-4 gap-8">
      {/* Cart Section */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart <span className="text-sm text-green-500">({getCardCount()} Items)</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
            <div className="flex items-center md:gap-6 gap-3">
              <div onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0); }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>Weight: <span>{product.weight || "N/A"}</span></p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={e => updateCartItem(product._id, Number(e.target.value))}
                      value={cartItems[product._id]}
                      className="outline-none ml-2"
                    >
                      {Array(5).fill('').map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
            <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto">
              <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6" />
            </button>
          </div>
        ))}

        <button
          onClick={() => { navigate("/products"); scrollTo(0, 0); }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium"
        >
          <img className="group-hover:-translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="arrow" />
          Continue Shopping
        </button>
      </div>

      {/* Order Summary Section */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 border border-gray-300/70">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6 relative">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className={`flex justify-between items-start mt-2 ${showAddress ? "mb-36" : "mb-2"}`}>
            <p className="text-gray-500 text-sm max-w-[200px]">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-indigo-500 hover:underline cursor-pointer text-sm"
            >
              Change
            </button>
          </div>

          {showAddress && (
            <div className="absolute top-20 left-0 bg-white border border-gray-300 text-sm w-full z-20 shadow-md">
              {Array.isArray(addresses) && addresses.map((address, index) => (
                <p key={index} onClick={() => { setSelectedAddress(address); setShowAddress(false); }}
                  className="text-gray-700 p-2 hover:bg-gray-100 cursor-pointer">
                  {address.street}, {address.city}, {address.state}, {address.country}
                </p>
              ))}
              <p onClick={() => navigate("/add-address")}
                className="text-red-500 text-center cursor-pointer p-2 hover:bg-red-50">
                Add address
              </p>
            </div>
          )}

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            onChange={e => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span><span>{currency}{getTotalAmount()}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span><span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span><span>{currency}{(getTotalAmount() * 0.02).toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>{currency}{(getTotalAmount() * 1.02).toFixed(2)}</span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 bg-green-500 text-white font-medium hover:bg-green-600 transition"
        >
          {paymentOption === 'COD' ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : null;
};

export default Cart;
