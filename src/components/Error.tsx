import { Button } from "./ui/button";

interface ErrorFetchingProps {
  message?: string;
}

export const ErrorFetching = ({
  message = "Failed to fetch data. Please try again.",
}: ErrorFetchingProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-16">
        <p className="text-red-500 text-lg">{message}</p>

        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    </div>
  );
};
