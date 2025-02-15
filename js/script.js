let globalTranslations;

async function loadTranslations() {
  const response = await fetch("translations.json");
  // loadTranslations es asíncrona. Esto significa que la función puede realizar operaciones que
  //  tardan tiempo (como solicitudes de red) sin bloquear el hilo principal de ejecución.
  // await se utiliza para esperar a que la promesa devuelta por fetch se resuelva.
  if (!response.ok) {

    //es una instrucción  para generar y lanzar un error personalizado cuando ocurre un problema
    throw new Error("Error al cargar las traducciones");
  }
  globalTranslations = await response.json();
  return globalTranslations;
}

//script fecha y hora
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
    /* Se utiliza un bucle for...in para recorrer cada clave (key) 
     en el objeto de traducciones correspondiente al idioma seleccionado*/
    const elements = document.querySelectorAll(`[data-translate="${key}"]`);
    //recorrer cada elemento encontrado con ForEach
    elements.forEach((element) => {
      if (element.tagName === "INPUT") {
        if (element.type === "submit") {
          // Si el tipo del input es "submit", se establece su valor (value) con la traducción correspondiente.
          element.value = globalTranslations[selectedLanguage][key];
        } else if (element.type === "checkbox") {
          // Si el tipo del input es "checkbox", se busca el elemento <label> más cercano asociado al checkbox.

          const label = element.closest('label'); //closest sirve para encontrar el primer elemento ancestro <label>/par buscar el padre directo del label
          if (label) {
           
           
            const textNode = Array.from(label.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
           /*label.childNodes : 1-Devuelve una colección de todos los nodos hijos del elemento <label>
              2- find(...) : busca el primer nudo de tipo texto */           
           
              //Verifica si se encontró un nodo de texto
            if (textNode) {
              /*nodeValue : Propiedad que permite acceder y modificar el contenido de texto de un nodo de texto
              establece su valor (value) con la traducción correspondiente.*/
              textNode.nodeValue = ' ' + globalTranslations[selectedLanguage][key];
            }
          }
          /*Para otros tipos de inputs (como text o textarea), 
          se actualiza su atributo placeholder con la traducción correspondiente.*/
        } else {
          element.placeholder = globalTranslations[selectedLanguage][key];
        }
        // Si el elemento no es un input, se actualiza su contenido textual (textContent) con la traducción correspondiente.
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
  selectColores.innerHTML = '';
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
  guardarCarrito();
  actualizarCartPopupProducto();
}

// Función para actualizar la visualización del carrito
function actualizarCartPopupProducto() {

  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <p>Tu carrito está vacío</p>
        <i class="fas fa-shopping-cart"></i>
      </div>
    `;
  } else {
    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      
      const itemSubtotal = item.precio * item.cantidad;
      
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.nombre}</span>
          <span class="cart-item-color">${item.color}</span>
        </div>
        <div class="cart-item-details">
          <span class="cart-item-quantity">Cant: ${item.cantidad}</span>
          <span class="cart-item-price">${itemSubtotal.toFixed(2)}€</span>
          <button class="delete-btn" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      cartItems.appendChild(cartItem);
      total += itemSubtotal;
    });
  }

  totalPrice.textContent = `${total.toFixed(2)}€`;
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

  

// AGREGANDO PRODUCTOS AL CARRITO

// Selecciona los elementos del DOM necesarios para manejar el carrito
const cartItems = document.getElementById("cartItems"); // Contenedor de items del carrito

const totalPrice = document.getElementById("totalPrice"); // Elemento para mostrar precio total
let cart = [];

// Función para guardar el carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para cargar el carrito desde localStorage
function cargarCarrito() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
      cart = JSON.parse(savedCart);
  }
}

// Llama a esta función al inicio de tu script
cargarCarrito();

// Función para agregar productos al carrito
document.addEventListener('DOMContentLoaded', function() {
  cargarCarrito();
  actualizarCartPopup(); // O actualizarCartPopupProducto(), según corresponda
});

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
  guardarCarrito(); 
  actualizarCartPopup();
}

function actualizarCartPopup() {
  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <p>Tu carrito está vacío</p>
        <i class="fas fa-shopping-cart"></i>
      </div>
    `;
  } else {
    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      
      const itemSubtotal = item.precio * item.cantidad;
      
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.nombre}</span>
          <span class="cart-item-color">${item.color}</span>
        </div>
        <div class="cart-item-details">
          <span class="cart-item-quantity">Cant: ${item.cantidad}</span>
          <span class="cart-item-price">${itemSubtotal.toFixed(2)}€</span>
          <button class="delete-btn" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      cartItems.appendChild(cartItem);
      total += itemSubtotal;
    });
  }

  totalPrice.textContent = `${total.toFixed(2)}€`;
  counter1Value = cart.reduce((sum, item) => sum + item.cantidad, 0);
  counter1Display.textContent = counter1Value;
}

// Agregar un solo event listener al contenedor del carrito
cartItems.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
    const button = e.target.closest('.delete-btn');
    if (button) {
      const index = parseInt(button.getAttribute('data-index'));
      eliminarProducto(index);
    }
  }
});



// Función para eliminar un producto del carrito por su índice
function eliminarProducto(index) {
  cart.splice(index, 1); // Elimina el producto del array `cart` en la posición `index`
  guardarCarrito();
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


/*script para boton de REGISTRO*/
const registro =document.getElementById("Register");
registro.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "registro.html"; 
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


// Función para mostrar los artículos en la página de checkout
function mostrarArticulosEnCheckout() {
  const checkoutItemsList = document.getElementById('checkoutItemsList');
  const checkoutTotal = document.getElementById('checkoutTotal');
  
  if (!checkoutItemsList || !checkoutTotal) {
      console.error('Elementos de checkout no encontrados');
      return;
  }

  checkoutItemsList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.nombre} - ${item.color} - Cantidad: ${item.cantidad} - Precio: ${item.precio * item.cantidad}€`;
      checkoutItemsList.appendChild(li);
      total += item.precio * item.cantidad;
  });

  checkoutTotal.textContent = `${total}€`;
}

// Función para inicializar la página de checkout
function inicializarCheckout() {
  cargarCarrito();
  mostrarArticulosEnCheckout();
}

// Verifica si estamos en la página de checkout
if (document.getElementById('checkoutItemsList')) {
  document.addEventListener('DOMContentLoaded', inicializarCheckout);
}


function mostrarArticulosEnCheckout() {
  const checkoutItemsList = document.getElementById('checkoutItemsList');
  const checkoutTotal = document.getElementById('checkoutTotal');
  
  if (!checkoutItemsList || !checkoutTotal) {
      console.error('Elementos de checkout no encontrados');
      return;
  }

  checkoutItemsList.innerHTML = '';
  let total = 0;

  // Crear tabla
  const table = document.createElement('table');
  table.className = 'checkout-table';
  
  // Crear encabezado de la tabla
  const thead = document.createElement('thead');
  thead.innerHTML = `
      <tr>
          <th>Producto</th>
          <th>Color</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Subtotal</th>
      </tr>
  `;
  table.appendChild(thead);

  // Crear cuerpo de la tabla
  const tbody = document.createElement('tbody');
  cart.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${item.nombre}</td>
          <td>${item.color}</td>
          <td>${item.cantidad}</td>
          <td>${item.precio}€</td>
          <td>${item.precio * item.cantidad}€</td>
      `;
      tbody.appendChild(tr);
      total += item.precio * item.cantidad;
  });
  table.appendChild(tbody);

  // Agregar tabla al contenedor
  checkoutItemsList.appendChild(table);

  // Mostrar total
  // checkoutTotal.textContent = `${total.toFixed(2)}€`;

  // Agregar resumen de la compra
  const resumen = document.createElement('div');
  resumen.className = 'checkout-summary';
  resumen.innerHTML = `
      <h3>Resumen de la compra</h3>
      <p>Subtotal: ${total.toFixed(2)}€</p>
      <p>IVA (21%): ${(total * 0.21).toFixed(2)}€</p>
      <p><strong>Total a pagar: ${(total * 1.21).toFixed(2)}€</strong></p>
  `;
  checkoutItemsList.appendChild(resumen);
}



   
     