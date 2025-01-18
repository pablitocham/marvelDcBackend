const socket = io();

socket.on("new-funko", function (product) {

    const productElement = document.createElement("li");
    productElement.textContent = `Título: ${product.title}, Descripción: ${product.description}, Código: ${product.code}, Precio: $${product.price}, Stock: ${product.stock}, Categoría: ${product.category}`;
    const productList = document.getElementById("funkos");
    productList.appendChild(productElement);
});

const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(productForm);
    const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        category: formData.get("category")
    };

    const response = await fetch("/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const product = await response.json();
        console.log("Producto creado:", product);
    } else {
        console.error("Error al agregar el producto");
    }
});