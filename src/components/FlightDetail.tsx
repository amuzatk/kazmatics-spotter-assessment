import React from "react";
import { ArrowLeft, Clock, Plane, MapPin, Calendar } from "lucide-react";
import { Flight } from "../types/flight";

interface FlightDetailProps {
  flight: Flight;
  onBack: () => void;
  onContinue: () => void;
}

const FlightDetail: React.FC<FlightDetailProps> = ({
  flight,
  onBack,
  onContinue,
}) => {
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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back to results</span>
        </button>

        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {flight.price.formatted}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total price for all passengers
          </div>
        </div>
      </div>

      {/* Flight Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Flight Details
        </h2>

        {flight.legs.map((leg, legIndex) => (
          <div key={legIndex} className="mb-8 last:mb-0">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatDate(leg.departure)}
              </h3>
            </div>

            <div className="space-y-6">
              {leg.segments.map((segment, segmentIndex) => (
                <div key={segmentIndex}>
                  <div className="flex items-start space-x-6">
                    {/* Airline Info */}
                    <div className="flex-shrink-0">
                      {leg.carriers.marketing[0]?.logoUrl ? (
                        <img
                          src={leg.carriers.marketing[0].logoUrl}
                          alt={leg.carriers.marketing[0].name}
                          className="w-12 h-12 rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                          <Plane size={20} />
                        </div>
                      )}
                    </div>

                    {/* Flight Timeline */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Departure */}
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatTime(segment.departure)}
                          </div>
                          <div className="text-lg text-gray-600 dark:text-gray-400">
                            {segment.origin.displayCode} – {segment.origin.name}
                          </div>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <MapPin size={16} />
                            <span>Terminal information may vary</span>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <Clock size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Flight time
                            </span>
                          </div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatDuration(
                              Math.round(
                                (new Date(segment.arrival).getTime() -
                                  new Date(segment.departure).getTime()) /
                                  60000
                              )
                            )}
                          </div>
                          <div className="flex items-center justify-center mt-2">
                            <div className="w-full h-px bg-gray-300 dark:bg-gray-600 relative">
                              <Plane
                                size={16}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-right md:text-left">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatTime(segment.arrival)}
                          </div>
                          <div className="text-lg text-gray-600 dark:text-gray-400">
                            {segment.destination.displayCode} –{" "}
                            {segment.destination.name}
                          </div>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500 dark:text-gray-400 justify-end md:justify-start">
                            <MapPin size={16} />
                            <span>Terminal information may vary</span>
                          </div>
                        </div>
                      </div>

                      {/* Flight Info */}
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {segment.marketingCarrier.name}{" "}
                              {segment.flightNumber}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                              • Aircraft type varies
                            </span>
                          </div>

                          <div className="text-gray-500 dark:text-gray-400">
                            Economy
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Layover Info */}
                  {segmentIndex < leg.segments.length - 1 && (
                    <div className="flex items-center space-x-3 my-6 pl-18">
                      <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Layover: </span>
                        Connection time varies • Change of planes
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Booking Information
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">
              Ticket type
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              Economy
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">
              Cancellation
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              Varies by airline
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Changes</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Varies by airline
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600 dark:text-gray-400">Baggage</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Varies by airline
            </span>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default FlightDetail;
