// customTheme.js

import { extendTheme } from 'native-base';

const theme = extendTheme({
  colors: {
    // Define tus colores personalizados aquí
    primary: '#3498db', // Color primario
    secondary: '#e74c3c', // Color secundario
    background: '#f0f0f0', // Color de fondo
    text: '#333', // Color de texto principal
  },
  fonts: {
    // Define tus fuentes personalizadas aquí
    body: 'Roboto', // Fuente principal para el cuerpo del texto
    heading: 'Montserrat', // Fuente para los encabezados
  },
  fontSizes: {
    // Define los tamaños de fuente personalizados aquí
    sm: '12px', // Tamaño de fuente pequeño
    md: '16px', // Tamaño de fuente medio
    lg: '20px', // Tamaño de fuente grande
  },
  // Más configuraciones de tema pueden agregarse aquí según sea necesario
});

export default theme;