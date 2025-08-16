import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { Cat, Heart } from "lucide-react";
import { useSelector } from "react-redux";

interface HeaderProps {
  currentView: "random" | "breeds" | "favorites";
  onViewChange: (view: "random" | "breeds" | "favorites") => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const favoritesCount = useSelector(
    (state: RootState) => state.favorites.favorites.length
  );

  const navItems = [
    { id: "random" as const, label: "Random Cats", icon: null },
    { id: "breeds" as const, label: "Breeds", icon: null },
    {
      id: "favorites" as const,
      label: "Favorites",
      icon: <Heart className="w-4 h-4 text-red-500" />,
      badge: favoritesCount,
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Cat className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-slate-800">CatLover</h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-1",
                  currentView === item.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full ml-1">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* mobile navigation */}
      <div className="md:hidden border-t border-slate-200 bg-white">
        <div className="px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-between",
                currentView === item.id
                  ? "text-primary bg-primary/10"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              <span className="flex items-center space-x-2">
                {item.icon}
                <span>{item.label}</span>
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
