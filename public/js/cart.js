// Obtener carrito desde localStorage
function getCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart;
  }
  
  // Guardar carrito en localStorage
  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  // Mostrar productos en el carrito
  function renderCart() {
    const cart = getCart();
    const cartContainer = document.querySelector('.cart-container');
    const totalItems = document.getElementById('total-items');
    const totalPrice = document.getElementById('total-price');
  
    // Si el carrito está vacío
    if (cart.length === 0) {
      cartContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
      totalItems.textContent = '0';
      totalPrice.textContent = '0.00';
      return;
    }
  
    // Renderizar productos
    cartContainer.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <img src="${item.image || 'images/default-product.png'}" alt="${item.name}">
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>Precio: $${item.price}</p>
            <p>Cantidad: ${item.quantity}</p>
            <button class="remove-btn" data-id="${item.id}">Eliminar</button>
          </div>
        </div>
      `
      )
      .join('');
  
    // Actualizar resumen
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    totalItems.textContent = totalQuantity;
    totalPrice.textContent = totalCost.toFixed(2);
  
    // Añadir eventos a los botones de eliminar
    document.querySelectorAll('.remove-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.getAttribute('data-id'));
      });
    });
  }
  
  // Eliminar producto del carrito
  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== parseInt(productId, 10));
    saveCart(cart);
    renderCart(); // Actualizar la vista del carrito
  }
  
  // Inicializar la página del carrito
  document.addEventListener('DOMContentLoaded', () => {
    renderCart(); // Mostrar productos al cargar la página
  });
  