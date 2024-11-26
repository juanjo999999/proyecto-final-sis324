const { Product, Category } = require('../../domain/models/relations');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos.', error });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category' }],
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error al obtener el producto.', error });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, stock, categoryId } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;

  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      image,
      categoryId,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto.', error });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, categoryId } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    await product.update({
      name,
      description,
      price,
      stock,
      image: image || product.image,
      categoryId,
    });

    res.status(200).json(product);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error al actualizar el producto.', error });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    await product.destroy();

    res.status(200).json({ message: 'Producto eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto.', error });
  }
};