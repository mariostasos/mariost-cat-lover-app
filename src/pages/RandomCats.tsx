import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { catApi } from "../services/catApi";
import { Button } from "@/components/ui/button";
import { CatEntity } from "../models/Cat.model";
import { useLocation } from "wouter";
import { CatCard } from "@/components/CatCard";
import { CatModal } from "@/components/CatModal";
import { ErrorFetching } from "@/components/Error";
import { CatsListLoadingSkeleton } from "@/components/CatsListLoadingSkeleton";

export function RandomCats() {
  const [selectedCat, setSelectedCat] = useState<CatEntity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allCats, setAllCats] = useState<CatEntity[]>([]);
  const [page, setPage] = useState(0);
  const [, setLocation] = useLocation();

  const {
    data: cats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["random-cats", page],
    queryFn: () => catApi.getRandomCats(10, page),
  });

  // handle URL parameters for direct cat links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const catId = urlParams.get("cat");
    if (catId) {
      handleCatClickAndDirectLink(catId);
    }
  }, []);

  useEffect(() => {
    if (cats && page === 0) {
      setAllCats(cats);
    } else if (cats && page > 0) {
      setAllCats((prev) => [...prev, ...cats]);
    }
  }, [cats, page]);

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

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleViewBreed = (breedId: string) => {
    setLocation(`/breeds?breed=${breedId}`);
  };

  if (error) {
    return <ErrorFetching message="Failed to fetch cats. Please try again." />;
  }

  if (!allCats || (allCats.length === 0 && !isLoading)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <p className="text-slate-500">No cats found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Discover Random Cats
        </h2>
        <p className="text-slate-600">
          Explore beautiful cat images from around the world. Click any image to
          learn more about the breed!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          <CatsListLoadingSkeleton count={page === 0 ? 10 : 4} />
        ) : (
          <>
            {allCats.map((cat) => (
              <CatCard
                key={cat.id}
                cat={cat}
                onClick={() => handleCatClickAndDirectLink(cat.id)}
              />
            ))}
          </>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isLoading ? "Loading..." : "Load More Cats"}
        </Button>
      </div>

      <CatModal
        cat={selectedCat}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onViewBreed={handleViewBreed}
      />
    </div>
  );
}
