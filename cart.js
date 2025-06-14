// Base de datos de productos - AQUÍ ES DONDE AGREGAS TUS PRODUCTOS
const productos = [
  {
    id: "1",
    nombre: "Mate Imperial Premium",
    descripcion:
      "Mate tradicional de calabaza forrado en cuero con detalles en alpaca. Incluye bombilla de acero inoxidable.",
    precio: 5500,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_963605-MLA31037344004_062019-F.jpg",
  },
  {
    id: "2",
    nombre: "Mate Camionero",
    descripcion: "Mate de calabaza forrado en cuero, ideal para el día a día. Resistente y duradero.",
    precio: 3800,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_963811-MLA31037344005_062019-F.jpg",
  },
  {
    id: "3",
    nombre: "Mate de Cerámica",
    descripcion: "Mate moderno de cerámica con diseños exclusivos. Fácil de limpiar y mantener.",
    precio: 2500,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_745028-MLA31116812014_062019-F.jpg",
  },
  {
    id: "4",
    nombre: "Bombilla Premium",
    descripcion: "Bombilla de alpaca con filtro desmontable. Diseño elegante y funcional.",
    precio: 1800,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_833111-MLA31017127536_062019-F.jpg",
  },
  {
    id: "5",
    nombre: "Set Matero Completo",
    descripcion:
      "Set completo que incluye mate, bombilla, yerbera y termo. Todo lo que necesitas para disfrutar del mate.",
    precio: 8500,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_628111-MLA31017127535_062019-F.jpg",
  },
  {
    id: "6",
    nombre: "Termo Stanley 1L",
    descripcion: "Termo de acero inoxidable que mantiene la temperatura por hasta 24 horas. Ideal para mate.",
    precio: 12000,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_628111-MLA31017127535_062019-F.jpg",
  },
  {
    id: "7",
    nombre: "Yerbera y Azucarera",
    descripcion: "Set de yerbera y azucarera de acero inoxidable con diseño moderno.",
    precio: 3200,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_745028-MLA31116812014_062019-F.jpg",
  },
  {
    id: "8",
    nombre: "Mate de Madera Tallado",
    descripcion: "Mate artesanal tallado en madera de algarrobo. Pieza única con diseños exclusivos.",
    precio: 4200,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_963605-MLA31037344004_062019-F.jpg",
  },
  {
    id: "9",
    nombre: "Mate Argentino Tradicional",
    descripcion:
      "Auténtico mate argentino hecho a mano con calabaza natural y detalles en cuero. Incluye bombilla de acero inoxidable premium.",
    precio: 6800,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_745028-MLA31116812014_062019-F.jpg",
  },
  // AQUÍ PUEDES AGREGAR MÁS PRODUCTOS SIGUIENDO EL MISMO FORMATO:
  // {
  //   id: "10", // ID único (siempre como string)
  //   nombre: "Nombre del Producto",
  //   descripcion: "Descripción detallada del producto",
  //   precio: 0000, // Precio como número
  //   imagen: "URL_de_la_imagen",
  // },
]

// Función para formatear precios
function formatPrice(price) {
  return "$" + price.toFixed(2)
}

// Hacer los productos disponibles globalmente
window.productos = productos
