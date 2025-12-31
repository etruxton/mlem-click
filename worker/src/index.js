const RATE_LIMIT_MAX = 500;
const RATE_LIMIT_WINDOW_SECONDS = 60;

export default {
    async fetch(request, env, _ctx) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': 'https://mlem.click',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        const url = new URL(request.url);

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            if (url.pathname === '/api/count' && request.method === 'GET') {
                return await handleGetCount(env, corsHeaders);
            }

            if (url.pathname === '/api/click' && request.method === 'POST') {
                return await handleClick(request, env, corsHeaders);
            }

            return new Response(JSON.stringify({ error: 'Not found' }), {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ error: 'Internal server error' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
    },
};

async function handleGetCount(env, corsHeaders) {
    const result = await env.DB.prepare('SELECT total FROM clicks WHERE id = 1').first();
    const count = result?.total || 0;
    return new Response(JSON.stringify({ count }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

async function handleClick(request, env, corsHeaders) {
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

    const rateLimitKey = `rate:${clientIP}`;
    const currentCount = parseInt((await env.MLEM_KV.get(rateLimitKey)) || '0', 10);

    if (currentCount >= RATE_LIMIT_MAX) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const { token, count = 1 } = body;

    if (!token) {
        return new Response(JSON.stringify({ error: 'Missing token' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const clickCount = Math.min(Math.max(1, parseInt(count, 10) || 1), 100);

    const turnstileValid = await validateTurnstile(token, clientIP, env);

    if (!turnstileValid) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    await env.MLEM_KV.put(rateLimitKey, String(currentCount + clickCount), {
        expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
    });

    const result = await env.DB.prepare(
        'UPDATE clicks SET total = total + ? WHERE id = 1 RETURNING total'
    )
        .bind(clickCount)
        .first();
    const newTotal = result?.total || 0;

    return new Response(JSON.stringify({ count: newTotal, success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

async function validateTurnstile(token, ip, env) {
    const formData = new FormData();
    formData.append('secret', env.TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    formData.append('remoteip', ip);

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        return result.success === true;
    } catch (error) {
        console.error('Turnstile validation error:', error);
        return false;
    }
}
