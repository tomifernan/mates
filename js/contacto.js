document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Obtener datos del formulario
      const nombre = document.getElementById("nombre").value
      const email = document.getElementById("email").value
      const telefono = document.getElementById("telefono").value
      const asunto = document.getElementById("asunto").value
      const mensaje = document.getElementById("mensaje").value

      // Validar formulario
      if (!nombre || !email || !asunto || !mensaje) {
        alert("Por favor complete todos los campos obligatorios")
        return
      }

      // Crear mensaje para WhatsApp
      let mensajeWhatsApp = `*Nuevo Mensaje de Contacto*%0A%0A`
      mensajeWhatsApp += `*Nombre:* ${nombre}%0A`
      mensajeWhatsApp += `*Email:* ${email}%0A`
      if (telefono) {
        mensajeWhatsApp += `*Teléfono:* ${telefono}%0A`
      }
      mensajeWhatsApp += `*Asunto:* ${asunto}%0A%0A`
      mensajeWhatsApp += `*Mensaje:*%0A${mensaje}`

      // Número de WhatsApp
      const numeroWhatsApp = "3364039865"

      // Abrir WhatsApp con el mensaje
      window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`, "_blank")

      // Mostrar mensaje de confirmación
      showNotification("Mensaje enviado correctamente. Te contactaremos pronto.")

      // Limpiar formulario
      contactForm.reset()
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

    // Ocultar notificación después de 4 segundos
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 4000)
  }
})
