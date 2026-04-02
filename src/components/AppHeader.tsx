import { Menu, Send } from "lucide-react";

interface AppHeaderProps {
  onMenuToggle: () => void;
}

const AppHeader = ({ onMenuToggle }: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur border-b border-border/50">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="p-1 text-foreground hover:text-primary transition-colors">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Sayan-<span className="text-primary">IPTV</span>
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Send size={20} className="text-primary cursor-pointer hover:scale-110 transition-transform" />
      </div>
    </header>
  );
};

export default AppHeader;
