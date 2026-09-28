// Importa la función oficial que valida la configuración de Astro.
import { defineConfig } from "astro/config";

// Exporta la configuración usada tanto en local como en GitHub Pages.
export default defineConfig({
  // Indica la dirección pública final para crear enlaces correctos.
  site: "https://gabi-vasquez.github.io",
  // Añade el nombre del repositorio a las rutas de archivos públicos.
  base: "/ruta-segura-iso25010",
  // Genera HTML estático porque la aplicación no necesita servidor.
  output: "static",
});
