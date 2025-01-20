document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('scrollTopBtn');
    
    if (!btn) {
      console.error('Botón no encontrado');
      return;
    }
  
    // Mostrar/ocultar con classList
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 300);
    });
  
    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0, 
        behavior: 'smooth'
      });
    });
  });