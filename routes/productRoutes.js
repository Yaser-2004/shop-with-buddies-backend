import express from 'express';
import { getAllProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);  // GET /api/products
router.get('/:id', getProductById);

export default router;
