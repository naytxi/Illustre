document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('scrollTopBtn');
    // capturamos el elemento del Dom
    if (!btn) {
      console.error('Botón no encontrado');
      return;
    }
  
    // Mostrar/ocultar con classList
    window.addEventListener('scroll', () => { 
      // cada vez que se mueve la pagina se ejecutara la funcion
      btn.classList.toggle('visible', window.scrollY > 300);
      // scrollY es una propiedad que devuelve el número de píxeles desplazados verticalmente
      // si el desplazamiento vertical de la ventana (scrollY) es mayor que 300 píxeles. Si lo es, se añade la clase 'visible'; si no, se elimina.
    });
  
    btn.addEventListener('click', () => {
      window.scrollTo({

        // scrollTo es un metodo que desplaza la ventana a una posicion especifica
        top: 0, 
        behavior: 'smooth'
      });
    });
  });