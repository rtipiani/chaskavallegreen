import { neon } from '@neondatabase/serverless';

export function getDb() {
    const connectionString = import.meta.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL no está configurada.");
    }
    return neon(connectionString);
}

export default getDb;
