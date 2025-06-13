document.addEventListener("DOMContentLoaded", () => {
  // Obtener el ID del producto de la URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  // Usamos los productos definidos en products.js
  const productos = window.productos // Declare the productos variable

  if (!productId) {
    window.location.href = "index.html"
    return
  }

  // Buscar el producto en la base de datos
  const producto = productos.find((p) => p.id === productId)

  if (!producto) {
    window.location.href = "index.html"
    return
  }

  // Cargar los detalles del producto
  const productDetailContainer = document.getElementById("product-detail-container")
  const template = document.getElementById("product-detail-template")

  if (productDetailContainer && template) {
    const productDetail = template.content.cloneNode(true)

    const img = productDetail.querySelector(".product-detail-image img")
    img.src = producto.imagen
    img.alt = producto.nombre

    productDetail.querySelector(".product-detail-title").textContent = producto.nombre

    // Declare the formatPrice function
    function formatPrice(price) {
      return `$${price.toFixed(2)}`
    }

    productDetail.querySelector(".product-detail-price").textContent = formatPrice(producto.precio)
    productDetail.querySelector(".product-detail-description").textContent = producto.descripcion

    // Configurar selector de cantidad
    let quantity = 1
    const quantityElement = productDetail.querySelector(".quantity")
    const decreaseBtn = productDetail.querySelector(".decrease")
    const increaseBtn = productDetail.querySelector(".increase")

    decreaseBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--
        quantityElement.textContent = quantity
      }
    })

    increaseBtn.addEventListener("click", () => {
      quantity++
      quantityElement.textContent = quantity
    })

    // Configurar botón de agregar al carrito
    const addToCartBtn = productDetail.querySelector(".add-to-cart-detail")

    // Usamos las funciones definidas en cart.js
    const addToCart = window.addToCart // Declare the addToCart variable

    addToCartBtn.addEventListener("click", () => {
      addToCart(producto, quantity)
      showNotification(`${producto.nombre} agregado al carrito`)
    })

    productDetailContainer.appendChild(productDetail)
  }
})

// Función para mostrar notificación
function showNotification(message) {
  // Eliminar notificación anterior si existe
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Crear nueva notificación
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message

  document.body.appendChild(notification)

  // Mostrar notificación
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Ocultar notificación después de 3 segundos
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}
