import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Cat } from "lucide-react";
import { catApi } from "../services/catApi";
import { BreedModal } from "@/components/BreedModal";
import { CatModal } from "@/components/CatModal";
import { Input } from "@/components/ui/input";
import { Breed, CatEntity } from "../models/Cat.model";
import { useDebounce } from "@/hooks/use-debounce";
import { BreedListLoadingSkeleton } from "@/components/BreedListLoadingSkeleton";
import { ErrorFetching } from "@/components/Error";
import { getGradientColor } from "@/lib/helpers";

export function Breeds() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBreed, setSelectedBreed] = useState<CatEntity[]>([]);
  const [selectedBreedName, setSelectedBreedName] = useState<string>("");
  const [selectedBreedOrigin, setSelectedBreedOrigin] = useState<string>("");
  const [selectedBreedId, setSelectedBreedId] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<CatEntity | null>(null);
  const [isBreedModalOpen, setIsBreedModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const {
    data: breeds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["breeds"],
    queryFn: catApi.getBreeds,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch images for the selected breed plus request state and pass it to the modal
  const {
    data: breedImages,
    isLoading: isBreedLoading,
    error: breedError,
  } = useQuery({
    queryKey: ["breedImages", selectedBreedId],
    queryFn: () => catApi.getBreedImages(selectedBreedId!),
    enabled: !!selectedBreedId, // Trigger only when we have a breed ID
  });

  useEffect(() => {
    if (breedImages) {
      const selectedBreed = breeds?.find(
        (breed: Breed) => breed.id === selectedBreedId
      );

      setSelectedBreed(breedImages);
      setSelectedBreedName(selectedBreed?.name);
      setSelectedBreedOrigin(selectedBreed?.origin);
      setIsBreedModalOpen(true);
    }
  }, [breedImages, breeds, selectedBreedId]);

  // handle URL parameters for direct cat links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const catId = urlParams.get("cat");
    if (catId) {
      handleCatClickAndDirectLink(catId);
    }
  }, []);

  // handle URL parameters for direct breed links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const breedId = urlParams.get("breed");

    if (breedId) {
      setSelectedBreedId(breedId);
    }
  }, []);

  const filteredBreeds = useMemo(() => {
    if (!breeds?.length) return [];
    if (!debouncedSearchTerm.trim()) return breeds;

    const lowercaseSearch = debouncedSearchTerm.toLowerCase();

    return breeds.filter(
      (breed: Breed) =>
        breed.name.toLowerCase().includes(lowercaseSearch) ||
        breed.origin.toLowerCase().includes(lowercaseSearch)
    );
  }, [breeds, debouncedSearchTerm]);

  const handleBreedClick = (breed: Breed) => {
    setSelectedBreedId(breed.id);
    setSelectedBreedName(breed.name);
    setSelectedBreedOrigin(breed.origin);
    setIsBreedModalOpen(true);
  };

  const handleCatClickAndDirectLink = async (catId: string) => {
    try {
      const cat = await catApi.getCatById(catId);
      setSelectedCat(cat);
      setIsCatModalOpen(true);
      setIsBreedModalOpen(false);

      const newUrl = `${window.location.pathname}?cat=${catId}`;
      window.history.pushState({}, "", newUrl);
    } catch (error) {
      console.error("Failed to fetch cat details:", error);
    }
  };

  const handleCatModalClose = () => {
    setIsCatModalOpen(false);
    setSelectedCat(null);

    // clean up URL
    window.history.pushState({}, "", window.location.pathname);
  };

  if (error) {
    return (
      <ErrorFetching message="Failed to fetch breeds. Please try again." />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Cat Breeds</h2>
        <p className="text-slate-600">
          Explore different cat breeds and discover their unique
          characteristics.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search breeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <BreedListLoadingSkeleton />
        ) : (
          filteredBreeds.map((breed: Breed, index: number) => (
            <div
              key={breed.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleBreedClick(breed)}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${getGradientColor(
                      index
                    )} rounded-full flex items-center justify-center`}
                  >
                    <Cat className="text-white text-xl w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">
                      {breed.name}
                    </h3>
                    <p className="text-sm text-slate-500">{breed.origin}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {breed.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {breed.temperament.split(", ").map((trait, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>{breed.life_span} years</span>
                  <span>{breed.weight.metric} kg</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredBreeds.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-slate-500">
            No breeds found matching your search.
          </p>
        </div>
      )}

      <BreedModal
        breed={selectedBreed}
        breedName={selectedBreedName}
        breedOrigin={selectedBreedOrigin}
        isOpen={isBreedModalOpen}
        onClose={() => setIsBreedModalOpen(false)}
        onCatClick={handleCatClickAndDirectLink}
        isLoading={isBreedLoading}
        error={breedError}
      />

      <CatModal
        cat={selectedCat}
        isOpen={isCatModalOpen}
        onClose={handleCatModalClose}
      />
    </div>
  );
}
