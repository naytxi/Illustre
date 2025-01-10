// Cargar traducciones desde un archivo JSON
async function loadTranslations() {
    const response = await fetch('translations.json');
    
    if (!response.ok) {
        throw new Error('Error al cargar las traducciones');
    }

    return await response.json();
}

loadTranslations().then(translations => {
    document.getElementById('language-select').addEventListener('change', function() {
        const selectedLanguage = this.value;

        // Actualizar el contenido basado en la selección
        for (const key in translations[selectedLanguage]) {
            const elements = document.querySelectorAll(`[data-translate="${key}"]`);
            elements.forEach(element => {
                element.textContent = translations[selectedLanguage][key];
            });
        }
    });
}).catch(error => {
    console.error(error);
});

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