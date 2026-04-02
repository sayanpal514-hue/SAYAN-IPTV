import { X, Heart, ListMusic } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-bold text-sidebar-foreground">
            Sayan-<span className="text-sidebar-primary">IPTV</span>
          </h2>
          <button onClick={onClose} className="text-sidebar-foreground hover:text-sidebar-primary transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="px-2">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <ListMusic size={20} />
            <span>My Playlist</span>
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <Heart size={20} />
            <span>Favorites</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
