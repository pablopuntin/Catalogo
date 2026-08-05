# Catálogo Digital para Negocios - Frontend

## Descripción

Este proyecto corresponde al frontend del **Catálogo Digital para Negocios**, una aplicación web orientada a pequeños y medianos comercios que permite publicar un catálogo de productos y administrarlo mediante un panel integrado.

El objetivo del proyecto es ofrecer una experiencia rápida, intuitiva y profesional tanto para los clientes finales como para los comerciantes que administran su catálogo.

Este sistema está pensado para **implementaciones personalizadas** y no para una plataforma SaaS multi-tenant.

---

# Objetivos

El frontend debe permitir que un usuario pueda:

- navegar el catálogo;
- buscar productos;
- filtrar por categorías;
- visualizar el detalle de cada producto;
- generar consultas mediante WhatsApp.

El mismo proyecto también incluirá el panel administrativo utilizado por los comerciantes para gestionar el contenido del catálogo.

---

# Filosofía del Proyecto

Las decisiones de desarrollo deberán respetar los siguientes principios:

- Mobile First.
- Simplicidad.
- Rapidez de navegación.
- Componentes reutilizables.
- Escalabilidad progresiva.
- Experiencia de usuario por encima de la complejidad técnica.

Cuando exista un conflicto entre una solución técnicamente compleja y una solución simple de mantener, se priorizará la segunda.

---

# Tecnologías

- Next.js
- React
- TypeScript
- Tailwind CSS

---

# Arquitectura

La aplicación se encuentra organizada en módulos simples y desacoplados.

El frontend está preparado para consumir datos mock durante el desarrollo y posteriormente reemplazarlos por una API REST sin modificar la interfaz de usuario.

Toda la información relacionada con la arquitectura se documenta en:

```
docs/architecture.md
```

Las decisiones técnicas importantes se registran en:

```
docs/decisions.md
```

---

# Estado del Proyecto

Actualmente el frontend constituye la interfaz pública del producto.

Su evolución contempla incorporar progresivamente:

- panel administrativo;
- autenticación;
- integración con backend;
- carga dinámica de productos;
- gestión de imágenes;
- administración de usuarios.

Estas funcionalidades deberán incorporarse manteniendo la experiencia de usuario y evitando reescrituras importantes.

---

# Objetivo Comercial

El objetivo del producto es que un comerciante pueda utilizarlo diariamente para administrar su catálogo y que un potencial cliente perciba una solución profesional lista para implementar en su negocio.