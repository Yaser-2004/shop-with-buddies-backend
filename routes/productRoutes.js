import express from 'express';
import { getAllProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);  // GET /api/products

export default router;
