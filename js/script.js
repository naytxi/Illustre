let globalTranslations;

async function loadTranslations() {
  const response = await fetch("translations.json");
  if (!response.ok) {
    throw new Error("Error al cargar las traducciones");
  }
  globalTranslations = await response.json();
  return globalTranslations;
}

//script date
function updateDateTime() {
  const dateTimeDisplay = document.getElementById("dateTimeDisplay");
  const now = new Date();

  const currentLanguage = localStorage.getItem("language") || "es";
  const { daysOfWeek, monthsOfYear } = globalTranslations[currentLanguage];

  const day = daysOfWeek[now.getDay()];
  const date = now.getDate();
  const month = monthsOfYear[now.getMonth()];
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  dateTimeDisplay.textContent = `${day}, ${hours}:${minutes} - ${date} ${month} ${year}`;
}


//traduc
function updateTranslations(selectedLanguage) {
  for (const key in globalTranslations[selectedLanguage]) {
    const elements = document.querySelectorAll(`[data-translate="${key}"]`);
    elements.forEach((element) => {
      if (element.tagName === "INPUT") {
        if (element.type === "submit") {
          element.value = globalTranslations[selectedLanguage][key];
        } else if (element.type === "checkbox") {
          const label = element.closest('label');
          if (label) {
            const textNode = Array.from(label.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) {
              textNode.nodeValue = ' ' + globalTranslations[selectedLanguage][key];
            }
          }
        } else {
          element.placeholder = globalTranslations[selectedLanguage][key];
        }
      } else {
        element.textContent = globalTranslations[selectedLanguage][key];
      }
    });
  }
  updateDateTime();
}

loadTranslations()
  .then(() => {
    updateDateTime();
    setInterval(updateDateTime, 60000);

    document
      .getElementById("language-select")
      .addEventListener("change", function () {
        const selectedLanguage = this.value;
        localStorage.setItem("language", selectedLanguage);
        updateTranslations(selectedLanguage);
      });

    // Aplicar traducciones iniciales
    const initialLanguage = localStorage.getItem("language") || "es";
    updateTranslations(initialLanguage);
  })
  .catch((error) => {
    console.error(error);
  });

//script Administrador Inicio//admin
document.addEventListener("DOMContentLoaded", function () {
  const monthSelect = document.getElementById("monthSelect");
  const dashboards = document.querySelectorAll(".dashboard");

  monthSelect.addEventListener("change", function () {
    const selectedMonth = this.value;

    if (selectedMonth === "todos") {
      dashboards.forEach((dashboard) => {
        dashboard.style.display = "block";
      });
    } else {
      dashboards.forEach((dashboard) => {
        if (dashboard.id === `dashboard-${selectedMonth}`) {
          dashboard.style.display = "block";
        } else {
          dashboard.style.display = "none";
        }
      });
    }
  });
});

//script Administrador Fin//admin
//Script Index por detalle producto inicio

document.addEventListener("DOMContentLoaded", function () {
  const productos = document.querySelectorAll(".producto");
  productos.forEach((element) => {
    element.addEventListener("click", function (e) {
      if (e.target.tagName === "IMG") {
        // <!--e.target Verifica si el elemento clicado (e.target) es una imagen.-->
        // tagname para devolver el nbr del etiqueta en mayuscula que es mas practico en javascript
        const productoId = this.getAttribute("data-id");
        const colorSeleccionado = this.querySelector("select").value;
        const descripcion = this.querySelector("p").textContent;
        const titulo = this.querySelector(".producto_contenido").textContent;
        window.location.href = `producto.html?id=${productoId}&color=${colorSeleccionado}&descripcion=${encodeURIComponent(
          descripcion
        )}&titulo=${encodeURIComponent(titulo)}`;
      }

      // La propiedad window.location.href en JavaScript se utiliza para obtener o establecer la URL actual de la página web.
      //la siguiente parte de esta linea nos muestra como sera la url el id sera el id del producto que es   const productoId = this.getAttribute('data-id');
      //y el color sera la varibale colorSeleccionado y encodeURIComponent es un codigo que se pone en la url ..........
    });
  });
});

//Script Index por detalle producto fin

//Script producto por detalle producto inicio
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productoId = urlParams.get("id");
  const colorSeleccionado = urlParams.get("color");

  fetch("./productos.json")
    .then((response) => response.json())
    .then((data) => {
      console.log("Datos cargados:", data); // Para depuración
      const producto = data.productos.find((p) => p.id == productoId);
      if (producto) {
        mostrarProducto(producto, colorSeleccionado);
      } else {
        console.error("Producto no encontrado");
      }
    })
    .catch((error) => console.error("Error:", error));
});

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productoId = urlParams.get("id");

  if (!productoId) {
    console.error("No se encontró el ID del producto en la URL.");
    return;
  }

  // Carga el archivo JSON
  fetch("productos.json")
    .then((response) => response.json())
    .then((data) => {
      const producto = data.productos.find((p) => p.id === productoId);
      if (producto) {
        mostrarProducto(producto);
      } else {
        console.error("Producto no encontrado en el JSON.");
      }
    })
    .catch((error) => console.error("Error al cargar el JSON:", error));
});

function mostrarProducto(producto) {
  const detalleProducto = document.querySelector(".detalle-producto");

  // Configurar los datos del producto
  detalleProducto.querySelector(".producto__imagen").src = producto.imagen;
  detalleProducto.querySelector(".producto__imagen").alt = producto.titulo;
  detalleProducto.querySelector(".producto__nombre").textContent =
    producto.titulo;
  detalleProducto.querySelector(".producto_contenido").textContent =
    producto.descripcion;
  detalleProducto.querySelector(".producto__precio").textContent =
    producto.precio;

  // Configurar los colores
  const selectColores = detalleProducto.querySelector(".formulariocampo");
  producto.colores.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    selectColores.appendChild(option);
  });
}
//Script producto por detalle producto fin

//Página de productos
document.addEventListener("DOMContentLoaded", function () {
  // Seleccionamos todos los enlaces de productos
  const productos = document.querySelectorAll(".producto a");

  productos.forEach((producto) => {
    producto.addEventListener("click", function (event) {
      // Prevenir la acción por defecto del enlace
      event.preventDefault();

      // Obtener la información del producto del atributo 'data-*'
      const imagen = producto.getAttribute("data-imagen");
      const nombre = producto.getAttribute("data-nombre");
      const precio = producto.getAttribute("data-precio");

      // Almacenar los datos en el localStorage
      localStorage.setItem("producto_imagen", imagen);
      localStorage.setItem("producto_nombre", nombre);
      localStorage.setItem("producto_precio", precio);

      // Redirigir a la página de producto
      window.location.href = "producto.html";
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Recuperar los datos del localStorage
  const imagen = localStorage.getItem("producto_imagen");
  const nombre = localStorage.getItem("producto_nombre");
  const precio = localStorage.getItem("producto_precio");

  // Verificar si los datos existen y actualizarlos en la página
  if (imagen && nombre && precio) {
    // Actualizar el contenido de la página con los datos recuperados
    document.getElementById("producto_imagen").src = imagen;
    document.getElementById("producto_nombre").textContent = nombre;
    document.getElementById(
      "producto_descripcion"
    ).textContent = `Este es el producto ${nombre}. Precio: ${precio}`;
  }
});

// Función para agregar productos al carrito
function agregarCarritoProducto(producto) {

  // Busca si el producto ya existe en el carrito
  const existingItem = cart.find(item => item.nombre === producto.nombre && item.color === producto.color);
  
  // Si el producto ya existe, incrementa su cantidad
  if (existingItem) {
    existingItem.cantidad += producto.cantidad;
  }
  // Si no existe, lo agrega al carrito
  else {
    cart.push(producto);
  }
  
  actualizarCartPopupProducto();
}

// Función para actualizar la visualización del carrito
function actualizarCartPopupProducto() {

  // Limpia los items actuales del carrito
  cartItems.innerHTML = "";
  let total = 0; // Variable para calcular el precio total
  
  // Recorre cada producto en el carrito
  cart.forEach((item, index) => {

    // Crear un nuevo elemento como lista por cada producto
    const li = document.createElement("li");

    //  Texto del elemento con los detalles del producto

    li.style.fontSize = "16px"; // Ajusta el número según el tamaño deseado
    li.textContent = `${item.nombre} - ${item.color} - Cantidad: ${item.cantidad} - Precio: ${item.precio * item.cantidad}€`;

    // Se crea un botón de "Eliminar" para este producto
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.style.marginLeft = "10px"; // Espaciado para que quede bien visualmente
    
    // Agrega un evento al botón para eliminar este producto
    deleteButton.addEventListener("click", () => {
      eliminarProducto(index); // Llama a la función para eliminar este producto por su índice
    });
    
    // Agrega el botón al elemento de lista
    li.appendChild(deleteButton);
    
    // Agrega el elemento al contenedor de items
    cartItems.appendChild(li);
    // Calcula el precio total
    total += item.precio * item.cantidad;
  });
  
  // Actualiza el precio total mostrado
  totalPrice.textContent = `${total}€`;

  // Actualiza el contador de items del carrito
  counter1Value = cart.reduce((sum, item) => sum + item.cantidad, 0);
  counter1Display.textContent = counter1Value;
}

document.querySelectorAll('.formulario__submit').forEach(button => {
  button.addEventListener('click', (e) => {
    const producto = e.target.closest('.detalle-producto'); // Encuentra el contenedor del producto
    // Capturar la informacion del producto
    const nombre = producto.querySelector('.producto__nombre').textContent; 
    const precio = parseFloat(producto.querySelector('.producto__precio').textContent);
    const color = producto.querySelector('.formulariocampo').value;
    const cantidad = parseInt(producto.querySelector('.cantidadScript').value);
    
    // Valida que el producto tenga collor y cantidad válidos
    if (color === '-- Seleccionar Color --' || isNaN(cantidad) || cantidad <= 0) {
      alert('Por favor, selecciona un color y una cantidad válida.'); //Alerta si la validación falla
      return;
    }
    
    cartPopup.style.display = "block";
    agregarCarritoProducto({nombre, precio, color, cantidad}); // Agregar el producto al carrito

  });
});

// SCRIPT LOGIN //
const userInfo = document.getElementById("user-info");
const usernameButton = document.getElementById("username-button");
const loginButton = document.getElementById('loginButton');
const loginPopup = document.getElementById('loginPopup');
const closePopup = document.getElementById('loginClose');
const ojito = document.getElementById('ojito');
const password = document.getElementById('password');
//este script maneja elmevento del popup, para que cuando hagamos click aparezca.
loginButton.addEventListener('click', () => {
    loginPopup.style.display = 'block';
});

closePopup.addEventListener("click", () => {
  loginPopup.style.display = "none";
});
//este en cambio es para el boton de ojo, cambia el estado del password a texto normal.
ojito.addEventListener('click', function(event) {
  event.preventDefault();

    if (password.type === "password") {
        password.type = "text";
        imagen.src = "../fonts/Imagenes/ojoAbierto1.jpg";
    } else {
        password.type = "password";
        imagen.src = "../fonts/Imagenes/ojoCerrado1.jpg";
    }
});

//aqui manejamos el evento del formulario del login, guardamos el user y el password en el localstorage
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); //tenemos que quitar el evento que tiene el DOM por defecto al enviar un formulario.

      const username = document.getElementById("username").value;
      const passwordValue = document.getElementById("password").value;
 //recogemos los datos puestos en el form del login en una variable, esto es lo que enviaremos al localStorage.
      const userData = {
        username: username,
        password: passwordValue,
      };
   // Comprobamos si el usuario es el administrador
      if (username === "nahia" && passwordValue === "Nahia") {
          userData.isAdmin = true;  // Marcar al usuario como administrador
      }
  //guardamos el userData dentro del localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
//si el login es admin redirigir a la pagina respectiva
      if (userData.isAdmin) {
        window.location.href = "administrador.html";  // Redirigir a la página de administrador
      }
      else {
        // Si no es admin, redirigir a la página de usuario
        window.location.href = "usuario.html";  // Redirigir a la página de usuario
      }
    });
  }

  //aqui manejamos el icono y el boton del usuario, cambiando de uno a otro cuando logeamos
  // Verificar el estado del usuario para mostrar login o nombre de usuario
  const usernameButton = document.getElementById("usernameButton");
  const userInfo = document.getElementById("userInfo");

  //Obtiene los datos guardados como una cadena JSON y los guarda en una variable
  const userData = JSON.parse(localStorage.getItem("userData"));

 //Se comprueba si existe el objeto userData y si tiene una propiedad username. Esto indica que el usuario está logeado y tiene un nombre de usuario registrado.
  if (userData && userData.username) {
    // Si el usuario está logueado, muestra el nombre de usuario y quita el icon de login.
    //verificamos que las tres cosas existen en el DOM y despues se cambia al boton de usuario con la info de localStorage.
    if (loginButton && userInfo && usernameButton) {
      loginButton.style.display = "none";
      userInfo.style.display = "block";
      usernameButton.textContent = userData.username;

      // Agregar evento para redirigir a usuario.html
      usernameButton.addEventListener("click", () => {
        window.location.href = "usuario.html";
      });
    }
  } else {
    // Si no está logeado, mostrar el icono del login
    if (loginButton && userInfo && usernameButton) {
      loginButton.style.display = "block";
      userInfo.style.display = "none";
    }
  }

  // Manejar la carga de datos en usuario.html y cambia los valores a los guardados en el localstorage
  if (window.location.pathname.includes("usuario.html")) {
    const usernameDisplay = document.getElementById("username-display");
    const passwordDisplay = document.getElementById("current-password");

    if (usernameDisplay && userData) {
      // Mostrar el nombre de usuario
      usernameDisplay.textContent =
        userData.username || "Usuario no registrado";
      passwordDisplay.value = userData.password || "";
    }
  }
});

//aqui manejamos la seccion del historial de pedidos
document.addEventListener("DOMContentLoaded", () => {
  // Seleccionamos todos los botones de "Ver detalles"
  const toggleDetailsButtons = document.querySelectorAll(".toggle-details");

  // Añadimos el evento de clic a cada botón
  toggleDetailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // primero buscamos el contenedor de order y una vez lo tenemos, buscamos el primer hijo llamado order details y lo guardamos
      const orderDetails = button
        .closest(".order")
        .querySelector(".order-details");

      // Alterna la visibilidad del contenedor de detalles
      if (
        orderDetails.style.display === "none" ||
        orderDetails.style.display === ""
      ) {
        orderDetails.style.display = "block"; // Mostrar los detalles
        button.textContent = "Ocultar detalles"; // Cambiar texto del botón
      } else {
        orderDetails.style.display = "none"; // Ocultar los detalles
        button.textContent = "Ver detalles"; // Cambiar texto del botón
      }
    });
  });
});

//aqui manejamos el boton de cerrar sesion del usuario.html
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      // Elimina los datos del usuario del localStorage
      localStorage.removeItem("userData");

      // Redirige al index
      window.location.href = "index.html";
    });
  }
});

//POPUP CARRITO//
const cartButton = document.getElementById("cartButton");
const cartPopup = document.getElementById("cartPopup");
const cartClose = document.getElementById("cartClose");
const counter1Display = document.getElementById("counter1");
let counter1Value = 0;

cartButton.addEventListener("click", () => {
  cartPopup.style.display = "block";
});

cartClose.addEventListener('click', () => {
    cartPopup.style.display = 'none';
});

// document.getElementById("increment1").addEventListener("click", () => {
//     counter1Value++;
//     counter1Display.textContent = counter1Value;
//   });
  
//   document.getElementById("decrement1").addEventListener("click", () => {
//     if (counter1Value > 0) {
//       counter1Value--;
//       counter1Display.textContent = counter1Value;
//     }
//   });


  //popup rebajas

document.addEventListener("DOMContentLoaded", () => {
  const popupRebajas = document.getElementById("popupRebajas");
  const closePopup = document.getElementById("rebajasclose");

  // Mostrar el popup al cargar la página
  popupRebajas.classList.add("visible");

  // Cerrar el popup cuando se haga clic en la X
  closePopup.addEventListener("click", () => {
    popupRebajas.classList.remove("visible");
  });
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

// AGREGANDO PRODUCTOS AL CARRITO

// Selecciona los elementos del DOM necesarios para manejar el carrito
const cartItems = document.getElementById("cartItems"); // Contenedor de items del carrito

const totalPrice = document.getElementById("totalPrice"); // Elemento para mostrar precio total
let cart = [];

// Función para agregar productos al carrito
function agregarCarrito(producto) {

  // Busca si el producto ya existe en el carrito
  const existingItem = cart.find(item => item.nombre === producto.nombre && item.color === producto.color);
  
  // Si el producto ya existe, incrementa su cantidad
  if (existingItem) {
    existingItem.cantidad += producto.cantidad;
  }
  // Si no existe, lo agrega al carrito
  else {
    cart.push(producto);
  }
  
  actualizarCartPopup();
}

// Función para actualizar la visualización del carrito
function actualizarCartPopup() {

  // Limpia los items actuales del carrito
  cartItems.innerHTML = "";
  let total = 0; // Variable para calcular el precio total
  
  // Recorre cada producto en el carrito
  cart.forEach((item, index) => {

    // Crear un nuevo elemento como lista por cada producto
    const li = document.createElement("li");

    //  Texto del elemento con los detalles del producto
    li.textContent = `${item.nombre} - ${item.color} - Cantidad: ${item.cantidad} - Precio: ${item.precio * item.cantidad}€`;
    
    // Se crea un botón de "Eliminar" para este producto
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.style.marginLeft = "10px"; // Espaciado para que quede bien visualmente
    
    // Agrega un evento al botón para eliminar este producto
    deleteButton.addEventListener("click", () => {
      eliminarProducto(index); // Llama a la función para eliminar este producto por su índice
    });
    
    // Agrega el botón al elemento de lista
    li.appendChild(deleteButton);
    
    // Agrega el elemento al contenedor de items
    cartItems.appendChild(li);
    // Calcula el precio total
    total += item.precio * item.cantidad;
  });
  
  // Actualiza el precio total mostrado
  totalPrice.textContent = `${total}€`;

  // Actualiza el contador de items del carrito
  counter1Value = cart.reduce((sum, item) => sum + item.cantidad, 0);
  counter1Display.textContent = counter1Value;
}

// Función para eliminar un producto del carrito por su índice
function eliminarProducto(index) {
  cart.splice(index, 1); // Elimina el producto del array `cart` en la posición `index`
  actualizarCartPopup(); // Actualiza la visualización del carrito después de eliminarlo
}

// Agrega evento de clic a todos los botones de "Agregar al Carrito"
document.querySelectorAll('.producto_submit').forEach(button => {
  button.addEventListener('click', (e) => {
    const producto = e.target.closest('.producto'); // Encuentra el contenedor del producto
    // Capturar la informacion del producto
    const nombre = producto.querySelector('.producto__nombre').textContent; 
    const precio = parseFloat(producto.querySelector('.producto__precio').textContent);
    const color = producto.querySelector('.producto_color').value;
    const cantidad = parseInt(producto.querySelector('.producto_cantidad').value);
    
    // Valida que el producto tenga collor y cantidad válidos
    if (color === '-- Seleccionar Color --' || isNaN(cantidad) || cantidad <= 0) {
      alert('Por favor, selecciona un color y una cantidad válida.'); //Alerta si la validación falla
      return;
    }
    
    cartPopup.style.display = "block";
    agregarCarrito({nombre, precio, color, cantidad}); // Agregar el producto al carrito

  });
});

//SCRIPT FILTROS

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".filters-tittle");
  const filtersContainer = document.querySelector(".filter_container");

  //para que se desplieguen los filtros al darle al boton
  toggleButton.addEventListener("click", () => {
    filtersContainer.classList.toggle("hidden"); //Quita el hidden o lo añade del contenedor donde se encuentran los detalles de los pedidos.
  });
});

//filtrado por categorias
document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll(".filter-option");
  const products = document.querySelectorAll(".producto");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterProducts);
  });

  function filterProducts() {
    const selectedCategories = Array.from(checkboxes)//aqui crea un array con las categorias del checkbox
      .filter((checkbox) => checkbox.checked)//con esto filtramos las que estan seleccionadas
      .map((checkbox) => checkbox.value);// y aqui crea un array con solamente las que hemos seleccionado usando map

    products.forEach((product) => { //comenzamos a hacer un bucle recorriendo todos los productos
      const category = product.getAttribute("data-category"); //guardamos la categoria
      if (
        selectedCategories.length === 0 || //si no hay ninguna seleccionada muestra todas
        selectedCategories.includes(category) //si hay coincidencia muestra el producto y sino lo oculta
      ) {
        product.style.display = "block"; // Mostrar producto
      } else {
        product.style.display = "none"; // Ocultar producto
      }
    });
  }
});

//filtrado por precio
  document.addEventListener("DOMContentLoaded", function () {
    const priceRange = document.getElementById("price-range");
    const priceValue = document.getElementById("price-value");
    const products = document.querySelectorAll(".producto");
  
    // Actualiza el texto del precio al mover la barra
    priceRange.addEventListener("input", function () {
      const selectedPrice = priceRange.value;//guardamos el valor seleccionado en la barra dentro de una variable
      priceValue.textContent = `${selectedPrice}€`;//cambia el texto del precio de la barra 
  
      // Filtra los productos
      products.forEach((product) => { //creamos un bucle esta vez para verificar los precios de los productos
        const productPrice = product.getAttribute("data-price"); 
        if (productPrice === selectedPrice) { //si hay coincidencia entre el valor guardado en variable de seleccion y el del producto
          product.style.display = "block"; // Muestra el producto
        } else {
          product.style.display = "none"; // Oculta el producto
        }
      });
    });
  });


//Volver arriba inicio
document.addEventListener("DOMContentLoaded", function () {
  const scrollToTopButton = document.getElementById("scrollToTop");

  
  // Mostrar/ocultar botón
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      scrollToTopButton.style.display = "block";
    } else {
      scrollToTopButton.style.display = "none";
    }
  });

  // Scroll suave
  scrollToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Ocultar inicialmente
  scrollToTopButton.style.display = "none";
});

//volver arriba fin

// carrito



// // Función para actualizar la vista del carrito
// function actualizarCarrito() {
//   const carritoLista = document.getElementById("carrito");
//   carritoLista.innerHTML = ""; // Limpiar el contenido antes de mostrar el carrito

//   // Mostrar los productos del carrito
//   carrito.forEach((producto) => {
//     const item = document.createElement("li");
//     item.textContent = `${producto.nombre} - $${producto.precio}`;
//     carritoLista.appendChild(item);
//   });

//   // Calcular el total
//   const total = carrito.reduce(
//     (acumulador, producto) => acumulador + producto.precio,
//     0
//   );
//   document.getElementById("total").textContent = `Total: $${total}`;
// }