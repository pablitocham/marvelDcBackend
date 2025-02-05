async function addToCart(event, productId) {
    event.preventDefault();

    try {
        let response = await fetch("/api/carts")
        let carts = await response.json()
        let cartId
        if (carts.length === 0) {
            response = await fetch("/api/carts", {
                method: "POST",
            })
            const newCart = await response.json()
            cartId = newCart._id
        } else {
            cartId = carts[0]._id
        }
        await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ quantity: 1 })
        })
        window.location.href = "/carts"
    } catch (error) {
        console.error(error)
        alert("Error al agregar producto al carrito")
    }
}
