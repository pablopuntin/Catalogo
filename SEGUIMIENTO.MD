# Catálogo Demo - Estado del Proyecto

## Objetivo Principal

Crear una demo comercial de catálogo web administrable orientada a pequeños y medianos negocios.

La demo debe ser lo suficientemente profesional como para que un potencial cliente piense:

> "¿Cuándo me lo podés instalar en mi negocio?"

antes incluso de que exista una versión completa con backend.

---

# Estado Actual

## Infraestructura

* Next.js funcionando
* TypeScript configurado
* Tailwind CSS funcionando
* Alias `@/` configurado
* Deploy futuro pensado para Vercel

---

## Arquitectura Actual

```text
src/
├── app/
├── components/
├── data/
│   └── products.ts
├── lib/
│   └── catalog/
│       └── getProductBySlug.ts
└── types/
    └── Product.ts
```

---

## Implementado

### Home

* Header responsive
* Buscador visible
* Categorías visibles
* Grid de productos

### Productos

* ProductCard reutilizable
* Responsive
* Mobile First
* Imagen cuadrada adaptativa

### Datos

* Productos mockeados
* Slugs definidos
* Tipo Product centralizado

### Navegación

* Ruta dinámica

```text
/producto/[slug]
```

* Navegación desde ProductCard
* Obtención de producto mediante slug

---

## Aprendizajes Clave

### Tipado

Existe una única fuente de verdad:

```ts
Product
```

Los componentes reutilizan ese tipo.

### Slugs

Siempre:

```text
minusculas
sin espacios
sin acentos
con guiones
```

Ejemplo:

```text
Botella Térmica Stanley
```

↓

```text
botella-termica-stanley
```

---

# Próximos Pasos

## Prioridad Alta

### Detalle de Producto

Crear página comercial completa:

* imagen principal
* nombre
* precio
* descripción
* categoría
* botón consultar

Objetivo:

```text
Home
↓
Producto
↓
Detalle
↓
Consulta
```

---

### Carrito de Consulta

No es un carrito de compra.

Debe permitir:

* agregar productos
* quitar productos
* conservar selección

Pensado para enviar consulta.

---

### WhatsApp

Generar mensaje automático:

```text
Hola, quisiera consultar por:

- Producto A
- Producto B
- Producto C
```

Abrir WhatsApp listo para enviar.

---

## Prioridad Media

### Productos Destacados

Sección:

* más vendidos
* promociones
* ofertas

---

### Categorías Reales

Ejemplos:

* Calzado
* Indumentaria
* Accesorios
* Tecnología

---

### Página de Categoría

Ejemplo:

```text
/categoria/calzado
```

---

## Prioridad Baja

### Panel Admin Demo

Versión fake.

Sin backend.

Objetivo:

* mostrar potencial
* editar JSON local
* agregar productos demo

---

### Animación Flip Card

Evaluar más adelante.

No aporta ventas directamente.

---

# Reglas del Proyecto

## Regla 1

Mobile First siempre.

Toda decisión debe pensarse primero para:

```text
celular
tablet
```

Desktop es secundario.

---

## Regla 2

Todo debe sentirse rápido.

Evitar:

* animaciones innecesarias
* librerías pesadas
* renders costosos

---

## Regla 3

Todo debe acercar al usuario a la consulta.

Si una funcionalidad no ayuda a:

```text
encontrar
seleccionar
consultar
```

queda fuera del MVP.

---

## Regla 4

La demo debe parecer un producto real.

No construir algo "para desarrolladores".

Construir algo que un comerciante pueda imaginar en su negocio.

---

## Regla 5

Preparar el camino para backend futuro.

Aunque hoy sea mock:

```text
products.ts
```

mañana debe poder reemplazarse por:

```text
NestJS
PostgreSQL
Prisma
```

sin reescribir el frontend.

---

## Regla 6

No convertir esto en un SaaS complejo.

Objetivo actual:

```text
vender instalaciones
```

No:

```text
crear una plataforma multi-tenant
```

---

## Regla 7

La demo vende.

La arquitectura acompaña.

Cuando exista conflicto entre:

* perfección técnica
* capacidad de venta

se prioriza la capacidad de venta.

---

## Regla 8

No agregar complejidad antes de que genere valor.

Mock > Backend
Demo > Admin
Venta > Optimización

Es decir, primero conseguimos una demo que impresione. Después vemos Mongo, PostgreSQL, Nest, Prisma, panel real, autenticación, etc.

# Meta de la Demo

Lograr que un cliente potencial navegue la aplicación y piense:

> "Esto mismo quiero para mi negocio."
