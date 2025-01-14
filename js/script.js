let globalTranslations;

async function loadTranslations() {
    const response = await fetch('translations.json');
    if (!response.ok) {
        throw new Error('Error al cargar las traducciones');
    }
    globalTranslations = await response.json();
    return globalTranslations;
}

function updateTranslations(selectedLanguage) {
    for (const key in globalTranslations[selectedLanguage]) {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            element.textContent = globalTranslations[selectedLanguage][key];
        });
    }
    updateDateTime();
}

loadTranslations().then(() => {
    updateDateTime();
    setInterval(updateDateTime, 60000);

    document.getElementById('language-select').addEventListener('change', function() {
        const selectedLanguage = this.value;
        localStorage.setItem('language', selectedLanguage);
        updateTranslations(selectedLanguage);
    });

    // Aplicar traducciones iniciales
    const initialLanguage = localStorage.getItem('language') || 'es';
    updateTranslations(initialLanguage);
}).catch(error => {
    console.error(error);
});

 //script date
function updateDateTime() {
    const dateTimeDisplay = document.getElementById("dateTimeDisplay");
    const now = new Date();

    const currentLanguage = localStorage.getItem('language') || 'es';
    const { daysOfWeek, monthsOfYear } = globalTranslations[currentLanguage];

    const day = daysOfWeek[now.getDay()];
    const date = now.getDate(); 
    const month = monthsOfYear[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    dateTimeDisplay.textContent = `${day}, ${hours}:${minutes} - ${date} ${month} ${year}`;
}

//Página de productos
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos todos los enlaces de productos
    const productos = document.querySelectorAll('.producto a');

    productos.forEach(producto => {
        producto.addEventListener('click', function(event) {
            // Prevenir la acción por defecto del enlace
            event.preventDefault();

            // Obtener la información del producto del atributo 'data-*'
            const imagen = producto.getAttribute('data-imagen');
            const nombre = producto.getAttribute('data-nombre');
            const precio = producto.getAttribute('data-precio');

            // Almacenar los datos en el localStorage
            localStorage.setItem('producto_imagen', imagen);
            localStorage.setItem('producto_nombre', nombre);
            localStorage.setItem('producto_precio', precio);

            // Redirigir a la página de producto
            window.location.href = 'producto.html';
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Recuperar los datos del localStorage
    const imagen = localStorage.getItem('producto_imagen');
    const nombre = localStorage.getItem('producto_nombre');
    const precio = localStorage.getItem('producto_precio');

    // Verificar si los datos existen y actualizarlos en la página
    if (imagen && nombre && precio) {
        // Actualizar el contenido de la página con los datos recuperados
        document.getElementById('producto_imagen').src = imagen;
        document.getElementById('producto_nombre').textContent = nombre;
        document.getElementById('producto_descripcion').textContent = `Este es el producto ${nombre}. Precio: ${precio}`;
    }
});

// SCRIPT LOGIN //
const loginButton = document.getElementById('loginButton');
const loginPopup = document.getElementById('loginPopup');
const closePopup = document.getElementById('loginClose');
let contrasena =document.getElementById("password");
const cartButton = document.getElementById('cartButton');
const cartPopup = document.getElementById('cartPopup');
const cartClose = document.getElementById('cartClose');

loginButton.addEventListener('click', () => {
    loginPopup.style.display = 'block';
  });

  closePopup.addEventListener('click', () => {
    loginPopup.style.display = 'none';
  });

  ojito.addEventListener('click', function() {

    if (contrasena.type === "password") {
        contrasena.type = "text";
        imagen.src ="../fonts/Imagenes/ojoAbierto1.jpg" ;

    } 
    else {
        contrasena.type = "password";
        imagen.src="../fonts/Imagenes/ojoCerrado1.jpg" ;
    }
})

// POPUP CARRITO//
cartButton.addEventListener('click', () => {
    cartPopup.style.display = 'block';
});


cartClose.addEventListener('click', () => {
    cartPopup.style.display = 'none';
});

