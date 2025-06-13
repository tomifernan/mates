document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkout-form")

  // Declare getCart, formatPrice, and clearCart functions
  function getCart() {
    // Placeholder for getCart logic
    return JSON.parse(localStorage.getItem("cart")) || []
  }

  function formatPrice(price) {
    // Placeholder for formatPrice logic
    return price.toFixed(2)
  }

  function clearCart() {
    // Placeholder for clearCart logic
    localStorage.removeItem("cart")
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Obtener datos del formulario
      const nombre = document.getElementById("nombre").value
      const direccion = document.getElementById("direccion").value
      const telefono = document.getElementById("telefono").value

      // Validar formulario
      if (!nombre || !direccion || !telefono) {
        alert("Por favor complete todos los campos")
        return
      }

      // Obtener items del carrito
      const cart = getCart()

      if (cart.length === 0) {
        alert("Su carrito está vacío")
        return
      }

      // Crear mensaje para WhatsApp
      let mensaje = `*Nuevo Pedido*%0A%0A`
      mensaje += `*Cliente:* ${nombre}%0A`
      mensaje += `*Dirección:* ${direccion}%0A`
      mensaje += `*Teléfono:* ${telefono}%0A%0A`
      mensaje += `*Productos:*%0A`

      let subtotal = 0

      cart.forEach((item) => {
        const itemTotal = item.precio * item.cantidad
        mensaje += `- ${item.nombre} x${item.cantidad}: ${formatPrice(itemTotal)}%0A`
        subtotal += itemTotal
      })

      mensaje += `%0A*Total:* ${formatPrice(subtotal)}`

      // Número de WhatsApp
      const numeroWhatsApp = "3364039865"

      // Abrir WhatsApp con el mensaje
      window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, "_blank")

      // Limpiar carrito después de enviar
      clearCart()

      // Redirigir a la página principal
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1000)
    })
  }
})
