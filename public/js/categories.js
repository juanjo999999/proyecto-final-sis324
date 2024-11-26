document.addEventListener('DOMContentLoaded', async () => {
  const categoriesContainer = document.querySelector('.categories-container');
  const addCategoryBtn = document.getElementById('add-category-btn');
  const navbarRight = document.querySelector('.navbar-right');
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
  let isAdmin = false; // Variable para determinar si el usuario es administrador

  // Función para cargar categorías
  async function loadCategories() {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('No se pudieron cargar las categorías.');
      const categories = await response.json();

      if (categories.length === 0) {
        categoriesContainer.innerHTML = '<p>No hay categorías disponibles.</p>';
        return;
      }

      // Renderizar las categorías como tarjetas
      categoriesContainer.innerHTML = categories
        .map(
          (category) => `
          <div class="category-card" data-id="${category.id}">
            <h3>${category.name}</h3>
            <p>${category.description || 'Sin descripción'}</p>
            ${
              isAdmin
                ? `
            <div class="admin-actions">
              <button class="edit-category-btn" data-id="${category.id}" data-name="${category.name}" data-description="${category.description}">Editar</button>
              <button class="delete-category-btn" data-id="${category.id}">Eliminar</button>
            </div>`
                : ''
            }
          </div>
        `
        )
        .join('');

      // Asignar eventos de clic a las categorías
      attachCategoryClickEvents();
      if (isAdmin) attachAdminActions(); // Solo asignar acciones de admin si el usuario es admin
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      categoriesContainer.innerHTML = '<p>Error al cargar las categorías.</p>';
    }
  }

  // Función para abrir el modal de añadir categoría
  addCategoryBtn.addEventListener('click', () => {
    const modal = document.getElementById('add-category-modal');
    modal.style.display = 'block';
  });

  // Cerrar el modal de añadir categoría
  const closeModalBtn = document.getElementById('close-modal-btn');
  closeModalBtn.addEventListener('click', () => {
    const modal = document.getElementById('add-category-modal');
    modal.style.display = 'none';
  });

  // Manejar el formulario de añadir categoría
  const addCategoryForm = document.getElementById('add-category-form');
  addCategoryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        alert('Categoría añadida exitosamente.');
        document.getElementById('add-category-modal').style.display = 'none';
        loadCategories();
      } else {
        const data = await response.json();
        alert(data.message || 'Error al añadir la categoría.');
      }
    } catch (error) {
      console.error('Error al añadir categoría:', error);
      alert('Error al añadir la categoría.');
    }
  });

  // Función para asignar clic a las categorías
  function attachCategoryClickEvents() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card) => {
      card.addEventListener('click', (event) => {
        if (!event.target.classList.contains('edit-category-btn') && !event.target.classList.contains('delete-category-btn')) {
          const categoryId = card.dataset.id;
          window.location.href = `products.html?categoryId=${categoryId}`;
        }
      });
    });
  }

  // Función para asignar acciones de administrador
  function attachAdminActions() {
    const editButtons = document.querySelectorAll('.edit-category-btn');
    const deleteButtons = document.querySelectorAll('.delete-category-btn');

    // Manejar edición de categoría
    editButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const categoryId = btn.dataset.id;
        const categoryName = btn.dataset.name;
        const categoryDescription = btn.dataset.description;

        document.getElementById('edit-category-name').value = categoryName;
        document.getElementById('edit-category-description').value = categoryDescription;

        const editModal = document.getElementById('edit-category-modal');
        editModal.style.display = 'block';

        const editCategoryForm = document.getElementById('edit-category-form');
        editCategoryForm.onsubmit = async (event) => {
          event.preventDefault();

          const updatedName = document.getElementById('edit-category-name').value;
          const updatedDescription = document.getElementById('edit-category-description').value;

          try {
            const response = await fetch(`/api/categories/${categoryId}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: updatedName, description: updatedDescription }),
            });

            if (response.ok) {
              alert('Categoría actualizada exitosamente.');
              editModal.style.display = 'none';
              loadCategories();
            } else {
              const data = await response.json();
              alert(data.message || 'Error al actualizar la categoría.');
            }
          } catch (error) {
            console.error('Error al actualizar la categoría:', error);
            alert('Error al actualizar la categoría.');
          }
        };
      });
    });

    // Manejar eliminación de categoría
    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const categoryId = btn.dataset.id;

        if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

        try {
          const response = await fetch(`/api/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            alert('Categoría eliminada exitosamente.');
            loadCategories();
          } else {
            const data = await response.json();
            alert(data.message || 'Error al eliminar la categoría.');
          }
        } catch (error) {
          console.error('Error al eliminar la categoría:', error);
          alert('Error al eliminar la categoría.');
        }
      });
    });
  }

  // Verificar si el usuario está autenticado y si es administrador
  async function verifyUser() {
    if (token) {
      try {
        const response = await fetch('/api/users/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          navbarRight.innerHTML = `
            <span>Bienvenido, ${data.name}</span>
            <a href="#" class="logout-btn">Cerrar sesión</a>
          `;

          if (data.role === 'admin') {
            isAdmin = true;
            addCategoryBtn.style.display = 'inline-block';
          }
        } else {
          console.error('Usuario no autenticado.');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error al verificar el usuario:', error);
      }
    }
  }

  // Manejar cierre de sesión
  navbarRight.addEventListener('click', (event) => {
    if (event.target.classList.contains('logout-btn')) {
      localStorage.removeItem('token');
      window.location.reload();
    }
  });

  // Inicializar la página
  verifyUser().then(loadCategories);
});
