// Funciones mejoradas para manejar el carrito con mejor soporte móvil
let cartDebugMode = false // Para debugging

// Función para detectar si localStorage está disponible
function isLocalStorageAvailable() {
  try {
    const test = "__localStorage_test__"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    console.warn("localStorage no disponible:", e)
    return false
  }
}

// Función mejorada para obtener el carrito
function getCart() {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn("localStorage no disponible, usando carrito temporal")
      return window.tempCart || []
    }

    const cart = localStorage.getItem("cart")
    if (!cart) {
      return []
    }

    const parsedCart = JSON.parse(cart)

    // Validar que el carrito sea un array válido
    if (!Array.isArray(parsedCart)) {
      console.warn("Carrito corrupto detectado, limpiando...")
      localStorage.removeItem("cart")
      return []
    }

    // Validar cada item del carrito
    const validCart = parsedCart.filter((item) => {
      return (
        item &&
        typeof item.id === "string" &&
        typeof item.nombre === "string" &&
        typeof item.precio === "number" &&
        typeof item.cantidad === "number" &&
        item.cantidad > 0
      )
    })

    if (validCart.length !== parsedCart.length) {
      console.warn("Items inválidos removidos del carrito")
      saveCart(validCart)
    }

    if (cartDebugMode) {
      console.log("Carrito cargado:", validCart)
    }

    return validCart
  } catch (error) {
    console.error("Error al obtener carrito:", error)
    // Limpiar carrito corrupto
    try {
      localStorage.removeItem("cart")
    } catch (e) {
      console.error("No se pudo limpiar localStorage:", e)
    }
    return []
  }
}

// Función mejorada para guardar el carrito
function saveCart(cart) {
  try {
    // Validar que cart sea un array
    if (!Array.isArray(cart)) {
      console.error("Intento de guardar carrito inválido:", cart)
      return false
    }

    if (!isLocalStorageAvailable()) {
      console.warn("localStorage no disponible, guardando en memoria temporal")
      window.tempCart = cart
      return true
    }

    const cartString = JSON.stringify(cart)
    localStorage.setItem("cart", cartString)

    if (cartDebugMode) {
      console.log("Carrito guardado:", cart)
    }

    return true
  } catch (error) {
    console.error("Error al guardar carrito:", error)

    // Fallback: guardar en memoria temporal
    try {
      window.tempCart = cart
      showNotification("Carrito guardado temporalmente (problema con almacenamiento)")
    } catch (e) {
      console.error("Error crítico al guardar carrito:", e)
      showNotification("Error al guardar carrito")
    }

    return false
  }
}

// Función mejorada para agregar al carrito
function addToCart(product, quantity) {
  try {
    // Validar parámetros
    if (!product || !product.id || !product.nombre || typeof product.precio !== "number") {
      console.error("Producto inválido:", product)
      showNotification("Error: Producto inválido")
      return false
    }

    if (!quantity || quantity < 1) {
      quantity = 1
    }

    const cart = getCart()
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.cantidad += quantity
    } else {
      cart.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagen || "/placeholder.svg",
        cantidad: quantity,
      })
    }

    const saved = saveCart(cart)
    if (saved) {
      updateCartCount()
      if (cartDebugMode) {
        console.log("Producto agregado:", product.nombre, "Cantidad:", quantity)
      }
      return true
    } else {
      showNotification("Error al agregar producto al carrito")
      return false
    }
  } catch (error) {
    console.error("Error al agregar al carrito:", error)
    showNotification("Error al agregar producto")
    return false
  }
}

function removeFromCart(productId) {
  try {
    const cart = getCart().filter((item) => item.id !== productId)
    saveCart(cart)
    updateCartCount()

    // Si estamos en la página del carrito, actualizar la vista
    if (window.location.pathname.includes("cart.html")) {
      loadCartItems()
    }

    if (cartDebugMode) {
      console.log("Producto removido:", productId)
    }
  } catch (error) {
    console.error("Error al remover del carrito:", error)
    showNotification("Error al remover producto")
  }
}

function updateCartQuantity(productId, quantity) {
  try {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    const cart = getCart()
    const item = cart.find((item) => item.id === productId)

    if (item) {
      item.cantidad = quantity
      saveCart(cart)
      updateCartCount()

      // Si estamos en la página del carrito, actualizar la vista
      if (window.location.pathname.includes("cart.html")) {
        loadCartItems()
      }

      if (cartDebugMode) {
        console.log("Cantidad actualizada:", productId, quantity)
      }
    }
  } catch (error) {
    console.error("Error al actualizar cantidad:", error)
    showNotification("Error al actualizar cantidad")
  }
}

function clearCart() {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem("cart")
    }
    window.tempCart = []

    updateCartCount()

    // Si estamos en la página del carrito, actualizar la vista
    if (window.location.pathname.includes("cart.html")) {
      loadCartItems()
    }

    if (cartDebugMode) {
      console.log("Carrito limpiado")
    }
  } catch (error) {
    console.error("Error al limpiar carrito:", error)
  }
}

function resetCart() {
  showResetConfirmation()
}

function forceResetCart() {
  try {
    // Limpiar localStorage completamente
    if (isLocalStorageAvailable()) {
      localStorage.removeItem("cart")
      // Limpiar cualquier dato corrupto relacionado
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.includes("cart") || key.includes("Cart")) {
          try {
            localStorage.removeItem(key)
          } catch (e) {
            console.warn("No se pudo limpiar:", key)
          }
        }
      })
    }

    // Limpiar memoria temporal
    window.tempCart = []

    // Actualizar contador
    updateCartCount()

    // Si estamos en la página del carrito, actualizar la vista
    if (window.location.pathname.includes("cart.html")) {
      loadCartItems()
    }

    // Mostrar notificación
    showNotification("Carrito restablecido correctamente")

    if (cartDebugMode) {
      console.log("Reset completo del carrito")
    }
  } catch (error) {
    console.error("Error al resetear carrito:", error)
    showNotification("Error al resetear carrito")
  }
}

// Función mejorada para actualizar contador
function updateCartCount() {
  try {
    const cart = getCart()
    const count = cart.reduce((total, item) => {
      return total + (typeof item.cantidad === "number" ? item.cantidad : 0)
    }, 0)

    document.querySelectorAll("#cart-count").forEach((el) => {
      if (el) {
        el.textContent = count
      }
    })

    if (cartDebugMode) {
      console.log("Contador actualizado:", count)
    }
  } catch (error) {
    console.error("Error al actualizar contador:", error)
    // Fallback: mostrar 0
    document.querySelectorAll("#cart-count").forEach((el) => {
      if (el) {
        el.textContent = "0"
      }
    })
  }
}

// Función para formatear el precio
function formatPrice(price) {
  try {
    const numPrice = typeof price === "number" ? price : Number.parseFloat(price) || 0
    return `$${numPrice.toFixed(2)}`
  } catch (error) {
    console.error("Error al formatear precio:", error)
    return "$0.00"
  }
}

// Función para habilitar modo debug
function enableCartDebug() {
  cartDebugMode = true
  console.log("Modo debug del carrito habilitado")
  console.log("Carrito actual:", getCart())
  console.log("localStorage disponible:", isLocalStorageAvailable())

  // Agregar botón de debug visible
  const debugBtn = document.createElement("button")
  debugBtn.textContent = "DEBUG CARRITO"
  debugBtn.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 9999;
    background: #ff9800;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
  `
  debugBtn.onclick = () => {
    console.log("=== DEBUG CARRITO ===")
    console.log("Carrito:", getCart())
    console.log("localStorage disponible:", isLocalStorageAvailable())
    console.log("Carrito temporal:", window.tempCart)
    console.log("URL actual:", window.location.pathname)
    alert(`Carrito: ${getCart().length} items\nlocalStorage: ${isLocalStorageAvailable() ? "OK" : "NO"}`)
  }
  document.body.appendChild(debugBtn)
}

// Hacer las funciones disponibles globalmente
window.addToCart = addToCart
window.removeFromCart = removeFromCart
window.updateCartQuantity = updateCartQuantity
window.clearCart = clearCart
window.resetCart = resetCart
window.getCart = getCart
window.enableCartDebug = enableCartDebug

// Cargar el contador del carrito al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Verificar si estamos en móvil y habilitar debug automáticamente
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      console.log("Dispositivo móvil detectado")
      // Habilitar debug en móvil para diagnosticar problemas
      // enableCartDebug(); // Descomenta esta línea si necesitas debug
    }

    updateCartCount()

    // Si estamos en la página del carrito, cargar los items
    if (window.location.pathname.includes("cart.html")) {
      loadCartItems()
    }

    // Configurar botones de reset del carrito
    setupResetCartButtons()

    console.log("Sistema de carrito inicializado correctamente")
  } catch (error) {
    console.error("Error al inicializar carrito:", error)
  }
})

// Resto de funciones sin cambios...
function setupResetCartButtons() {
  try {
    const resetBtn = document.getElementById("reset-cart-btn")
    if (resetBtn) {
      resetBtn.addEventListener("click", resetCart)
    }

    const mobileResetBtn = document.getElementById("mobile-reset-cart")
    if (mobileResetBtn) {
      mobileResetBtn.addEventListener("click", resetCart)
    }

    const pageResetBtn = document.getElementById("reset-cart-page-btn")
    if (pageResetBtn) {
      pageResetBtn.addEventListener("click", resetCart)
    }
  } catch (error) {
    console.error("Error al configurar botones reset:", error)
  }
}

function showResetConfirmation() {
  try {
    const cart = getCart()

    if (cart.length === 0) {
      showNotification("El carrito ya está vacío")
      return
    }

    const modal = document.createElement("div")
    modal.className = "reset-confirmation"
    modal.innerHTML = `
      <div class="reset-modal">
        <h3>¿Vaciar carrito?</h3>
        <p>Esta acción eliminará todos los productos del carrito. ¿Estás seguro?</p>
        <div class="reset-modal-buttons">
          <button class="btn btn-outline" onclick="closeResetModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="confirmReset()">Sí, vaciar</button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeResetModal()
      }
    })
  } catch (error) {
    console.error("Error al mostrar confirmación:", error)
    // Fallback: reset directo
    forceResetCart()
  }
}

function closeResetModal() {
  try {
    const modal = document.querySelector(".reset-confirmation")
    if (modal) {
      modal.remove()
    }
  } catch (error) {
    console.error("Error al cerrar modal:", error)
  }
}

function confirmReset() {
  forceResetCart()
  closeResetModal()
}

// Hacer funciones disponibles globalmente para el modal
window.closeResetModal = closeResetModal
window.confirmReset = confirmReset

// Función mejorada para cargar items del carrito
function loadCartItems() {
  try {
    const cartItemsContainer = document.getElementById("cart-items")
    const cartEmptyElement = document.getElementById("cart-empty")
    const cartContentElement = document.getElementById("cart-content")
    const cartSubtotalElement = document.getElementById("cart-subtotal")
    const cartTotalElement = document.getElementById("cart-total")

    const cart = getCart()

    if (cart.length === 0) {
      if (cartEmptyElement) cartEmptyElement.style.display = "block"
      if (cartContentElement) cartContentElement.style.display = "none"
      return
    }

    if (cartEmptyElement) cartEmptyElement.style.display = "none"
    if (cartContentElement) cartContentElement.style.display = "grid"

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = ""

      const template = document.getElementById("cart-item-template")
      if (!template) {
        console.error("Template de carrito no encontrado")
        return
      }

      let subtotal = 0

      cart.forEach((item) => {
        try {
          const cartItem = template.content.cloneNode(true)

          const img = cartItem.querySelector(".cart-item-image img")
          if (img) {
            img.src = item.imagen || "/placeholder.svg"
            img.alt = item.nombre || "Producto"
          }

          const titleEl = cartItem.querySelector(".cart-item-title")
          if (titleEl) titleEl.textContent = item.nombre || "Producto sin nombre"

          const priceEl = cartItem.querySelector(".cart-item-price")
          if (priceEl) priceEl.textContent = formatPrice(item.precio)

          const quantityElement = cartItem.querySelector(".quantity")
          if (quantityElement) quantityElement.textContent = item.cantidad || 1

          const decreaseBtn = cartItem.querySelector(".decrease")
          if (decreaseBtn) {
            decreaseBtn.addEventListener("click", () => {
              if (item.cantidad > 1) {
                updateCartQuantity(item.id, item.cantidad - 1)
              }
            })
          }

          const increaseBtn = cartItem.querySelector(".increase")
          if (increaseBtn) {
            increaseBtn.addEventListener("click", () => {
              updateCartQuantity(item.id, item.cantidad + 1)
            })
          }

          const itemTotal = (item.precio || 0) * (item.cantidad || 1)
          const totalEl = cartItem.querySelector(".cart-item-total span")
          if (totalEl) totalEl.textContent = formatPrice(itemTotal)

          const removeBtn = cartItem.querySelector(".cart-item-remove")
          if (removeBtn) {
            removeBtn.addEventListener("click", () => {
              removeFromCart(item.id)
            })
          }

          cartItemsContainer.appendChild(cartItem)
          subtotal += itemTotal
        } catch (itemError) {
          console.error("Error al procesar item del carrito:", itemError, item)
        }
      })

      if (cartSubtotalElement) cartSubtotalElement.textContent = formatPrice(subtotal)
      if (cartTotalElement) cartTotalElement.textContent = formatPrice(subtotal)
    }
  } catch (error) {
    console.error("Error al cargar items del carrito:", error)
    showNotification("Error al cargar carrito")
  }
}

// Función mejorada para mostrar notificación
function showNotification(message) {
  try {
    const existingNotification = document.querySelector(".notification")
    if (existingNotification) {
      existingNotification.remove()
    }

    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message || "Notificación"

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 300)
    }, 3000)
  } catch (error) {
    console.error("Error al mostrar notificación:", error)
    // Fallback: alert
    alert(message)
  }
}
