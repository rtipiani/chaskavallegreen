import type { APIRoute } from 'astro';
import sql from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
    // Basic session check
    const session = cookies.get('admin_session');
    if (!session || session.value !== 'authenticated') {
        return new Response(JSON.stringify({ success: false, message: 'No autorizado' }), { status: 401 });
    }

    try {
        const data = await request.json();
        const { id, nombre, precio, descripcion } = data;

        if (!id) {
            return new Response(JSON.stringify({ success: false, message: 'ID faltante' }), { status: 400 });
        }

        await sql`
            UPDATE habitaciones 
            SET nombre = ${nombre}, precio = ${precio}, descripcion = ${descripcion}
            WHERE id = ${id}
        `;

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: 'Error en el servidor' }), { status: 500 });
    }
};
