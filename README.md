# Ruta Segura

Web interactiva que demuestra **protección contra errores del usuario**, una subcaracterística de la capacidad de interacción (usabilidad en ediciones anteriores) del modelo de calidad de producto ISO/IEC 25010, perteneciente a la familia SQuaRE.

## Idea

La persona configura una entrega con dron. Antes de autorizarla, la aplicación comprueba el peso del paquete, la batería y la zona de vuelo. Los valores peligrosos se bloquean, se señalan junto al campo y reciben una instrucción concreta de corrección.

## Requisito comprobable

> El sistema debe impedir la autorización del despegue mientras el peso no esté entre 0,1 y 5 kg, la batería sea menor del 40 % o la zona esté restringida; además, debe identificar cada error y permitir el envío cuando los tres controles sean válidos.

Cómo comprobarlo:

1. Abra la web: inicia con tres errores y el botón desactivado.
2. Cambie solo un campo por un valor válido: el contador pasa de 0/3 a 1/3.
3. Pulse **Aplicar valores seguros**: el contador llega a 3/3 y se habilita el botón.
4. Pulse **Autorizar despegue**: aparece la confirmación de misión autorizada.

## Ejecución local

Instale las dependencias:

```bash
npm install
```

Inicie el servidor de desarrollo:

```bash
npm run dev
```

Abra la dirección que Astro muestra en la terminal. Para crear la versión final use `npm run build`.

## Archivos

- `src/pages/index.astro`: estructura, contenido y comportamiento de la aplicación.
- `src/scripts/MissionApplication.ts`: clases orientadas a objetos para reglas, campos, vista y coordinación de la misión.
- `src/layouts/BaseLayout.astro`: plantilla HTML y metadatos comunes.
- `src/styles/global.css`: sistema visual y adaptación a pantallas pequeñas.
- `public/favicon.svg`: icono de la pestaña.
- `astro.config.mjs`: configuración de Astro para GitHub Pages.
- `.github/workflows/pages.yml`: publicación automática desde la rama `main`.
- `configuracion/hosting.json`: copia de la configuración utilizada para la publicación inicial.

El código incluye comentarios en español que explican cada bloque y cada paso de la validación.

## Programación orientada a objetos

La lógica usa encapsulación, herencia, polimorfismo y composición:

- `ValidationRule<T>` define el contrato común de las reglas.
- `RangeRule` y `ExcludedValueRule` heredan ese contrato y lo implementan de manera diferente.
- `FieldController<T>` encapsula cada campo y su representación visual.
- `MissionView` controla el estado general que ve la persona.
- `MissionApplication` crea los objetos, conecta los eventos y coordina la misión.
