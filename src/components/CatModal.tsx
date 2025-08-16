import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Heart, Share2, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { toggleFavorite } from "../store/favoritesSlice";
import { CatEntity } from "../models/Cat.model";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CatModalProps {
  cat: CatEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onViewBreed?: (breedId: string) => void;
}

export function CatModal({ cat, isOpen, onClose, onViewBreed }: CatModalProps) {
  const dispatch = useDispatch();
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  if (!cat) return null;

  const breed = cat.breeds?.[0];

  const isFavorite = favorites.some((fav) => fav.id === cat.id);

  const handleFavoriteClick = () => {
    dispatch(toggleFavorite(cat));
    const title = isFavorite ? "Removed from favorites" : "Added to favorites";
    toast(title);
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?cat=${cat.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast("Shareable link copied to clipboard!");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[95vh] overflow-hidden p-0"
        aria-describedby="cat-modal-description"
      >
        <DialogHeader className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-800">
                {breed?.name || "Beautiful Cat"}
              </DialogTitle>
              <p className="text-slate-500" id="cat-modal-description">
                Cat ID: {cat.id}
              </p>
              <p className="text-slate-500" id="cat-modal-description">
                {breed?.description ||
                  "View detailed information about this beautiful cat."}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteClick}
                className={cn(
                  "transition-colors",
                  isFavorite
                    ? "text-red-500 hover:text-red-600"
                    : "text-slate-400 hover:text-red-500"
                )}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-140px)]">
          <div className="lg:w-2/3 p-6">
            <img
              src={cat.url}
              alt={breed?.name || "Beautiful cat"}
              className="w-full h-auto rounded-xl shadow-lg object-cover max-h-[500px]"
            />
          </div>

          <div className="lg:w-1/3 p-6 bg-slate-50 overflow-y-auto">
            <div className="space-y-6">
              {breed && (
                <div>
                  <h3 className="font-semibold text-lg text-slate-800 mb-3">
                    Breed Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-slate-600">
                        Origin
                      </Label>
                      <p className="text-slate-800">{breed.origin}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600">
                        Life Span
                      </Label>
                      <p className="text-slate-800">{breed.life_span} years</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600">
                        Weight
                      </Label>
                      <p className="text-slate-800">{breed.weight.metric} kg</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600">
                        Temperament
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {breed.temperament.split(", ").map((trait, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600">
                        Description
                      </Label>
                      <p className="text-slate-800 text-sm leading-relaxed">
                        {breed.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-lg text-slate-800 mb-3">
                  Save to Favorites
                </h3>
                <div className="space-y-4">
                  <Button
                    onClick={handleFavoriteClick}
                    className={cn(
                      "w-full",
                      isFavorite
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-red-500 hover:bg-red-600"
                    )}
                  >
                    <Heart
                      className="w-4 h-4 mr-2"
                      fill={isFavorite ? "currentColor" : "none"}
                    />
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </div>
              </div>

              {breed && onViewBreed && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-lg text-slate-800 mb-3">
                    More Actions
                  </h3>

                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => onViewBreed(breed.id)}
                    >
                      <Info className="w-4 h-4 mr-2" />
                      More from this Breed
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
