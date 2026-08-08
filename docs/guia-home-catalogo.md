# Guía — Rediseño del Home y Catálogo

> Documento de acuerdo para no equivocarnos.
> Estado: **borrador para revisar**.

## 1. Idea general

El home deja de ser "la grilla de todos los productos". Pasa a ser una
**vitrina** que engancha, y el catálogo completo vive en **su propia vista**,
con acceso directo.

## 2. Home (vitrina)

Orden, de arriba hacia abajo:

1. Barra superior (sticky) — *ya hecho*
2. **Banner / header** (carrusel si hay más de una imagen)
3. Carrusel de **destacados** — con un **título grande** de sección,
   ej. *"Nuestros destacados de la semana"*
4. Sección de **marcas**
5. *(Futuro)* Ofertas u otras secciones que atraigan
6. Footer

**Importante:** en el home **NO** va la grilla completa de productos. Como no
hay grilla, el home **no pide productos** → ahí no hay tema de auto-carga.

### Nota sobre el banner / header

Va **entre la barra y destacados**, para no cargar tanto arriba.

Hoy el negocio carga **una sola** imagen (`heroImageUrl`). Para que sea carrusel
tiene que poder cargar **varias**.

- **DECIDIDO: se hace ahora** el soporte multi-imagen (aprovechando que estamos
  a mitad del proyecto).
- Es la **única parte full-stack** de todo el rediseño: `BusinessConfig` pasa de
  una imagen a varias → toca backend + admin (subir varias) + carrusel en el
  front.
- Con **una** imagen: se muestra fija. Con **dos o más**: carrusel.

## 3. Vista Catálogo (todos los productos)

- Muestra todos los productos en grilla.
- Acceso "Catálogo" (**responsivo**):
  - **Mobile:** dentro del menú ☰, con el texto "Catálogo".
  - **Medianos/grandes (md+):** visible directo en la barra.

### Paginación — DECIDIDO: backend (Opción A)

- El backend manda de a **20** (`page` / `limit`).
- **Carga automática al llegar al final:** cuando el usuario llega al fondo y el
  footer se asoma, se piden **solos** los próximos 20 (sin botón "Ver más").
- La gracia: que el footer se **vea un instante** (que el usuario note que hay
  info/footer abajo) y enseguida entren los siguientes productos.

**Reglas para que se porte bien:**

- **Pausa al entrar al footer:** si el usuario va al footer (con "Dónde estamos"
  o scrolleando hasta él), se **corta la auto-carga** — no pide más hasta que
  **sale** del footer (vuelve a subir). Así el footer deja de ser un blanco móvil
  y "Dónde estamos" aterriza tranquilo.
- Cortar la auto-carga también cuando **ya no hay más** productos (última
  página), si no queda pidiendo al pepe.
- *Nota honesta:* esto es, técnicamente, una forma de **scroll infinito** — pero
  prolija: eficiente (de a 20 del backend), con footer visible y con pausa. Es la
  versión intermedia entre "todo en una página" (lo que no querías) y la
  paginación con botones.

## 4. Categorías

- Desde el menú ☰ se entra a una categoría puntual → se muestra **solo esa
  grilla** (sin banner, destacados ni marcas).
- "Catálogo" = ver todos.

## 5. Destacados

- Un producto es "destacado" si tiene promoción tipo `FEATURED`. Esto **ya
  existe** en el sistema: se marca desde el admin.
- El carrusel filtra los productos que tienen esa marca.
- *A confirmar en la práctica:* que los destacados lleguen bien por el endpoint
  público (probar marcando uno).

## 6. Vista de detalle del producto

- Ya existe la ruta `/producto/[slug]`. Se **mejora**, no se crea de cero.
- Datos que ya vienen del backend y se pueden mostrar:
  - Galería de imágenes (los productos tienen varias)
  - Nombre, marca, categorías
  - Precio, precio final y promoción
  - Descripción
  - SKU
- *A definir juntos:* cómo organizar la vista. Pablo tiene varias opciones en
  mente; se decide cuando lleguemos a este ladrillo.

## 7. Barra superior

- Sticky, buscador (lupa), carrito, menú ☰ → **ya hecho**.
- Falta: agregar "Catálogo" responsivo (☰ en mobile, barra en md+).

## 8. Alcance

- Frontend: casi todo.
- Backend: la **paginación** (page/limit) y el **multi-imagen** del banner.

## 9. Orden sugerido (de a poco, un ladrillo por vez)

1. Vista Catálogo separada + acceso responsivo "Catálogo".
2. Paginación backend de a 20 + auto-carga al llegar al final (con pausa en footer).
3. Carrusel de destacados en el home (con su título grande).
4. Sección de marcas.
5. Banner/header multi-imagen (backend + admin + carrusel).
6. Mejorar la vista de detalle del producto.
7. *(Más adelante)* Sección de ofertas.

---

### Estado de decisiones

- [x] Paginación: **Opción A** (backend, auto-carga, con **pausa al entrar al footer**)
- [x] Banner/header multi-imagen: **se hace ahora** (full-stack)
- [ ] Organización de la vista de detalle (Pablo trae opciones)
