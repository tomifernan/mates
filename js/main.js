document.addEventListener("DOMContentLoaded", () => {
  // Actualizar año en el footer
  document.querySelectorAll("#current-year").forEach((el) => {
    el.textContent = new Date().getFullYear()
  })

  // Menú móvil
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileNav = document.querySelector(".mobile-nav")

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("active")
    })
  }

  // Cargar productos en la página principal
  const productsContainer = document.getElementById("products-container")
  const searchInput = document.getElementById("search-input")

  // Usar los productos definidos en products.js
  const productos = window.productos || []

  function formatPrice(price) {
    return `$${price.toFixed(2)}`
  }

  if (productsContainer) {
    loadProducts(productos)

    // Búsqueda de productos
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase()
        const filteredProducts = productos.filter(
          (producto) =>
            producto.nombre.toLowerCase().includes(searchTerm) ||
            producto.descripcion.toLowerCase().includes(searchTerm),
        )
        loadProducts(filteredProducts)
      })
    }
  }

  // Función para cargar productos
  function loadProducts(products) {
    if (!productsContainer) return

    productsContainer.innerHTML = ""

    if (products.length === 0) {
      productsContainer.innerHTML = '<p class="no-products">No se encontraron productos</p>'
      return
    }

    const template = document.getElementById("product-card-template")

    products.forEach((producto) => {
      const productCard = template.content.cloneNode(true)

      const img = productCard.querySelector(".product-image img")
      img.src = producto.imagen
      img.alt = producto.nombre

      productCard.querySelector(".product-title").textContent = producto.nombre
      productCard.querySelector(".product-price").textContent = formatPrice(producto.precio)
      productCard.querySelector(".product-description").textContent = producto.descripcion

      const viewDetailsBtn = productCard.querySelector(".view-details")
      viewDetailsBtn.href = `product.html?id=${producto.id}`

      const addToCartBtn = productCard.querySelector(".add-to-cart")
      addToCartBtn.addEventListener("click", (e) => {
        e.preventDefault()
        // Usar la función addToCart del archivo cart.js
        if (typeof window.addToCart === "function") {
          window.addToCart(producto, 1)
          showNotification(`${producto.nombre} agregado al carrito`)
        } else {
          console.error("La función addToCart no está disponible")
        }
      })

      productsContainer.appendChild(productCard)
    })
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

  // Función para desplazamiento suave a las secciones
  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()

        const targetId = this.getAttribute("href").substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          })

          // Si el menú móvil está abierto, cerrarlo
          if (mobileNav && mobileNav.classList.contains("active")) {
            mobileNav.classList.remove("active")
          }
        }
      })
    })
  }

  // Llamar a la función para configurar el desplazamiento suave
  setupSmoothScrolling()
})
