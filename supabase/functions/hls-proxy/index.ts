import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, referrer } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'Missing url' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    if (referrer) {
      headers['Referer'] = referrer;
      headers['Origin'] = new URL(referrer).origin;
    }

    const response = await fetch(url, { headers });

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const body = await response.arrayBuffer();

    // If it's an HLS manifest, rewrite URLs to go through the proxy
    if (contentType.includes('mpegurl') || url.endsWith('.m3u8')) {
      let text = new TextDecoder().decode(body);
      const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

      // Rewrite relative URLs in the manifest
      text = text.replace(/^(?!#)(.+\.(?:m3u8|ts).*)$/gm, (match) => {
        if (match.startsWith('http')) return match;
        return baseUrl + match;
      });

      return new Response(text, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(body, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
