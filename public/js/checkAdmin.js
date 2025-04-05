async function checkUserRole() {
    try {
        const response = await fetch('/api/sessions/current');
        if (!response.ok) {
            throw new Error('No se pudo obtener la información del usuario');
        }

        const userData = await response.json();
        const isAdmin = userData && userData.user && userData.user.role === 'admin';
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(element => {
            element.style.display = isAdmin ? 'block' : 'none';
        });

        console.log('Estado de administrador:', isAdmin ? 'Es administrador' : 'No es administrador');
        return isAdmin;
    } catch (error) {
        console.error('Error al verificar rol de usuario:', error);
        return false;
    }
}

function editProduct(productId) {
    window.location.href = `/admin/products/edit/${productId}`;
}

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el producto');
                }
                alert('Producto eliminado correctamente');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('No se pudo eliminar el producto');
            });
    }
}

document.addEventListener('DOMContentLoaded', checkUserRole);