
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import stripe from 'stripe'
import User  from '../models/User.js'

export const placeOrderCOD=async (req,res)=>{
    try {
        const {items,address}=req.body
        const userId=req.userId
        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: 'Invalid data' }); //  with return
         }

        // calculate amount using Items 
       let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: `Product not found for ID: ${item.product}` });
      }
      amount += product.offerPrice * item.quantity;
    }


        // add tax charges (2%)
        amount+=Math.floor(amount*0.02)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"COD"
        });

         res.json({success:true,message:'order place sucessfully'})
        
    }catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }
}

//place order through stripe 
export const placeOrderStripe=async (req,res)=>{
    try {
        const {items,address}=req.body
        const {origin}=req.headers;
        const userId=req.userId
        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: 'Invalid data' }); //  with return
         }
        
        let productData=[] ;

        // calculate amount using Items 
       let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      productData.push({
        name:product.name,
        price:product.offerPrice,
        quantity:item.quantity,
      });

      if (!product) {
        return res.json({ success: false, message: `Product not found for ID: ${item.product}` });
      }
      amount += product.offerPrice * item.quantity;
    }


        // add tax charges (2%)
        amount+=Math.floor(amount*0.02)

      const order= await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"Online"
        });

        //stripe gateway initialized 
const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);

// create stripe line items
const line_items=productData.map((item)=>{
    return{
        price_data:{
            currency:'usd',
            product_data:{
                name:item.name,
            },
            unit_amount: Math.floor(item.price+item.price*0.02)*100
            
        },
        quantity:item.quantity,
    }
}) 

// create session 
const session=await stripeInstance.checkout.sessions.create({
    line_items,
    mode:'payment',
    success_url:`${origin}/loader?next=my-orders`,
    cancel_url:`${origin}/cart`,
    metadata:{
        orderId:order._id.toString(),
        userId,
    }
 })

 res.json({success:true,url:session.url})
        
}catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }
}

// STRIPE webhooks to verify payments Action:/stripe 
export const stripeWebhooks=async(request,response)=>{
    //stripe gateway Initialize
    const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);
    const sig=request.headers["stripe-signature"]
    let event;

    try {
        event=stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        response.status(400).send(`webhook Error:${error.message}`)
        
    }


    //handle event 
    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent=event.data.object;
            const paymentIntentId=paymentIntent.id;
            //getting Session metadata
            const session=await stripeInstance.checkout.sessions.list({payment_intent:paymentIntentId});
            const {orderId,userId}=session.data[0].metadata;
            await Order.findByIdAndUpdate(orderId,{isPaid:true})
            await User.findByIdAndUpdate(userId,{cartItems:{}});
            break;
        }
        case "payment_intent.payment_failed":{
             const paymentIntent=event.data.object;
            const paymentIntentId=paymentIntent.id;
            //getting Session metadata
            const session=await stripeInstance.checkout.sessions.list({payment_intent:paymentIntentId});
            const {orderId}=session.data[0].metadata;
            await Order.findByIdAndDelete(orderId)
            break;
        }    

        default:
            console.error(`Unhandle event type ${event.type}`)
            break;
    }
    response.json({received:true})

}


// get orders by userId:/api/order/user

export const getUserOrders=async(req,res)=>{
    try {
        const userId=req.userId
        const orders=await Order.find({userId,
            $or:[{paymentType:'COD'},{isPaid:true}]
        }).populate('items.product address').sort({createdAt:-1})

         res.json({success:true,orders})        
    } catch (error) {

        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }
}


// get all orders (for seller/admin):/api/orders/seller
export const getAllOrders=async(req,res)=>{
    try {
        const orders=await Order.find({
            $or:[{paymentType:'COD'},{isPaid:true}]
        }).populate('items.product address').sort({createdAt:-1});

         res.json({success:true,orders})        
    } catch (error) {

        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }
}