import { neon } from '@neondatabase/serverless';

const sql = async (strings: any, ...values: any[]) => {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
        throw new Error("La variable DATABASE_URL no está configurada en Vercel.");
    }

    const query = neon(connectionString);
    return query(strings, ...values);
};

export default sql;
