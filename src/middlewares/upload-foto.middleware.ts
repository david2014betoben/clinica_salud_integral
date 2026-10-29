import type { Request, Response, NextFunction } from "express";
import multer from "multer";

const tiposPermitidos = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, archivo, callback) => {
    if (!tiposPermitidos.has(archivo.mimetype)) {
      callback(new Error("Selecciona una imagen JPG, PNG, WEBP o GIF"));
      return;
    }

    callback(null, true);
  },
}).single("foto");

export function uploadFotoPerfil(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  upload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const mensaje =
        error.code === "LIMIT_FILE_SIZE"
          ? "La imagen no puede superar los 5 MB"
          : "No se pudo recibir la imagen";

      res.status(400).json({ message: mensaje });
      return;
    }

    if (error) {
      res.status(400).json({
        message:
          error instanceof Error ? error.message : "Error al recibir la imagen",
      });
      return;
    }

    next();
  });
}
