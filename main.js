document.addEventListener("DOMContentLoaded", () => {
  try {
    // Actualizar año en el footer
    document.querySelectorAll("#current-year").forEach((el) => {
      el.textContent = new Date().getFullYear()
    })

    // Menú móvil con mejor manejo
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    const mobileNav = document.querySelector(".mobile-nav")

    if (mobileMenuBtn && mobileNav) {
      // Usar tanto click como touchstart para mejor compatibilidad móvil
      const toggleMenu = () => {
        mobileNav.classList.toggle("active")
      }

      mobileMenuBtn.addEventListener("click", toggleMenu)
      mobileMenuBtn.addEventListener("touchstart", toggleMenu, { passive: true })
    }

    // Cargar productos en la página principal
    const productsContainer = document.getElementById("products-container")
    const searchInput = document.getElementById("search-input")

    // Usar los productos definidos en products.js
    const productos = window.productos || []

    function formatPrice(price) {
      try {
        const numPrice = typeof price === "number" ? price : Number.parseFloat(price) || 0
        return `$${numPrice.toFixed(2)}`
      } catch (error) {
        console.error("Error al formatear precio:", error)
        return "$0.00"
      }
    }

    if (productsContainer && productos.length > 0) {
      loadProducts(productos)

      // Búsqueda de productos con mejor manejo de errores
      if (searchInput) {
        const handleSearch = function () {
          try {
            const searchTerm = this.value.toLowerCase()
            const filteredProducts = productos.filter(
              (producto) =>
                producto.nombre.toLowerCase().includes(searchTerm) ||
                producto.descripcion.toLowerCase().includes(searchTerm),
            )
            loadProducts(filteredProducts)
          } catch (error) {
            console.error("Error en búsqueda:", error)
            loadProducts(productos) // Fallback: mostrar todos los productos
          }
        }

        searchInput.addEventListener("input", handleSearch)
        // También escuchar keyup para mejor compatibilidad móvil
        searchInput.addEventListener("keyup", handleSearch)
      }
    }

    // Función mejorada para cargar productos
    function loadProducts(products) {
      try {
        if (!productsContainer) return

        productsContainer.innerHTML = ""

        if (!products || products.length === 0) {
          productsContainer.innerHTML = '<p class="no-products">No se encontraron productos</p>'
          return
        }

        const template = document.getElementById("product-card-template")
        if (!template) {
          console.error("Template de producto no encontrado")
          return
        }

        products.forEach((producto) => {
          try {
            const productCard = template.content.cloneNode(true)

            const img = productCard.querySelector(".product-image img")
            if (img) {
              img.src = producto.imagen || "/placeholder.svg"
              img.alt = producto.nombre || "Producto"
            }

            const titleEl = productCard.querySelector(".product-title")
            if (titleEl) titleEl.textContent = producto.nombre || "Producto sin nombre"

            const priceEl = productCard.querySelector(".product-price")
            if (priceEl) priceEl.textContent = formatPrice(producto.precio)

            const descEl = productCard.querySelector(".product-description")
            if (descEl) descEl.textContent = producto.descripcion || ""

            const viewDetailsBtn = productCard.querySelector(".view-details")
            if (viewDetailsBtn) {
              viewDetailsBtn.href = `product.html?id=${producto.id}`
            }

            const addToCartBtn = productCard.querySelector(".add-to-cart")
            if (addToCartBtn) {
              const handleAddToCart = (e) => {
                try {
                  e.preventDefault()
                  if (typeof window.addToCart === "function") {
                    const success = window.addToCart(producto, 1)
                    if (success) {
                      showNotification(`${producto.nombre} agregado al carrito`)
                    }
                  } else {
                    console.error("La función addToCart no está disponible")
                    showNotification("Error al agregar producto")
                  }
                } catch (error) {
                  console.error("Error al agregar al carrito:", error)
                  showNotification("Error al agregar producto")
                }
              }

              addToCartBtn.addEventListener("click", handleAddToCart)
              // También agregar touchstart para mejor respuesta en móvil
              addToCartBtn.addEventListener("touchstart", handleAddToCart, { passive: false })
            }

            productsContainer.appendChild(productCard)
          } catch (productError) {
            console.error("Error al procesar producto:", productError, producto)
          }
        })
      } catch (error) {
        console.error("Error al cargar productos:", error)
        if (productsContainer) {
          productsContainer.innerHTML = '<p class="no-products">Error al cargar productos</p>'
        }
      }
    }

    // Función para mostrar notificación (duplicada aquí por si acaso)
    function showNotification(message) {
      try {
        const existingNotification = document.querySelector(".notification")
        if (existingNotification) {
          existingNotification.remove()
        }

        const notification = document.createElement("div")
        notification.className = "notification"
        notification.textContent = message

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
        alert(message) // Fallback
      }
    }

    // Función para desplazamiento suave a las secciones
    function setupSmoothScrolling() {
      try {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
          anchor.addEventListener("click", function (e) {
            try {
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
            } catch (scrollError) {
              console.error("Error en scroll suave:", scrollError)
              // Fallback: scroll normal
              const targetId = this.getAttribute("href").substring(1)
              const targetElement = document.getElementById(targetId)
              if (targetElement) {
                targetElement.scrollIntoView()
              }
            }
          })
        })
      } catch (error) {
        console.error("Error al configurar scroll suave:", error)
      }
    }

    // Llamar a la función para configurar el desplazamiento suave
    setupSmoothScrolling()

    console.log("Página inicializada correctamente")
  } catch (error) {
    console.error("Error crítico al inicializar página:", error)
  }
})
