// Cargar productos destacados dinámicamente
function loadFeaturedProducts() {
    fetch('/api/products') // Endpoint para obtener todos los productos
      .then((response) => response.json())
      .then((products) => {
        const productContainer = document.querySelector('.products-container');
  
        // Filtrar productos destacados (por ejemplo: stock mayor a 0)
        const featuredProducts = products.filter((product) => product.stock > 0);
  
        // Renderizar productos destacados
        if (featuredProducts.length > 0) {
          productContainer.innerHTML = featuredProducts
            .map(
              (product) => `
            <div class="product-card">
              <img src="${product.image || 'images/default-product.png'}" alt="${product.name}">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <p class="price">$${product.price}</p>
              <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Añadir al carrito</button>
            </div>
          `
            )
            .join('');
        } else {
          productContainer.innerHTML = '<p>No hay productos destacados disponibles.</p>';
        }
      })
      .catch((error) => {
        console.error('Error al cargar productos destacados:', error);
      });
  }
  
  // Añadir producto al carrito
  function addToCart(id, name, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.find((item) => item.id === id);
  
    if (existingProduct) {
      existingProduct.quantity += 1; // Incrementar la cantidad si ya existe
    } else {
      cart.push({ id, name, price, image, quantity: 1 }); // Agregar nuevo producto
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`"${name}" ha sido añadido al carrito.`);
  }
  
  // Inicializar funciones al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
  });
  