// Función para obtener productos desde la API
async function obtenerProducto(categoria, idioma) {
  try {
    const respuesta = await fetch("https://dummyjson.com/products?limit=0");
    const datos = await respuesta.json();

    // Filtrar productos según la categoría proporcionada
    const productos = datos.products.filter((producto) =>
      producto.category.toLowerCase().includes(categoria.toLowerCase())
    );

    // Si hay productos relacionados, selecciona uno al azar
    const productoSeleccionado =
      productos[Math.floor(Math.random() * productos.length)];
    mostrarPublicidad(productoSeleccionado, idioma);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
  }
}

// Función para mostrar el producto en la página
function mostrarPublicidad(producto, idioma) {
  // Diccionario de traducciones
  const traducciones = {
    es: {
      recomendado: "Producto Recomendado",
      precio: "Precio:",
      verMas: "Ver más",
    },
    en: {
      recomendado: "Recommended Product",
      precio: "Price:",
      verMas: "View More",
    },
  };

  // Selecciona las traducciones según el idioma
  const texto = traducciones[idioma] || traducciones["es"]; // Por defecto español

  // Crea el contenedor de la publicidad
  const publicidad = document.createElement("div");
  publicidad.className = "publicidad";
  publicidad.innerHTML = `
      <h3>${texto.recomendado}</h3>
      <img src="${producto.thumbnail}" alt="${producto.title}" width="200" />
      <h4>${producto.title}</h4>
      <p>${producto.description}</p>
      <p><strong>${texto.precio}</strong> $${producto.price}</p>
      <a href="#" target="_blank">${texto.verMas}</a>
    `;

  // Aplicar estilos básicos
  publicidad.style.border = "2px solid #00796b";
  publicidad.style.padding = "10px";
  publicidad.style.margin = "20px auto";
  publicidad.style.maxWidth = "80%";
  publicidad.style.textAlign = "center";
  publicidad.style.borderRadius = "10px";
  publicidad.style.backgroundColor = "#b2ebf2";

  //checar si ya existe una publicidad
  const publicidadExistente = document.querySelector(".publicidad");
  if (publicidadExistente) {
    publicidadExistente.remove();
  }

  // Añadir la publicidad antes del pie de página
  const footer = document.querySelector("footer");
  document.body.insertBefore(publicidad, footer);
}

// Definir categorías según la página
let categoria = "";
if (window.location.pathname.includes("index.html")) {
  categoria = "sport"; // Productos generales
} else if (window.location.pathname.includes("destinos.html")) {
  categoria = "tablets"; // Productos de viaje
} else if (window.location.pathname.includes("consejos.html")) {
  categoria = "sunglasses"; // Accesorios y equipo
} else if (window.location.pathname.includes("contacto.html")) {
  categoria = "mobile"; // Productos promocionales
}

// Ejecutar la función para obtener el producto
obtenerProducto(categoria, "es");

//--------------------------------------------
//idioma

// Función para cargar el idioma seleccionado
async function cargarIdioma(idioma) {
  try {
    const respuesta = await fetch(`./${idioma}.json`);
    const traducciones = await respuesta.json();

    // Recorrer elementos y actualizar texto
    for (const clave in traducciones) {
      const elemento = document.querySelector(`[data-i18n="${clave}"]`);
      if (elemento) {
        elemento.textContent = traducciones[clave];
      }
    }

    // Guardar idioma en localStorage
    localStorage.setItem("idioma", idioma);
  } catch (error) {
    console.error("Error al cargar el idioma:", error);
  }
}

// Inicializar idioma al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const idiomaGuardado = localStorage.getItem("idioma") || "es";
  cargarIdioma(idiomaGuardado);

  const selector = document.getElementById("selector-idioma");
  if (selector) {
    selector.value = idiomaGuardado;
    selector.addEventListener("change", (evento) => {
      cargarIdioma(evento.target.value);
      obtenerProducto(categoria, evento.target.value);
    });
  }
});
