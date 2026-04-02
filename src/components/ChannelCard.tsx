import { Heart } from "lucide-react";
import type { Channel } from "@/lib/m3u-parser";

interface ChannelCardProps {
  channel: Channel;
  onClick: (channel: Channel) => void;
}

const ChannelCard = ({ channel, onClick }: ChannelCardProps) => {
  const initial = channel.name.charAt(0).toUpperCase();

  return (
    <button
      onClick={() => onClick(channel)}
      className="card-glow rounded-lg bg-card p-3 flex flex-col items-center gap-2 transition-all hover:scale-[1.03] active:scale-[0.98] relative group"
    >
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-live/90 text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
        <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground animate-pulse-live" />
        LIVE
      </div>
      <Heart
        size={16}
        className="absolute top-2 right-2 text-muted-foreground group-hover:text-primary transition-colors cursor-pointer"
      />
      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden mt-4">
        {channel.logo ? (
          <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain" loading="lazy" />
        ) : (
          <span className="text-2xl font-bold text-muted-foreground">{initial}</span>
        )}
      </div>
      <span className="text-sm font-medium text-card-foreground truncate w-full text-center">
        {channel.name}
      </span>
    </button>
  );
};

export default ChannelCard;
