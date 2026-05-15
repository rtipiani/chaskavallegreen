import type { APIRoute } from 'astro';
import 'dotenv/config';

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const data = await request.json();
        const { email, password } = data;

        const adminEmail = process.env.ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD;

        if (email === adminEmail && password === adminPassword) {
            // Set a secure cookie for 1 day
            cookies.set('admin_session', 'authenticated', {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response(JSON.stringify({ success: false, message: 'Credenciales inválidas' }), { status: 401 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: 'Error en el servidor' }), { status: 500 });
    }
};
