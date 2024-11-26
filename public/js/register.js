document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
  
    // Manejar el envío del formulario
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      // Obtener los valores del formulario
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        // Enviar los datos al backend
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Registro exitoso
          alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
          window.location.href = 'login.html';
        } else {
          // Mostrar mensaje de error
          alert(data.message || 'Ocurrió un error durante el registro.');
        }
      } catch (error) {
        console.error('Error al registrar:', error);
        alert('No se pudo completar el registro. Inténtalo nuevamente.');
      }
    });
  });
  