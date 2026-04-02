import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import ChannelCard from "@/components/ChannelCard";
import CategoryFilter from "@/components/CategoryFilter";
import VideoPlayer from "@/components/VideoPlayer";
import { fetchAndParseM3U, type Channel } from "@/lib/m3u-parser";
import SonyLivSection from "@/components/SonyLivSection";

const PLAYLIST_URL =
  "https://raw.githubusercontent.com/siam3310/crichdmini/refs/heads/main/siamscrichd.m3u";

const Index = () => {
  const [tab, setTab] = useState<"home" | "channels" | "iptv">("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [playing, setPlaying] = useState<Channel | null>(null);

  useEffect(() => {
    fetchAndParseM3U(PLAYLIST_URL)
      .then(setChannels)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(channels.map((c) => c.group))].sort(),
    [channels]
  );

  const filtered = useMemo(() => {
    let list = channels;
    if (activeCategory !== "All") list = list.filter((c) => c.group === activeCategory);
    if (search) list = list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [channels, activeCategory, search]);

  if (playing) {
    return <VideoPlayer channel={playing} onBack={() => setPlaying(null)} />;
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <AppHeader onMenuToggle={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="p-4 space-y-4">
        {/* Home tab */}
        {tab === "home" && (
          <>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              📺 Live Channels
            </h2>
            <p className="text-muted-foreground text-sm">
              {channels.length} channels available • Tap to watch
            </p>
            <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search channels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-input rounded-lg text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            {loading ? (
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="card-glow rounded-lg bg-card h-32 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {filtered.map((ch) => (
                  <ChannelCard key={ch.id} channel={ch} onClick={setPlaying} />
                ))}
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No channels found</p>
            )}

            {/* Sony Liv Section */}
            <div className="border-t border-border pt-6 mt-6">
              <SonyLivSection onPlay={setPlaying} />
            </div>
          </>
        )}

        {/* Channels tab */}
        {tab === "channels" && (
          <>
            <h2 className="text-xl font-bold text-foreground">⚡ Channels</h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search channels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-input rounded-lg text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
            <div className="grid grid-cols-3 gap-3">
              {filtered.map((ch) => (
                <ChannelCard key={ch.id} channel={ch} onClick={setPlaying} />
              ))}
            </div>
          </>
        )}

        {/* IPTV tab */}
        {tab === "iptv" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">📡 IPTV Channels</h2>
              <span className="text-sm text-muted-foreground">{channels.length} channels</span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search channels..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-input rounded-lg text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
            <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
            <div className="grid grid-cols-3 gap-3">
              {filtered.map((ch) => (
                <ChannelCard key={ch.id} channel={ch} onClick={setPlaying} />
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav active={tab} onChange={(t) => { setTab(t); setSearch(""); setActiveCategory("All"); }} />
    </div>
  );
};

export default Index;
