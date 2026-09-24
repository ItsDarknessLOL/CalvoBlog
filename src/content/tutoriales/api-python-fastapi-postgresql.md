---
title: "Tu primera API con Python, FastAPI y PostgreSQL"
description: "Una ruta inicial para levantar una API pequeña y entender dónde viven la aplicación, la base de datos y la configuración."
publishedAt: 2026-09-24
category: "Backend"
tags: [python, fastapi, postgresql]
level: "Intermedio"
readingTime: "12 min"
draft: false
---

## Antes de empezar

Necesitas Python instalado y una instancia de PostgreSQL que controles. No copies contraseñas dentro del código ni las subas al repositorio.

> **Nota:** esta guía presenta una estructura inicial. Ajusta versiones, permisos y configuración según tu entorno antes de usarla en producción.

## Crea un entorno aislado

Cada proyecto debe tener sus propias dependencias:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn psycopg[binary]
```

## Define un endpoint de verificación

Empieza por comprobar que la aplicación responde antes de conectar una base de datos:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}
```

Ejecuta el servidor con `uvicorn main:app --reload` y visita `/health`. Cuando esa respuesta funcione, añade configuración y una conexión parametrizada a PostgreSQL.

## Siguiente paso

Guarda la URL de conexión en una variable de entorno y utiliza un usuario de base de datos con permisos mínimos. Después añade pruebas para cada endpoint antes de desplegar.
