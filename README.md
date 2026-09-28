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

No requiere instalación. Abra `dist/index.html` en un navegador moderno.

También puede servirla localmente desde esta carpeta:

```bash
python3 -m http.server 8000 --directory dist
```

Luego visite `http://localhost:8000`.

## Archivos

- `dist/index.html`: aplicación completa (HTML, CSS y JavaScript).
- `configuracion/hosting.json`: copia de la configuración utilizada para la publicación estática inicial.
