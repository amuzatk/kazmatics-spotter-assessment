import React, { useState } from "react";
import { Plane, ChevronDown, ChevronUp } from "lucide-react";
import { Flight } from "../types/flight";

interface FlightResultsProps {
  flights: Flight[];
  loading: boolean;
  onFlightSelect: (flight: Flight) => void;
}

const FlightResults: React.FC<FlightResultsProps> = ({
  flights,
  loading,
  onFlightSelect,
}) => {
  const [sortBy, setSortBy] = useState<"best" | "cheapest" | "fastest">("best");
  const [expandedFlights, setExpandedFlights] = useState<Set<string>>(
    new Set()
  );

  const sortOptions = [
    { value: "best", label: "Best" },
    { value: "cheapest", label: "Cheapest" },
    { value: "fastest", label: "Fastest" },
  ];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const toggleFlightExpansion = (flightId: string) => {
    const newExpanded = new Set(expandedFlights);
    newExpanded.has(flightId)
      ? newExpanded.delete(flightId)
      : newExpanded.add(flightId);
    setExpandedFlights(newExpanded);
  };

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case "cheapest":
        return a.price.raw - b.price.raw;
      case "fastest":
        return a.legs[0].durationInMinutes - b.legs[0].durationInMinutes;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="w-24 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-12">
        <Plane size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No flights found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort by:
        </span>
        {sortOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSortBy(value as typeof sortBy)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              sortBy === value
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Flight List */}
      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <div
            key={flight.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {flight.legs.map((leg, legIndex) => (
                    <div key={legIndex} className="mb-4 last:mb-0">
                      <div className="flex items-center space-x-4">
                        {/* Airline Logo */}
                        <div className="flex-shrink-0">
                          {leg.carriers.marketing[0]?.logoUrl ? (
                            <img
                              src={leg.carriers.marketing[0].logoUrl}
                              alt={leg.carriers.marketing[0].name}
                              className="w-8 h-8 rounded"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                              <Plane size={16} />
                            </div>
                          )}
                        </div>

                        {/* Flight Details */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatTime(leg.departure)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {leg.origin.displayCode}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatDate(leg.departure)}
                              </div>
                            </div>

                            <div className="flex-1 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDuration(leg.durationInMinutes)}
                                </div>
                                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                              </div>
                              <div className="mt-1 text-xs text-gray-400">
                                {leg.segments.length > 1
                                  ? `${leg.segments.length - 1} stop${
                                      leg.segments.length > 2 ? "s" : ""
                                    }`
                                  : "Nonstop"}
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatTime(leg.arrival)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {leg.destination.displayCode}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatDate(leg.arrival)}
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {leg.carriers.marketing.map((carrier, index) => (
                              <span key={index}>
                                {carrier.name}
                                {index < leg.carriers.marketing.length - 1 &&
                                  ", "}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price and Select Button */}
                <div className="ml-6 text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {flight.price.formatted}
                  </div>
                  <button
                    onClick={() => onFlightSelect(flight)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Select
                  </button>
                </div>
              </div>

              {/* Expandable Details */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toggleFlightExpansion(flight.id)}
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  <span>Flight details</span>
                  {expandedFlights.has(flight.id) ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                {expandedFlights.has(flight.id) && (
                  <div className="mt-4 space-y-4">
                    {flight.legs.map((leg, legIndex) => (
                      <div key={legIndex} className="space-y-3">
                        {leg.segments.map((segment, segmentIndex) => (
                          <div
                            key={segmentIndex}
                            className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="text-sm">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {segment.marketingCarrier.name}{" "}
                                {segment.flightNumber}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {formatTime(segment.departure)} -{" "}
                                {formatTime(segment.arrival)}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {segment.origin.displayCode} →{" "}
                                {segment.destination.displayCode}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightResults;
