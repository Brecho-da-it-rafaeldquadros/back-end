import { EncryptionTransformer } from "typeorm-encrypted";
import "dotenv/config"

export const MyCrypto = new EncryptionTransformer({
  key: process.env.CRYPTO_KEY,
  algorithm: process.env.CRYPTO_ALGORITHM,
  ivLength: 16,
  iv: process.env.CRYPTO_IV,
});
