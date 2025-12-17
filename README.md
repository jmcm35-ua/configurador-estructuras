# ![Logo](public/logos/full-logo-blanco.svg)

**Forge3D** es una herramienta interactiva para la **edición y visualización de estructuras 3D** en tiempo real. Permite modificar medidas y materiales de elementos dentro de un modelo de manera intuitiva.

Con Forge3D puedes:

- Ajustar las **dimensiones** de la estructura.
- Cambiar los **materiales** de los componentes.
- Visualizar **sombras y luces** en tiempo real.
- Navegar por el modelo 3D de forma interactiva.

---

## 🌐 Demo / Página web

Puedes ver y probar Forge3D en línea en: [Forge3D](https://herramienta-estructura.web.app/)

---

## 🔧 Proceso de funcionamiento

1. **Modificar el modelo**
   - Utiliza el panel de control en la esquina inferior izquierda.
   - Ajusta **ancho, largo y altura** con sliders o campos numéricos.
   - Cambia el **material** de la estructura (madera, metal o bronce).

2. **Actualización en tiempo real**
   - Todos los cambios se reflejan instantáneamente en la escena.

---

## 🔧 Proceso de desarrollo y mejoras

1. Se ajustó el modelo 3D para facilitar el desarrollo de la aplicación, incluyendo **ajuste de los centros de masa** y reducción del número de lamas para simplificar su cálculo.

2. Actualmente, el número de lamas generadas en la parte superior se calcula según el **espacio disponible**, manteniendo una separación de 14 cm entre ellas.  
   - No se sigue una lógica física: la lama puede estirarse sin considerar peso ni estabilidad.  
   - Como mejora, se podría calcular la colocación de vigas o columnas de refuerzo para garantizar la estabilidad de la estructura.

3. La **modificación de la estructura** (medidas y texturas) funciona correctamente.  
   - Mejoras futuras podrían incluir optimizar el escenario y las luces para crear un ambiente más realista y cálido.  
   - También sería interesante permitir al usuario intercambiar entre escenarios o utilizar realidad aumentada para visualizar la estructura en su entorno real.

4. La interfaz permite la **modificación de la estructura**.  
   - Como mejora futura, se podría desarrollar una versión móvil y crear una interfaz más robusta, que permita realizar más acciones de forma intuitiva.

---

## ⚙️ Tecnologías utilizadas

- **Three.js**: Renderizado 3D en el navegador.  
- **Firebase**: Para despliegue.  
- **HTML, CSS, JS**: Interfaz y lógica.  
- **npm**: Gestión de dependencias y scripts de build.

---

## 🚀 Cómo ejecutar

```bash
# Clonar el repositorio
git clone https://github.com/jmcm35-ua/configurador-estructuras.git
cd configurador-estructuras

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Generar build de producción
npm run build
