# 📺 PromoMaster Pro

**PromoMaster Pro** es una solución avanzada de cartelería digital (Digital Signage) diseñada para transformar cualquier pantalla en una potente herramienta de marketing. Permite gestionar sucursales, productos y avisos corporativos con una estética premium, fluida y profesional.

## ✨ Características Principales

- **Gestión Integral:** Administra múltiples sucursales, catálogos de productos y avisos legales o informativos.
- **Mix Media Playlist:** Crea secuencias personalizadas mezclando productos y avisos con orden ajustable.
- **Visualización de Alto Impacto:** Interfaz de visualización optimizada para tablets y computadoras con animaciones suaves, efectos de iluminación dinámica y tipografías impactantes.
- **Ticker Dinámico:** Barra de desplazamiento (marquee) en el pie de página que se adapta al contenido del producto (ej: "Calidad Premium", "Oferta del Día").
- **Persistencia Local:** Todos los cambios se guardan automáticamente en `localStorage`, permitiendo trabajar sin perder datos al actualizar.
- **Diseño Responsive:** Adaptado para una experiencia perfecta tanto en gestión (dashboard) como en exhibición (full screen).

## 🤖 Integración con Inteligencia Artificial (Google Gemini)

La aplicación aprovecha el potencial de los modelos más recientes de **Google Gemini API** para potenciar la creatividad y eficiencia:

1.  **Generación de Imágenes:** Utiliza el modelo `gemini-2.5-flash-image` para crear fotografías publicitarias de estudio de forma automática a partir del nombre del producto. *Ideal para prototipos rápidos con créditos gratuitos del SDK.*
2.  **Sugerencia de Slogans:** Mediante `gemini-3-flash-preview`, la IA analiza el nombre y descripción para proponer frases cortas e impactantes que vendan más.

## 🛠️ Tecnologías Utilizadas

- **React 19:** Biblioteca principal para la interfaz de usuario.
- **Tailwind CSS:** Framework de diseño para una estética moderna y utilitaria.
- **Google GenAI SDK:** Integración nativa con los modelos Gemini 2.5 y 3.
- **Lucide React:** Set de iconos minimalistas y elegantes.
- **ESM.sh:** Gestión de dependencias mediante módulos ES6 modernos directamente en el navegador.

## 🚀 Instalación y Uso

1.  Abre el archivo `index.html` en un navegador moderno.
2.  Desde la pestaña **Gestión Total**, crea tu primer local y añade productos.
3.  Usa la pestaña **Avisos Libres** para información general (horarios, avisos legales).
4.  En el **Panel de Control**, arma tu secuencia y presiona **Iniciar Transmisión**.

---
*Desarrollado con enfoque en estética y funcionalidad premium para el sector retail.*