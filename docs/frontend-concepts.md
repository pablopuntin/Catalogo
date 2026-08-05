# Conceptos de Arquitectura del Frontend

Este documento reúne los conceptos fundamentales utilizados durante el desarrollo del frontend.

Su objetivo es documentar el motivo detrás de las decisiones tomadas, de manera que cualquier desarrollador pueda comprender la arquitectura del proyecto sin depender del contexto de conversaciones anteriores.

---

# La responsabilidad del Frontend

El frontend tiene una única responsabilidad principal:

Mostrar información al usuario y permitir su interacción con el sistema.

El frontend no implementa reglas de negocio.

Las reglas de negocio pertenecen al backend.

---

# ¿Qué es un fetch?

`fetch()` es el mecanismo mediante el cual el frontend realiza una petición HTTP a la API.

Por ejemplo:

```ts
fetch("/api/products")
```

No consulta la base de datos.

No ejecuta lógica de negocio.

Simplemente envía una solicitud al backend y espera una respuesta.

El flujo completo es el siguiente.

```
Frontend

↓

fetch()

↓

REST API

↓

NestJS

↓

Service

↓

Prisma

↓

PostgreSQL

↓

JSON

↓

Frontend
```

El frontend nunca accede directamente a la base de datos.

Siempre se comunica con la API.

---

# ¿Por qué no usamos fetch() directamente en los componentes?

Aunque técnicamente es posible escribir:

```tsx
const response = await fetch("/api/products");
```

dentro de un componente, este proyecto decide no hacerlo.

La razón es mantener una separación clara de responsabilidades.

Los componentes deben encargarse únicamente de la interfaz de usuario.

La comunicación con la API pertenece a otra capa.

---

# El rol de los Services

Toda comunicación con la API se realiza mediante Services.

Ejemplo.

```
ProductGrid

↓

ProductService

↓

fetch()

↓

API
```

El componente simplemente solicita los datos.

```ts
const products = await ProductService.getAll();
```

No necesita conocer:

- la URL;
- el método HTTP;
- los headers;
- el token;
- el formato de la respuesta.

Toda esa responsabilidad pertenece al Service.

---

# Beneficios de utilizar Services

## Centralización

Todos los fetch relacionados con un mismo dominio se encuentran en un único lugar.

Por ejemplo.

```
ProductService
```

contendrá toda la comunicación relacionada con productos.

---

## Mantenimiento

Si cambia una URL.

Por ejemplo.

```
/api/products
```

↓

```
/api/v2/products
```

solamente será necesario modificar el Service.

Los componentes permanecerán sin cambios.

---

## Autenticación

Si en el futuro todas las solicitudes requieren enviar un JWT.

Por ejemplo.

```
Authorization: Bearer <token>
```

la modificación se realizará únicamente dentro del Service.

Los componentes seguirán funcionando exactamente igual.

---

## Reutilización

Distintos componentes pueden reutilizar el mismo Service.

Por ejemplo.

```
Home

↓

ProductService.getAll()
```

```
Productos Destacados

↓

ProductService.getFeatured()
```

```
Panel Administrativo

↓

ProductService.getAll()
```

Todos utilizan la misma lógica de comunicación.

---

# Qué conoce cada capa

## Componentes

Los componentes conocen únicamente la interfaz.

Por ejemplo.

- mostrar productos;
- abrir un modal;
- responder a un clic;
- renderizar una tabla.

No conocen cómo se obtienen los datos.

---

## Services

Los Services conocen únicamente la comunicación con la API.

Por ejemplo.

- realizar fetch;
- enviar parámetros;
- enviar tokens;
- interpretar respuestas;
- devolver datos tipados.

No contienen lógica visual.

---

## Backend

El backend conoce la lógica del negocio.

Por ejemplo.

- autenticación;
- autorización;
- reglas comerciales;
- validaciones;
- acceso a la base de datos.

El frontend nunca reemplaza estas responsabilidades.

---

# Validaciones

Las validaciones existen en dos niveles.

## Frontend

Su objetivo es mejorar la experiencia del usuario.

Ejemplos.

- formato de correo electrónico;
- longitud mínima de contraseña;
- números de teléfono;
- documentos;
- campos obligatorios.

Estas validaciones evitan solicitudes innecesarias al servidor.

---

## Backend

Todas las validaciones importantes se realizan nuevamente.

Incluyen.

- autenticación;
- permisos;
- reglas de negocio;
- consistencia de datos;
- integridad de la información.

Las validaciones del frontend nunca reemplazan las del backend.

---

# Flujo general del sistema

```
Usuario

↓

Componente

↓

Service

↓

fetch()

↓

REST API

↓

Controller

↓

Service (NestJS)

↓

Prisma

↓

PostgreSQL

↓

JSON

↓

Service (Frontend)

↓

Componente

↓

Usuario
```

Cada capa tiene una única responsabilidad.

Esta separación facilita el mantenimiento, mejora la reutilización del código y permite que el sistema evolucione sin afectar componentes que no deberían modificarse.

---

# Regla del proyecto

Toda comunicación con la API deberá realizarse exclusivamente mediante los Services.

Los componentes nunca deberán ejecutar `fetch()` directamente.

Esta decisión mantiene la arquitectura simple, consistente y preparada para crecer.