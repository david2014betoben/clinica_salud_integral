import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import prisma from "../config/prisma.js";
import { perfilSchema } from "../schemas/validate-perfil.js";

const carpetaFotos = path.resolve("uploads/perfiles");

const extensiones: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function esErrorPrisma(error: unknown): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
}

async function borrarArchivo(ruta: string): Promise<void> {
  try {
    await unlink(ruta);
  } catch (error: unknown) {
    console.error("No se pudo eliminar el archivo:", error);
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    res.status(201).json(user);
  } catch {
    res.status(500).json({
      message: "Error al registrar el usuario",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Ingresa tu correo y contraseña",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "La autenticación no está configurada",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: "8h" },
    );

    return res.json({
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre ?? user.email,
        email: user.email,
        rol: user.role,
        telefono: user.telefono,
        foto: user.foto,
      },
    });
  } catch {
    return res.status(500).json({
      message: "Error al iniciar sesión",
    });
  }
}

export async function actualizarPerfil(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      message: "Debes iniciar sesión",
    });
  }

  const resultado = perfilSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({
      message:
        resultado.error.issues[0]?.message ?? "Revisa los datos del perfil",
    });
  }

  let rutaNuevaFoto: string | null = null;
  let perfilGuardado = false;

  try {
    const usuarioActual = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!usuarioActual) {
      return res.status(401).json({
        message: "El usuario ya no existe",
      });
    }

    const { nombre, email, telefono } = resultado.data;

    const correoOcupado = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (correoOcupado && correoOcupado.id !== req.user.id) {
      return res.status(409).json({
        message: "El correo ya está registrado en otra cuenta",
      });
    }

    let foto = usuarioActual.foto;

    if (req.file) {
      const extension = extensiones[req.file.mimetype];

      if (!extension) {
        return res.status(400).json({
          message: "El formato de imagen no está permitido",
        });
      }

      await mkdir(carpetaFotos, { recursive: true });

      const nombreArchivo = `${randomUUID()}${extension}`;

      rutaNuevaFoto = path.join(carpetaFotos, nombreArchivo);

      await writeFile(rutaNuevaFoto, req.file.buffer);

      foto = `/uploads/perfiles/${nombreArchivo}`;
    }

    const usuario = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        nombre,
        email,
        foto,
        ...(telefono !== undefined && {
          telefono: telefono || null,
        }),
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        telefono: true,
        foto: true,
      },
    });

    perfilGuardado = true;

    if (req.file && usuarioActual.foto?.startsWith("/uploads/perfiles/")) {
      const rutaAnterior = path.join(
        carpetaFotos,
        path.basename(usuarioActual.foto),
      );

      await borrarArchivo(rutaAnterior);
    }

    return res.status(200).json({
      message: "Perfil actualizado",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre ?? usuario.email,
        email: usuario.email,
        rol: usuario.role,
        telefono: usuario.telefono,
        foto: usuario.foto,
      },
    });
  } catch (error: unknown) {
    console.error(error);

    if (esErrorPrisma(error) && error.code === "P2002") {
      return res.status(409).json({
        message: "El correo ya está registrado en otra cuenta",
      });
    }

    return res.status(500).json({
      message: "Error al actualizar el perfil",
    });
  } finally {
    if (rutaNuevaFoto && !perfilGuardado) {
      await borrarArchivo(rutaNuevaFoto);
    }
  }
}
