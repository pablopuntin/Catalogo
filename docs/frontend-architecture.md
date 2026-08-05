# Arquitectura del Frontend

## Introducción

Este documento describe la arquitectura del frontend del proyecto.

Su objetivo es definir una estructura clara, simple y escalable que permita evolucionar el sistema sin perder mantenibilidad ni consistencia.

La arquitectura del frontend complementa lo definido en `architecture.md` y respeta los principios establecidos en `principles.md` y las decisiones registradas en `decisions.md`.

---

# Objetivos

La arquitectura del frontend busca cumplir los siguientes objetivos:

- ofrecer una experiencia rápida e intuitiva;
- mantener una separación clara de responsabilidades;
- facilitar la reutilización de componentes;
- centralizar la comunicación con la API;
- minimizar el acoplamiento entre módulos;
- permitir la incorporación de nuevas funcionalidades sin reestructurar el proyecto.

---

# Responsabilidad del Frontend

El frontend tiene una única responsabilidad:

> Construir la mejor experiencia posible para el usuario utilizando la información provista por la API.

Para cumplir este objetivo, el frontend será responsable de:

- mostrar la información al usuario;
- gestionar la navegación;
- administrar el estado visual;
- validar datos para mejorar la experiencia de uso;
- consumir la API del backend;
- adaptar la interfaz según el contexto del usuario.

El frontend **no será responsable** de:

- implementar reglas de negocio;
- validar permisos;
- decidir autorizaciones;
- acceder directamente a la base de datos;
- duplicar lógica existente en el backend.

Toda regla de negocio deberá vivir exclusivamente en el backend.

---

# Organización General

El proyecto se organizará de la siguiente manera.

```text
src/
│
├── app/
├── components/
├── features/
├── services/
├── hooks/
├── types/
├── config/
└── lib/
```

Cada carpeta tendrá una responsabilidad específica.

---

# App

La carpeta `app` contendrá las rutas de la aplicación utilizando App Router de Next.js.

Ejemplo.

```text
/

producto/[slug]

categoria/[slug]

login

admin
```

Su responsabilidad será únicamente definir la navegación y componer las pantallas.

No deberá contener lógica de negocio.

---

# Components

La carpeta `components` contendrá componentes reutilizables.

Ejemplos.

```text
Button

Card

Modal

Input

ProductCard

ProductGallery

Header

Footer
```

Los componentes deberán ser reutilizables y desacoplados.

Su responsabilidad será representar la interfaz.

No deberán conocer cómo se obtienen los datos.

---

# Features

La carpeta `features` agrupará la lógica funcional del sistema.

Ejemplo.

```text
catalog/

authentication/

cart/

products/

categories/

settings/
```

Cada Feature será responsable de coordinar el comportamiento de un dominio funcional.

Esto facilita el crecimiento del proyecto sin mezclar responsabilidades.

---

# Services

Los Services serán el único punto de comunicación entre el frontend y la API.

Toda llamada HTTP deberá realizarse desde un Service.

Ejemplo.

```text
ProductService

CategoryService

AuthService

SettingsService
```

Los componentes nunca deberán realizar llamadas HTTP directamente.

---

# ¿Por qué utilizar Services?

Centralizar la comunicación con la API aporta múltiples beneficios.

Permite:

- reutilizar llamadas desde distintos componentes;
- modificar endpoints en un único lugar;
- simplificar el mantenimiento;
- desacoplar la interfaz de la implementación del backend;
- facilitar pruebas y futuras refactorizaciones.

Los componentes únicamente solicitan información al Service correspondiente.

No necesitan conocer cómo se obtiene.

---

# Flujo de una consulta

Toda consulta seguirá el siguiente flujo.

```text
Usuario

↓

Componente

↓

Service

↓

fetch()

↓

API REST

↓

Backend
```

La respuesta recorrerá el camino inverso.

```text
Backend

↓

JSON

↓

Service

↓

Componente

↓

Usuario
```

De esta manera toda la comunicación queda centralizada.

---

# Comunicación con la API

El frontend siempre consumirá la API.

Nunca accederá directamente a la base de datos.

Nunca utilizará Prisma.

Nunca implementará lógica propia para reemplazar decisiones del backend.

Toda comunicación utilizará los Services.

Ejemplo.

```text
ProductPage

↓

ProductService

↓

GET /products

↓

Backend
```

Otro ejemplo.

```text
LoginForm

↓

AuthService.login()

↓

POST /auth/login

↓

Backend

↓

JWT
```

---

# Fetch

El método `fetch()` representa el mecanismo mediante el cual el frontend realiza solicitudes HTTP hacia la API.

Puede utilizarse para:

- obtener productos;
- iniciar sesión;
- actualizar información;
- eliminar registros;
- crear nuevos recursos.

Los componentes no deberían invocar `fetch()` directamente.

Siempre deberán hacerlo a través del Service correspondiente.

---

# Hooks

Los Hooks encapsularán comportamiento reutilizable.

Ejemplos.

```text
useAuth

useCart

useProducts

useCategories
```

Su objetivo será reutilizar lógica relacionada con React.

No deberán contener reglas de negocio.

---

# Types

La carpeta `types` contendrá todos los tipos compartidos.

Ejemplos.

```text
Product

Category

Promotion

User

Order
```

Esto evita duplicaciones y mejora el tipado del proyecto.

---

# Config

La carpeta `config` contendrá únicamente configuraciones propias del frontend.

Por ejemplo.

- constantes;
- variables de entorno;
- configuración de rutas;
- configuración de la aplicación.

No almacenará datos propios del negocio.

La información del negocio siempre provendrá del backend.

---

# Lib

La carpeta `lib` contendrá funciones auxiliares reutilizables.

Ejemplos.

- formatCurrency();
- generateWhatsAppMessage();
- formatDate();
- slugify();

No contendrá lógica de negocio.

---

# Validaciones

El frontend deberá validar toda la información que mejore la experiencia del usuario.

Por ejemplo.

- campos obligatorios;
- formato de correo electrónico;
- longitud mínima de contraseña;
- sólo números en teléfonos;
- formatos permitidos de imágenes;
- tamaño máximo de archivos.

Estas validaciones tienen como objetivo ofrecer respuestas inmediatas al usuario.

No reemplazan las validaciones del backend.

Toda información recibida por la API deberá volver a validarse en el servidor.

---

# Estado de la Aplicación

El estado deberá mantenerse lo más simple posible.

Se priorizará el uso del estado local de React.

Sólo cuando aparezca una necesidad concreta se incorporarán soluciones de estado global.

No se agregará complejidad antes de que genere valor.

---

# Manejo de Errores

Los errores deberán presentarse de forma clara para el usuario.

Siempre que sea posible:

- indicar el problema;
- explicar cómo resolverlo;
- evitar mensajes técnicos.

Los errores provenientes del backend deberán transformarse en mensajes comprensibles.

---

# Rendimiento

El frontend deberá priorizar:

- tiempos de carga reducidos;
- componentes reutilizables;
- renderizados innecesarios mínimos;
- carga progresiva cuando sea necesaria.

Toda optimización deberá justificarse por una necesidad real.

---

# Seguridad

El frontend mejorará la experiencia ocultando acciones que el usuario no puede realizar.

Sin embargo, esa ocultación nunca constituirá una medida de seguridad.

Toda autorización será validada nuevamente por el backend.

---

# Escalabilidad

La estructura deberá permitir incorporar progresivamente nuevos módulos.

Por ejemplo.

- autenticación;
- clientes;
- pedidos;
- carrito de compras;
- pagos;
- métricas;
- notificaciones.

Estas funcionalidades deberán integrarse reutilizando la organización existente.

---

# Principios Arquitectónicos

Toda evolución del frontend deberá respetar los siguientes criterios.

- una única aplicación;
- una única fuente de datos mediante la API;
- separación clara de responsabilidades;
- componentes reutilizables;
- Services como único acceso a la API;
- frontend desacoplado de la lógica de negocio;
- Mobile First;
- simplicidad antes que complejidad;
- crecimiento progresivo.

---

# Evolución

La arquitectura del frontend no fue diseñada únicamente para el MVP del catálogo.

Su propósito es servir como base para futuras versiones del producto.

A medida que el sistema incorpore autenticación, clientes, pedidos, pagos, métricas o nuevas funcionalidades, estas deberán integrarse respetando la organización existente y reutilizando los componentes y servicios ya definidos.

De esta manera, el crecimiento del proyecto será progresivo, manteniendo una arquitectura simple, consistente y fácil de mantener.