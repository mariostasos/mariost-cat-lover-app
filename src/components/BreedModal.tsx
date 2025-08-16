import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CatCard } from "./CatCard";
import { CatEntity } from "../models/Cat.model";
import { ErrorFetching } from "./Error";
import { BreedModalLoadingSkeleton } from "./BreedModalLoadingSkeleton";

interface BreedModalProps {
  breed: CatEntity[];
  breedName: string;
  breedOrigin: string;
  isOpen: boolean;
  onClose: () => void;
  onCatClick: (catId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function BreedModal({
  breed,
  breedName,
  breedOrigin,
  isOpen,
  onClose,
  onCatClick,
  isLoading,
  error,
}: BreedModalProps) {
  const getCurrentState = () => {
    if (isLoading) return "loading";
    if (error) return "error";
    if (!breed || breed.length === 0) return "empty";
    return "success";
  };

  const renderStates = {
    loading: <BreedModalLoadingSkeleton count={6} />,

    error: <ErrorFetching message="Failed to fetch cats. Please try again." />,

    empty: (
      <div className="text-center py-8">
        <p className="text-slate-500">No images available for this breed.</p>
      </div>
    ),

    success: (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {breed.map((cat) => (
          <CatCard
            key={cat.id}
            cat={cat}
            onClick={() => onCatClick(cat.id)}
            className="shadow-sm"
          />
        ))}
      </div>
    ),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-6xl max-h-[90vh] overflow-hidden p-0"
        aria-describedby="breed-modal-description"
      >
        <DialogHeader className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-800">
                {breedName} Images
              </DialogTitle>
              <p className="text-slate-500" id="breed-modal-description">
                From {breedOrigin} - Browse images of this beautiful breed
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {renderStates[getCurrentState()]}
        </div>
      </DialogContent>
    </Dialog>
  );
}
