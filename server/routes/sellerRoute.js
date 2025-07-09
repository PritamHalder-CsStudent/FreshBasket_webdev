
import express from 'express'
import { isSellerAuth, sellerLogin, SellerLogout } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter=express.Router();

sellerRouter.post('/login',sellerLogin);
sellerRouter.get('/is-auth',authSeller,isSellerAuth);
sellerRouter.get('/logout',SellerLogout);


export default sellerRouter

