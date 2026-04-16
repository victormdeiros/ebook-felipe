/**
 * MinIO / S3-compatible storage helper
 * Usado para upload do e-book PDF e geração de URL de download.
 */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config";

const BUCKET = "ebook-manual";

function getClient(): S3Client {
  return new S3Client({
    endpoint: config.MINIO_ENDPOINT,
    region: config.MINIO_REGION,
    credentials: {
      accessKeyId: config.MINIO_ACCESS_KEY,
      secretAccessKey: config.MINIO_SECRET_KEY,
    },
    forcePathStyle: true, // obrigatório para MinIO
  });
}

/**
 * Faz upload de um Buffer para o MinIO.
 * Retorna a URL pública permanente (sem expiração).
 */
export async function uploadEbook(
  buffer: Buffer,
  originalName: string,
): Promise<string> {
  const s3 = getClient();
  const key = `ebook/${Date.now()}-${originalName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "application/pdf",
      // Torna o objeto publicamente legível
      ACL: "public-read",
    }),
  );

  // URL pública direta (MinIO expõe objetos públicos neste formato)
  const base = config.MINIO_ENDPOINT.replace(/\/$/, "");
  return `${base}/${BUCKET}/${key}`;
}

/**
 * Gera URL pré-assinada (expira em 7 dias) para um objeto já existente.
 * Útil se o bucket não for público.
 */
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const s3 = getClient();
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: 60 * 60 * 24 * 7 },
  );
}
