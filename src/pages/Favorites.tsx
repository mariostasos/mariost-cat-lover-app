import { useSelector, useDispatch } from "react-redux";
import { Heart, Trash2 } from "lucide-react";
import { RootState } from "../store/store";
import { removeFavorite } from "../store/favoritesSlice";
import { CatModal } from "@/components/CatModal";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CatEntity } from "../models/Cat.model";
import { useLocation } from "wouter";
import { catApi } from "../services/catApi";
import { toast } from "sonner";

export function Favorites() {
  const [selectedCat, setSelectedCat] = useState<CatEntity | null>(null);

  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setLocation] = useLocation();

  // handle URL parameters for direct cat links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const catId = urlParams.get("cat");

    if (catId) {
      handleCatClickAndDirectLink(catId);
    }
  }, []);

  const handleCatClickAndDirectLink = async (catId: string) => {
    try {
      const cat = await catApi.getCatById(catId);
      setSelectedCat(cat);
      setIsModalOpen(true);

      // update URL for sharing
      const newUrl = `${window.location.pathname}?cat=${catId}`;
      window.history.pushState({}, "", newUrl);
    } catch (error) {
      console.error("Failed to fetch cat details:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCat(null);

    // clean up URL
    window.history.pushState({}, "", window.location.pathname);
  };

  const handleRemoveFavorite = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    dispatch(removeFavorite(catId));

    toast("Removed from favorites");
  };

  const handleDiscoverCats = () => {
    setLocation("/");
  };

  const currentState = favorites.length === 0 ? "empty" : "hasData";

  const renderStates = {
    empty: (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">
            No Favorites Yet
          </h3>
          <p className="text-slate-500 mb-6">
            Start exploring cats and add your favorites by clicking the heart
            icon!
          </p>
          <Button
            onClick={handleDiscoverCats}
            className="bg-primary hover:bg-primary/90"
          >
            Discover Cats
          </Button>
        </div>
      </div>
    ),

    hasData: (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer relative group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              onClick={() => handleCatClickAndDirectLink(cat.id)}
            >
              <img
                src={cat.url}
                alt="Favorite cat"
                className="w-full h-48 object-cover"
                loading="lazy"
              />

              <button
                onClick={(e) => handleRemoveFavorite(e, cat.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove from favorites"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      A beautiful cat
                    </h3>
                    <p className="text-sm text-slate-500">{cat.id}</p>
                  </div>
                  <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Your Favorite Cats
        </h2>
        <p className="text-slate-600">
          All your favorite cat images in one place. Click to view details or
          remove from favorites.
        </p>
      </div>

      {renderStates[currentState]}

      <CatModal
        cat={selectedCat}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
