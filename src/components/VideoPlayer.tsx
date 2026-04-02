import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import type { Channel } from "@/lib/m3u-parser";

interface VideoPlayerProps {
  channel: Channel;
  onBack: () => void;
}

const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hls-proxy`;
const API_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

class ProxyLoader extends Hls.DefaultConfig.loader {
  private referrer: string;

  constructor(config: any, referrer: string) {
    super(config);
    this.referrer = referrer;
  }

  load(context: any, config: any, callbacks: any) {
    const originalUrl = context.url;

    // Rewrite to proxy
    context.url = PROXY_URL;

    const origOnSuccess = callbacks.onSuccess;
    const origOnError = callbacks.onError;

    // We need to use fetch instead of XHR for POST with body
    const controller = new AbortController();
    const stats: any = { loaded: 0, total: 0, loading: { start: performance.now(), first: 0, end: 0 }, parsing: { start: 0, end: 0 }, buffering: { start: 0, end: 0, first: 0 }, aborted: false, retry: 0, chunkCount: 0, bwEstimate: 0 };

    this.stats = stats;

    const timeout = config.loadTimeout
      ? setTimeout(() => {
          controller.abort();
          callbacks.onTimeout(stats, context, null);
        }, config.loadTimeout)
      : null;

    fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY,
      },
      body: JSON.stringify({ url: originalUrl, referrer: this.referrer }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (timeout) clearTimeout(timeout);
        if (!response.ok) {
          throw new Error(`Proxy returned ${response.status}`);
        }

        stats.loading.first = performance.now();

        const contentType = response.headers.get('content-type') || '';
        let data: string | ArrayBuffer;

        if (contentType.includes('mpegurl') || contentType.includes('text') || originalUrl.endsWith('.m3u8')) {
          data = await response.text();
        } else {
          data = await response.arrayBuffer();
        }

        stats.loaded = typeof data === 'string' ? data.length : data.byteLength;
        stats.total = stats.loaded;
        stats.loading.end = performance.now();

        const responseObj = {
          url: originalUrl,
          data,
        };

        origOnSuccess(responseObj, stats, context, response);
      })
      .catch((error) => {
        if (timeout) clearTimeout(timeout);
        if (error.name === 'AbortError') return;
        origOnError({ code: 0, text: error.message }, context, null, stats);
      });

    this.abort = () => {
      if (timeout) clearTimeout(timeout);
      controller.abort();
    };
  }

  abort() {}
  destroy() {
    this.abort();
  }
}

const VideoPlayer = ({ channel, onBack }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setError(null);
    setLoading(true);

    if (Hls.isSupported()) {
      const referrer = channel.referrer || '';

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        loader: class extends Hls.DefaultConfig.loader {
          constructor(config: any) {
            super(config);
            return new ProxyLoader(config, referrer);
          }
        } as any,
      });

      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error('HLS Error:', data);
        if (data.fatal) {
          setLoading(false);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("Network error — stream may be offline or geo-restricted. Try another channel.");
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setError("Stream unavailable. The channel may be temporarily offline.");
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.url;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener("error", () => {
        setLoading(false);
        setError("Stream unavailable. Try another channel.");
      });
    } else {
      setLoading(false);
      setError("Your browser does not support HLS streaming.");
    }
  }, [channel.url, channel.referrer]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center gap-3 p-4 bg-card border-b border-border">
        <button onClick={onBack} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-semibold text-foreground truncate">{channel.name}</h2>
      </div>
      <div className="flex-1 flex items-center justify-center bg-muted relative">
        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <Loader2 size={40} className="text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Loading stream...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-6">
            <AlertTriangle size={40} className="text-destructive" />
            <p className="text-foreground text-center text-sm">{error}</p>
            <button
              onClick={onBack}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Go Back
            </button>
          </div>
        )}
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          className={`w-full max-h-full ${error ? 'opacity-0' : ''}`}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
