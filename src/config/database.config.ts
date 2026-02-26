import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
  host: process.env.DEV_DB_HOST,
  port: parseInt(process.env.DEV_DB_PORT ?? '3306', 10),
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  name: process.env.DEV_DB_NAME
}))