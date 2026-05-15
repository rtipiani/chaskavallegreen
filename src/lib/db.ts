import postgres from 'postgres';
import 'dotenv/config';

// Intentamos obtener la URL de varias formas para máxima compatibilidad
const connectionString = process.env.DATABASE_URL || import.meta.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("La variable de entorno DATABASE_URL no está definida en el archivo .env");
}

const sql = postgres(connectionString);

export default sql;
