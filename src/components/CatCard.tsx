import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { toggleFavorite } from "../store/favoritesSlice";
import { CatEntity } from "../models/Cat.model";
import { cn } from "@/lib/utils";

interface CatCardProps {
  cat: CatEntity;
  onClick: () => void;
  className?: string;
}

export function CatCard({ cat, onClick, className }: CatCardProps) {
  const dispatch = useDispatch();
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const isFavorite = favorites.some((fav) => fav.id === cat.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(cat));
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      <img
        src={cat.url}
        alt={"Beautiful cat"}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-slate-800">A Beautiful cat</h3>
            <p className="text-sm text-slate-500">{cat.id}</p>
          </div>
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "transition-all duration-200 hover:scale-110",
              isFavorite ? "text-red-500" : "text-slate-300 hover:text-red-500"
            )}
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
