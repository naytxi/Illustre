let globalTranslations;

async function loadTranslations() {
    const response = await fetch('translations.json');
    if (!response.ok) {
        throw new Error('Error al cargar las traducciones');
    }
    globalTranslations = await response.json();
    return globalTranslations;
}

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
const cartButton = document.getElementById('cartButton');
const cartPopup = document.getElementById('cartPopup');
const cartClose = document.getElementById('cartClose');
let ojito = document.getElementById('ojito');
const password = document.getElementById('password');

loginButton.addEventListener('click', () => {
    loginPopup.style.display = 'block';
  });

  closePopup.addEventListener('click', () => {
    loginPopup.style.display = 'none';
  });

ojito.addEventListener('click', function() {

    if (password.type === "password") {
        password.type = "text";
        imagen.src = "../fonts/Imagenes/ojoAbierto1.jpg";

    } 
    else {
        password.type = "password";
        imagen.src = "../fonts/Imagenes/ojoCerrado1.jpg";
    }
})

 //POPUP CARRITO
 const counter1Display = document.getElementById("counter1");
 let counter1Value = 0;

cartButton.addEventListener('click', () => {
    cartPopup.style.display = 'block';
});


cartClose.addEventListener('click', () => {
    cartPopup.style.display = 'none';
});

document.getElementById("increment1").addEventListener("click", () => {
    counter1Value++;
    counter1Display.textContent = counter1Value;
  });
  
  document.getElementById("decrement1").addEventListener("click", () => {
    if (counter1Value > 0) {
      counter1Value--;
      counter1Display.textContent = counter1Value;
    }
  });


  //script para la barra de NAVEGACION
  document.addEventListener("DOMContentLoaded", () => {
    const navegacion = document.querySelector(".navegacion");
    const header = document.querySelector("header"); 


    window.addEventListener("scroll", () => {
        if (window.scrollY >= header.offsetHeight) {
            // Si se ha desplazado más allá del header, fija la navegación
            navegacion.classList.add("fija");
        } else {
            // Si está antes del header, posición inicial
            navegacion.classList.remove("fija");
        }
    });
});

//script para los FILTROS

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".filters-tittle");
    const filtersContainer = document.querySelector(".filter_container");
  
    toggleButton.addEventListener("click", () => {
      filtersContainer.classList.toggle("hidden");
      toggleButton.textContent = filtersContainer.classList.contains("hidden")
        ? "Filtros"
        : "Filtros";
    });
  });

document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll(".filter-option");
    const products = document.querySelectorAll(".producto");
  
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", filterProducts);
    });
  
    function filterProducts() {
      const selectedCategories = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);
  
      products.forEach((product) => {
        const category = product.getAttribute("data-category");
        if (selectedCategories.length === 0 || selectedCategories.includes(category)) {
          product.style.display = "block"; // Mostrar producto
        } else {
          product.style.display = "none"; // Ocultar producto
        }
      });
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const priceRange = document.getElementById("price-range");
    const priceValue = document.getElementById("price-value");
    const products = document.querySelectorAll(".producto");
  
    // Actualiza el texto del precio al mover la barra
    priceRange.addEventListener("input", function () {
      const selectedPrice = priceRange.value;
      priceValue.textContent = `${selectedPrice}€`;
  
      // Filtra los productos
      products.forEach((product) => {
        const productPrice = product.getAttribute("data-price");
        if (productPrice === selectedPrice) {
          product.style.display = "block"; // Muestra el producto
        } else {
          product.style.display = "none"; // Oculta el producto
        }
      });
    });
  });


  //historial de pedidos

 document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.toggle-details');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const orderDetails = button.closest('.order').querySelector('.order-details');
        orderDetails.classList.toggle('show'); // Alterna la clase 'show'

        // Cambia el texto del botón
        if (orderDetails.classList.contains('show')) {
          button.textContent = 'Ocultar detalles';
        } else {
          button.textContent = 'Ver detalles';
        }
      });
    });
  });


  //pagina ususario

 // Clave de almacenamiento en localStorage
const USER_DATA_KEY = "userData";

// Función para crear el objeto del usuario
function createUser(name, email, phone, password, photo = "") {
  const userData = {
    name: name || "",
    email: email || "",
    phone: phone || "",
    password: password || "",
    photo: photo || "",
  };
  saveToLocalStorage(USER_DATA_KEY, userData);
  return userData;
}

// Función para obtener los datos del usuario
function getUser() {
  return loadFromLocalStorage(USER_DATA_KEY) || {};
}

// Función para actualizar los datos del usuario
function updateUser(updates) {
  const userData = getUser();
  const updatedData = { ...userData, ...updates };
  saveToLocalStorage(USER_DATA_KEY, updatedData);
  return updatedData;
}

// Función para eliminar los datos del usuario
function deleteUser() {
  localStorage.removeItem(USER_DATA_KEY);
}

// Función para guardar datos en localStorage
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Función para cargar datos desde localStorage
function loadFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Manejo de eventos y configuración de la interfaz de usuario
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a los elementos del DOM
  const profilePicture = document.getElementById("profile-picture");
  const uploadPhoto = document.getElementById("upload-photo");
  const savePhotoButton = document.getElementById("save-photo");

  const editForm = document.getElementById("edit-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const passwordForm = document.getElementById("password-form");
  const currentPasswordInput = document.getElementById("current-password");
  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");

  const orderDetailsButtons = document.querySelectorAll("button.toggle-details");

  const logoutButton = document.getElementById("logout-button"); // Botón de cerrar sesión

  // Cargar datos del usuario al iniciar la página
  const userData = getUser();
  if (userData) {
    nameInput.value = userData.name || "";
    emailInput.value = userData.email || "";
    phoneInput.value = userData.phone || "";
    if (userData.photo) {
      profilePicture.src = userData.photo;
    }
  }

  // Subir y guardar foto de perfil
  uploadPhoto.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePicture.src = e.target.result;
        updateUser({ photo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  });

  // Guardar datos personales
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateUser({
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
    });
    alert("Datos personales actualizados.");
  });

  // Cambiar contraseña
  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword !== confirmPassword) {
      alert("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    const storedPassword = getUser().password;
    if (storedPassword && currentPassword !== storedPassword) {
      alert("La contraseña actual es incorrecta.");
      return;
    }

    updateUser({ password: newPassword });
    alert("Contraseña actualizada correctamente.");
    passwordForm.reset();
  });

  // Mostrar/ocultar detalles de pedidos
  orderDetailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const orderDetails = button.parentElement.nextElementSibling;
      const isHidden = orderDetails.style.display === "none" || !orderDetails.style.display;
      orderDetails.style.display = isHidden ? "block" : "none";
      button.textContent = isHidden ? "Ocultar detalles" : "Ver detalles";
    });
  });

  // Cerrar sesión
  logoutButton.addEventListener("click", () => {
    deleteUser(); // Elimina los datos del usuario de localStorage
    alert("Sesión cerrada correctamente.");
    window.location.href = "../FrontEndStore/index.html"; // Redirige a la página de inicio
  });
});


