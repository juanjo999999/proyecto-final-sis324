// Función para verificar si el usuario ha iniciado sesión
function checkSession() {
    const user = JSON.parse(localStorage.getItem('user')); // Obtener el estado del usuario desde localStorage
    const navbarRight = document.getElementById('navbar-right');
  
    if (user) {
      // Si hay un usuario autenticado
      navbarRight.innerHTML = `
        <div class="user-options">
          <a href="cart.html">
            <img src="images/cart-icon.svg" alt="Carrito" class="cart-icon">
          </a>
          <button class="logout-btn" onclick="logout()">Cerrar sesión</button>
        </div>
      `;
    } else {
      // Si no hay usuario autenticado
      navbarRight.innerHTML = `
        <a href="login.html" class="login-btn">Iniciar sesión</a>
        <a href="register.html" class="register-btn">Regístrate</a>
      `;
    }
  }
  
  // Función para cerrar sesión
  function logout() {
    localStorage.removeItem('user'); // Eliminar la sesión del usuario
    alert('Has cerrado sesión.');
    location.reload(); // Recargar la página para actualizar el estado del navbar
  }
  
  // Inicializar el estado del navbar al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    checkSession();
  });
  