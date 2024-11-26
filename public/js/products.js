// Función para cargar los productos desde el backend
function loadProducts() {
    fetch('/api/products') // Endpoint del backend para obtener los productos
      .then((response) => response.json())
      .then((products) => {
        const productContainer = document.querySelector('.products-container');
  
        // Verificar si hay productos
        if (products.length > 0) {
          productContainer.innerHTML = products
            .map(
              (product) => `
            <div class="product-card">
              <img src="${product.image || 'images/default-product.png'}" alt="${product.name}">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <p class="price">$${product.price}</p>
              <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
                Añadir al carrito
              </button>
            </div>
          `
            )
            .join('');
        } else {
          productContainer.innerHTML = '<p>No hay productos disponibles.</p>';
        }
      })
      .catch((error) => {
        console.error('Error al cargar los productos:', error);
      });
  }
  
  // Función para añadir productos al carrito
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
  
  // Inicializar la página de productos
  document.addEventListener('DOMContentLoaded', () => {
    loadProducts(); // Cargar los productos al iniciar la página
  });
  