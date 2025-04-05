async function addToCart(event, productId) {
    event.preventDefault();

    try {
        const resUser = await fetch("/api/sessions/current");
        if (!resUser.ok) {
            throw new Error("No se pudo obtener la información del usuario");
        }

        const userData = await resUser.json();
        if (!userData || !userData.user) {
            throw new Error("No hay sesión de usuario activa");
        }

        const cartId = userData.user.cart;
        if (!cartId) {
            throw new Error("El usuario no tiene un carrito asignado");
        }

        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ quantity: 1 })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al agregar producto al carrito");
        }
        window.location.href = "/carts";
    } catch (error) {
        console.error("Error:", error.message);
        alert(error.message || "Error al agregar producto al carrito");
    }
}
