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