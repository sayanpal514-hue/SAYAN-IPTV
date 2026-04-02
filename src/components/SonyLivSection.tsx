import { useState, useEffect, useMemo } from "react";
import { Search, ExternalLink } from "lucide-react";
import { fetchAndParseM3U, type Channel } from "@/lib/m3u-parser";
import ChannelCard from "@/components/ChannelCard";
import CategoryFilter from "@/components/CategoryFilter";

const SONYLIV_PLAYLIST_URL =
  "https://raw.githubusercontent.com/drmlive/sliv-live-events/refs/heads/main/sonyliv.m3u";

const SONYLIV_REPO = "https://github.com/drmlive/sliv-live-events";

interface SonyLivSectionProps {
  onPlay: (channel: Channel) => void;
}

const SonyLivSection = ({ onPlay }: SonyLivSectionProps) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchAndParseM3U(SONYLIV_PLAYLIST_URL)
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

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          🎬 Sony Liv
        </h2>
        <a
          href={SONYLIV_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Source <ExternalLink size={12} />
        </a>
      </div>
      <p className="text-muted-foreground text-sm">
        {channels.length} channels available • Tap to watch
      </p>

      <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search Sony Liv channels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-input rounded-lg text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-glow rounded-lg bg-card h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((ch) => (
            <ChannelCard key={`sony-${ch.id}`} channel={ch} onClick={onPlay} />
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No Sony Liv channels found</p>
      )}
    </section>
  );
};

export default SonyLivSection;
