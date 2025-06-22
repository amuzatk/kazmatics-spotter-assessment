import { useEffect, useState } from "react";

const FlightMapSection = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Set a timeout to show error if map doesn't load within 5 seconds
    const timeout = setTimeout(() => {
      if (!isMapLoaded) setHasError(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isMapLoaded]);

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-left">
        Find cheap flights from Abuja to anywhere
      </h2>

      <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-800 rounded-[16px] overflow-hidden relative">
        {!isMapLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
            Loading map...
          </div>
        )}

        {hasError ? (
          <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
            Map unavailable. Please check your internet connection or API key.
          </div>
        ) : (
          <iframe
            title="Google Map"
            width="100%"
            height="100%"
            style={{ border: 30 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Abuja"
            onLoad={() => setIsMapLoaded(true)}
            onError={() => setHasError(true)}
          />
        )}
      </div>
    </div>
  );
};

export default FlightMapSection;
