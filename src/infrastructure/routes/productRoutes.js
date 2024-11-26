const express = require('express');
const multer = require('multer');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post(
  '/',
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  upload.single('image'),
  productController.createProduct
);
router.put(
  '/:id',
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  upload.single('image'),
  productController.updateProduct
);
router.delete(
  '/:id',
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  productController.deleteProduct
);

module.exports = router;