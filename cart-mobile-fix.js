// Sistema de carrito completamente reescrito para móviles
console.log("🔧 Iniciando sistema de carrito móvil mejorado...")

// Variables globales para el carrito
let MOBILE_CART = []
let CART_INITIALIZED = false

// Función para detectar móvil
function isMobileDevice() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768
  )
}

// Función para log de debug móvil
function mobileLog(message, data = null) {
  console.log(`📱 MOBILE CART: ${message}`, data || "")

  // Mostrar en pantalla para debug
  if (isMobileDevice()) {
    const debugDiv = document.getElementById("mobile-debug") || createDebugDiv()
    debugDiv.innerHTML += `<div>${new Date().toLocaleTimeString()}: ${message}</div>`
    debugDiv.scrollTop = debugDiv.scrollHeight
  }
}

// Crear div de debug visible en móvil
function createDebugDiv() {
  const debugDiv = document.createElement("div")
  debugDiv.id = "mobile-debug"
  debugDiv.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: rgba(0,0,0,0.8);
    color: white;
    font-size: 10px;
    padding: 5px;
    overflow-y: auto;
    z-index: 9999;
    display: none;
  `
  document.body.appendChild(debugDiv)

  // Botón para mostrar/ocultar debug
  const debugBtn = document.createElement("button")
  debugBtn.textContent = "🐛"
  debugBtn.style.cssText = `
    position: fixed;
    bottom: 110px;
    right: 10px;
    width: 40px;
    height: 40px;
    background: #ff5722;
    color: white;
    border: none;
    border-radius: 50%;
    z-index: 10000;
    font-size: 16px;
  `
  debugBtn.onclick = () => {
    debugDiv.style.display = debugDiv.style.display === "none" ? "block" : "none"
  }
  document.body.appendChild(debugBtn)

  return debugDiv
}

// Inicializar carrito móvil
function initMobileCart() {
  try {
    mobileLog("Inicializando carrito móvil...")

    // Intentar cargar desde localStorage
    try {
      const saved = localStorage.getItem("mobile_cart")
      if (saved) {
        MOBILE_CART = JSON.parse(saved)
        mobileLog(`Carrito cargado desde localStorage: ${MOBILE_CART.length} items`)
      }
    } catch (e) {
      mobileLog("Error con localStorage, usando memoria:", e.message)
      MOBILE_CART = []
    }

    CART_INITIALIZED = true
    updateMobileCartCount()
    mobileLog("Carrito inicializado correctamente")
  } catch (error) {
    mobileLog("Error crítico al inicializar:", error.message)
    MOBILE_CART = []
    CART_INITIALIZED = true
  }
}

// Guardar carrito móvil
function saveMobileCart() {
  try {
    // Intentar localStorage primero
    try {
      localStorage.setItem("mobile_cart", JSON.stringify(MOBILE_CART))
      mobileLog(`Carrito guardado en localStorage: ${MOBILE_CART.length} items`)
      return true
    } catch (e) {
      mobileLog("No se pudo guardar en localStorage:", e.message)
      // El carrito ya está en memoria (MOBILE_CART)
      return true
    }
  } catch (error) {
    mobileLog("Error al guardar carrito:", error.message)
    return false
  }
}

// Obtener carrito móvil
function getMobileCart() {
  if (!CART_INITIALIZED) {
    initMobileCart()
  }
  return [...MOBILE_CART] // Retornar copia
}

// Agregar producto al carrito móvil
function addToMobileCart(product, quantity = 1) {
  try {
    mobileLog(`Agregando producto: ${product.nombre}`)

    if (!CART_INITIALIZED) {
      initMobileCart()
    }

    // Validar producto
    if (!product || !product.id || !product.nombre) {
      mobileLog("Producto inválido:", product)
      showMobileNotification("Error: Producto inválido")
      return false
    }

    // Buscar si ya existe
    const existingIndex = MOBILE_CART.findIndex((item) => item.id === product.id)

    if (existingIndex >= 0) {
      MOBILE_CART[existingIndex].cantidad += quantity
      mobileLog(`Cantidad actualizada: ${MOBILE_CART[existingIndex].cantidad}`)
    } else {
      const newItem = {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio || 0,
        imagen: product.imagen || "/placeholder.svg",
        cantidad: quantity,
      }
      MOBILE_CART.push(newItem)
      mobileLog(`Nuevo producto agregado. Total items: ${MOBILE_CART.length}`)
    }

    saveMobileCart()
    updateMobileCartCount()
    showMobileNotification(`${product.nombre} agregado al carrito`)

    return true
  } catch (error) {
    mobileLog("Error al agregar producto:", error.message)
    showMobileNotification("Error al agregar producto")
    return false
  }
}

// Actualizar contador del carrito
function updateMobileCartCount() {
  try {
    const totalItems = MOBILE_CART.reduce((total, item) => total + (item.cantidad || 0), 0)

    document.querySelectorAll("#cart-count").forEach((el) => {
      if (el) {
        el.textContent = totalItems
        mobileLog(`Contador actualizado: ${totalItems}`)
      }
    })

    // Actualizar título de la página si estamos en el carrito
    if (window.location.pathname.includes("cart.html")) {
      document.title = `Carrito (${totalItems}) - Tienda de Mates`
    }
  } catch (error) {
    mobileLog("Error al actualizar contador:", error.message)
  }
}

// Remover producto del carrito
function removeFromMobileCart(productId) {
  try {
    mobileLog(`Removiendo producto: ${productId}`)

    const initialLength = MOBILE_CART.length
    MOBILE_CART = MOBILE_CART.filter((item) => item.id !== productId)

    if (MOBILE_CART.length < initialLength) {
      mobileLog(`Producto removido. Items restantes: ${MOBILE_CART.length}`)
      saveMobileCart()
      updateMobileCartCount()

      // Actualizar vista si estamos en la página del carrito
      if (window.location.pathname.includes("cart.html")) {
        loadMobileCartItems()
      }
    }
  } catch (error) {
    mobileLog("Error al remover producto:", error.message)
  }
}

// Actualizar cantidad de producto
function updateMobileCartQuantity(productId, newQuantity) {
  try {
    mobileLog(`Actualizando cantidad: ${productId} -> ${newQuantity}`)

    if (newQuantity <= 0) {
      removeFromMobileCart(productId)
      return
    }

    const item = MOBILE_CART.find((item) => item.id === productId)
    if (item) {
      item.cantidad = newQuantity
      saveMobileCart()
      updateMobileCartCount()

      // Actualizar vista si estamos en la página del carrito
      if (window.location.pathname.includes("cart.html")) {
        loadMobileCartItems()
      }
    }
  } catch (error) {
    mobileLog("Error al actualizar cantidad:", error.message)
  }
}

// Limpiar carrito móvil
function clearMobileCart() {
  try {
    mobileLog("Limpiando carrito completo")

    MOBILE_CART = []

    // Limpiar localStorage
    try {
      localStorage.removeItem("mobile_cart")
      localStorage.removeItem("cart") // También el anterior por si acaso
    } catch (e) {
      mobileLog("No se pudo limpiar localStorage:", e.message)
    }

    updateMobileCartCount()

    // Actualizar vista si estamos en la página del carrito
    if (window.location.pathname.includes("cart.html")) {
      loadMobileCartItems()
    }

    showMobileNotification("Carrito limpiado")
  } catch (error) {
    mobileLog("Error al limpiar carrito:", error.message)
  }
}

// Cargar items del carrito en la página
function loadMobileCartItems() {
  try {
    mobileLog("Cargando items del carrito en la página")

    const cartItemsContainer = document.getElementById("cart-items")
    const cartEmptyElement = document.getElementById("cart-empty")
    const cartContentElement = document.getElementById("cart-content")
    const cartSubtotalElement = document.getElementById("cart-subtotal")
    const cartTotalElement = document.getElementById("cart-total")

    const cart = getMobileCart()
    mobileLog(`Items a mostrar: ${cart.length}`)

    if (cart.length === 0) {
      if (cartEmptyElement) cartEmptyElement.style.display = "block"
      if (cartContentElement) cartContentElement.style.display = "none"
      mobileLog("Mostrando carrito vacío")
      return
    }

    if (cartEmptyElement) cartEmptyElement.style.display = "none"
    if (cartContentElement) cartContentElement.style.display = "grid"

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = ""

      let subtotal = 0

      cart.forEach((item, index) => {
        try {
          mobileLog(`Procesando item ${index + 1}: ${item.nombre}`)

          // Crear elemento del carrito manualmente (sin template)
          const cartItemDiv = document.createElement("div")
          cartItemDiv.className = "cart-item"
          cartItemDiv.innerHTML = `
            <div class="cart-item-image">
              <img src="${item.imagen || "/placeholder.svg"}" alt="${item.nombre}">
            </div>
            <div class="cart-item-info">
              <h3 class="cart-item-title">${item.nombre}</h3>
              <p class="cart-item-price">$${(item.precio || 0).toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
              <button class="quantity-btn decrease" data-id="${item.id}">-</button>
              <span class="quantity">${item.cantidad}</span>
              <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">
              <span>$${((item.precio || 0) * (item.cantidad || 1)).toFixed(2)}</span>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          `

          cartItemsContainer.appendChild(cartItemDiv)

          // Agregar event listeners
          const decreaseBtn = cartItemDiv.querySelector(".decrease")
          const increaseBtn = cartItemDiv.querySelector(".increase")
          const removeBtn = cartItemDiv.querySelector(".cart-item-remove")

          if (decreaseBtn) {
            decreaseBtn.addEventListener("click", () => {
              if (item.cantidad > 1) {
                updateMobileCartQuantity(item.id, item.cantidad - 1)
              }
            })
          }

          if (increaseBtn) {
            increaseBtn.addEventListener("click", () => {
              updateMobileCartQuantity(item.id, item.cantidad + 1)
            })
          }

          if (removeBtn) {
            removeBtn.addEventListener("click", () => {
              removeFromMobileCart(item.id)
            })
          }

          subtotal += (item.precio || 0) * (item.cantidad || 1)
        } catch (itemError) {
          mobileLog(`Error procesando item ${index}:`, itemError.message)
        }
      })

      // Actualizar totales
      if (cartSubtotalElement) cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`
      if (cartTotalElement) cartTotalElement.textContent = `$${subtotal.toFixed(2)}`

      mobileLog(`Carrito cargado. Subtotal: $${subtotal.toFixed(2)}`)
    }
  } catch (error) {
    mobileLog("Error al cargar items del carrito:", error.message)
  }
}

// Mostrar notificación móvil
function showMobileNotification(message) {
  try {
    // Remover notificación anterior
    const existing = document.querySelector(".mobile-notification")
    if (existing) existing.remove()

    // Crear nueva notificación
    const notification = document.createElement("div")
    notification.className = "mobile-notification"
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #2e7d32;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      z-index: 9999;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `

    document.body.appendChild(notification)

    // Remover después de 3 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 3000)
  } catch (error) {
    mobileLog("Error al mostrar notificación:", error.message)
    alert(message) // Fallback
  }
}

// Reemplazar funciones globales con las versiones móviles
window.addToCart = addToMobileCart
window.removeFromCart = removeFromMobileCart
window.updateCartQuantity = updateMobileCartQuantity
window.clearCart = clearMobileCart
window.getCart = getMobileCart

// Función de reset mejorada
window.resetCart = () => {
  if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
    clearMobileCart()
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  mobileLog("DOM cargado, inicializando sistema móvil...")

  // Inicializar carrito
  initMobileCart()

  // Si estamos en la página del carrito, cargar items
  if (window.location.pathname.includes("cart.html")) {
    mobileLog("Estamos en página del carrito, cargando items...")
    setTimeout(() => {
      loadMobileCartItems()
    }, 100)
  }

  // Configurar botones de reset
  document.querySelectorAll("#reset-cart-btn, #mobile-reset-cart, #reset-cart-page-btn").forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        if (confirm("¿Vaciar carrito completamente?")) {
          clearMobileCart()
        }
      })
    }
  })

  mobileLog("Sistema móvil inicializado completamente")
})

// Log inicial
mobileLog("Script de carrito móvil cargado")
