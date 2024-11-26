document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
  
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert('Inicio de sesión exitoso.');
          // Guardar el token en localStorage o manejar la redirección
          localStorage.setItem('token', data.token);
          window.location.href = 'index.html';
        } else {
          alert(data.message || 'Correo o contraseña incorrectos.');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Ocurrió un error al iniciar sesión. Inténtalo de nuevo más tarde.');
      }
    });
  });
  