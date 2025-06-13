// Funciones para manejar el carrito
function getCart() {
  const cart = localStorage.getItem("cart")
  return cart ? JSON.parse(cart) : []
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart))
}

function addToCart(product, quantity) {
  const cart = getCart()
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.cantidad += quantity
  } else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      cantidad: quantity,
    })
  }

  saveCart(cart)
  updateCartCount()
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId)
  saveCart(cart)
  updateCartCount()

  // Si estamos en la página del carrito, actualizar la vista
  if (window.location.pathname.includes("cart.html")) {
    loadCartItems()
  }
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart()
  const item = cart.find((item) => item.id === productId)

  if (item) {
    item.cantidad = quantity
    saveCart(cart)

    // Si estamos en la página del carrito, actualizar la vista
    if (window.location.pathname.includes("cart.html")) {
      loadCartItems()
    }
  }
}

function clearCart() {
  localStorage.removeItem("cart")
  updateCartCount()

  // Si estamos en la página del carrito, actualizar la vista
  if (window.location.pathname.includes("cart.html")) {
    loadCartItems()
  }
}

function updateCartCount() {
  const cart = getCart()
  const count = cart.reduce((total, item) => total + item.cantidad, 0)

  document.querySelectorAll("#cart-count").forEach((el) => {
    el.textContent = count
  })
}

// Función para formatear el precio
function formatPrice(price) {
  return `$${price.toFixed(2)}`
}

// Hacer las funciones disponibles globalmente
window.addToCart = addToCart
window.removeFromCart = removeFromCart
window.updateCartQuantity = updateCartQuantity
window.clearCart = clearCart
window.getCart = getCart

// Cargar el contador del carrito al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()

  // Si estamos en la página del carrito, cargar los items
  if (window.location.pathname.includes("cart.html")) {
    loadCartItems()
  }
})

// Función para cargar los items del carrito en la página del carrito
function loadCartItems() {
  const cartItemsContainer = document.getElementById("cart-items")
  const cartEmptyElement = document.getElementById("cart-empty")
  const cartContentElement = document.getElementById("cart-content")
  const cartSubtotalElement = document.getElementById("cart-subtotal")
  const cartTotalElement = document.getElementById("cart-total")

  const cart = getCart()

  // Mostrar mensaje de carrito vacío si no hay items
  if (cart.length === 0) {
    if (cartEmptyElement) cartEmptyElement.style.display = "block"
    if (cartContentElement) cartContentElement.style.display = "none"
    return
  }

  // Mostrar contenido del carrito
  if (cartEmptyElement) cartEmptyElement.style.display = "none"
  if (cartContentElement) cartContentElement.style.display = "grid"

  // Limpiar contenedor de items
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = ""

    const template = document.getElementById("cart-item-template")

    // Calcular subtotal
    let subtotal = 0

    // Agregar cada item al carrito
    cart.forEach((item) => {
      const cartItem = template.content.cloneNode(true)

      const img = cartItem.querySelector(".cart-item-image img")
      img.src = item.imagen
      img.alt = item.nombre

      cartItem.querySelector(".cart-item-title").textContent = item.nombre
      cartItem.querySelector(".cart-item-price").textContent = formatPrice(item.precio)

      const quantityElement = cartItem.querySelector(".quantity")
      quantityElement.textContent = item.cantidad

      const decreaseBtn = cartItem.querySelector(".decrease")
      decreaseBtn.addEventListener("click", () => {
        if (item.cantidad > 1) {
          updateCartQuantity(item.id, item.cantidad - 1)
        }
      })

      const increaseBtn = cartItem.querySelector(".increase")
      increaseBtn.addEventListener("click", () => {
        updateCartQuantity(item.id, item.cantidad + 1)
      })

      const itemTotal = item.precio * item.cantidad
      cartItem.querySelector(".cart-item-total span").textContent = formatPrice(itemTotal)

      const removeBtn = cartItem.querySelector(".cart-item-remove")
      removeBtn.addEventListener("click", () => {
        removeFromCart(item.id)
      })

      cartItemsContainer.appendChild(cartItem)

      // Sumar al subtotal
      subtotal += itemTotal
    })

    // Actualizar subtotal y total
    if (cartSubtotalElement) cartSubtotalElement.textContent = formatPrice(subtotal)
    if (cartTotalElement) cartTotalElement.textContent = formatPrice(subtotal)
  }
}

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
