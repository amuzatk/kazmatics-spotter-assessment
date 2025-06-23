import React from "react";
import {
  Calendar,
  MapPin,
  ArrowLeftRight,
  Plus,
  X,
  Circle,
} from "lucide-react";
import { Airport, FlightLeg } from "../types/flight";

interface Props {
  tripType: "roundtrip" | "oneway" | "multicity";
  legs: FlightLeg[];
  returnDate: string;
  airportSearchQuery: Record<string, string>;
  airportSearchResults: Airport[];
  showAirportDropdown: {
    index: number;
    field: "origin" | "destination";
  } | null;
  updateLeg: (index: number, field: keyof FlightLeg, value: string) => void;
  setReturnDate: (val: string) => void;
  selectAirport: (
    airport: Airport,
    index: number,
    field: "origin" | "destination"
  ) => void;
  handleAirportSearch: (
    query: string,
    index: number,
    field: "origin" | "destination"
  ) => void;
  swapAirports: (index: number) => void;
  addFlight: () => void;
  removeFlight: (index: number) => void;
}

const FlightLegs: React.FC<Props> = ({
  tripType,
  legs,
  returnDate,
  airportSearchQuery,
  airportSearchResults,
  showAirportDropdown,
  updateLeg,
  setReturnDate,
  selectAirport,
  handleAirportSearch,
  swapAirports,
  addFlight,
  removeFlight,
}) => {
  return (
    <div className="w-full mb-6 flex flex-col">
      {legs.map((leg, index) => (
        <div key={index} className="w-full">
          <div className="w-full flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="w-full lg:w-[60%] relative flex flex-col md:flex-row justify-evenly gap-4">
              <div className="w-full relative">
                <div className="relative">
                  <Circle size={16} className="absolute left-4 top-6" />
                  <input
                    type="text"
                    placeholder="Where from?"
                    value={airportSearchQuery[`${index}-origin`] ?? ""}
                    onChange={(e) =>
                      handleAirportSearch(e.target.value, index, "origin")
                    }
                    className="w-full h-[60px] pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {showAirportDropdown?.index === index &&
                  showAirportDropdown?.field === "origin" &&
                  airportSearchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {airportSearchResults.map((airport) => (
                        <button
                          key={airport.skyId}
                          onClick={() =>
                            selectAirport(airport, index, "origin")
                          }
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {airport.presentation.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {airport.presentation.subtitle}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              <button
                onClick={() => swapAirports(index)}
                className="hidden md:flex items-center justify-center top-8 right-1/2 z-10 absolute translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 shadow"
              >
                <ArrowLeftRight size={18} />
              </button>

              <div className="w-full relative">
                <div className="relative">
                  <MapPin size={16} className="absolute left-5 top-6" />
                  <input
                    type="text"
                    placeholder="Where to?"
                    value={airportSearchQuery[`${index}-destination`] ?? ""}
                    onChange={(e) =>
                      handleAirportSearch(e.target.value, index, "destination")
                    }
                    className="w-full h-[60px] pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {showAirportDropdown?.index === index &&
                  showAirportDropdown?.field === "destination" &&
                  airportSearchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {airportSearchResults.map((airport) => (
                        <button
                          key={airport.skyId}
                          onClick={() =>
                            selectAirport(airport, index, "destination")
                          }
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {airport.presentation.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {airport.presentation.subtitle}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            <div className="w-full lg:w-[40%] flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="date"
                    value={leg.date}
                    onChange={(e) => updateLeg(index, "date", e.target.value)}
                    className="w-full h-[60px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <Calendar
                    size={20}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {tripType === "roundtrip" && index === 0 && (
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full h-[60px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <Calendar
                      size={20}
                      className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              )}

              {tripType === "multicity" && legs.length > 1 && (
                <div className="flex items-center">
                  <button
                    onClick={() => removeFlight(index)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {tripType === "multicity" && (
        <button
          onClick={addFlight}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          <Plus size={20} />
          <span>Add flight</span>
        </button>
      )}
    </div>
  );
};

export default FlightLegs;
