
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 md:p-8">
      <img
        src="/lovable-uploads/e1d5445a-0979-44b4-87be-0540995d11bf.png"
        alt="FraserVotes Logo"
        className="h-16 md:h-24 w-auto mb-4 md:mb-6 animate-pulse"
      />
      
      <div className="w-full max-w-md px-4 md:px-0">
        <div className="flex flex-col items-center">
          <div className="relative w-12 h-12 md:w-16 md:h-16 mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          </div>
          
          <p className="text-base md:text-lg font-medium text-gray-700 mb-4 text-center">{message}</p>
          
          <div className="w-full space-y-3">
            <Skeleton className="h-3 md:h-4 w-full" />
            <Skeleton className="h-3 md:h-4 w-4/5 mx-auto" />
            <Skeleton className="h-3 md:h-4 w-2/3 mx-auto" />
          </div>
          
          <div className="mt-6 w-full max-w-md bg-yellow-100 border-l-4 border-yellow-500 p-3 md:p-4 flex items-start md:items-center">
            <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-yellow-600 mr-3 flex-shrink-0" />
            <p className="text-yellow-800 text-xs md:text-sm">
              This webpage does not work on the PDSB Media Network. 
              Please switch to PDSB WiFi or use Mobile Data where possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
