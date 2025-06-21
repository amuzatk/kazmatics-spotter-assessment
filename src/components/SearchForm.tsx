import React, { useState, useRef, useEffect } from "react";
import {
  ArrowUpDown,
  Calendar,
  Users,
  Search,
  Plus,
  X,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Airport, SearchParams, FlightLeg } from "../types/flight";
import { FlightApiService } from "../services/flightApi";
import PassengerSelector from "./PassengerSelector";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
    defaultValues?: SearchParams | null; 
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading,defaultValues }) => {
  const [tripType, setTripType] = useState<
    "roundtrip" | "oneway" | "multicity"
  >("roundtrip");
  const [legs, setLegs] = useState<FlightLeg[]>([
    {
      origin: "",
      destination: "",
      date: "",
      returnDate: undefined,
    },
  ]);
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infantsInSeat: 0,
    infantsOnLap: 0,
  });
  const [cabinClass, setCabinClass] = useState<
    "economy" | "premium_economy" | "business" | "first"
  >("economy");
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [airportSearchResults, setAirportSearchResults] = useState<Airport[]>(
    []
  );
  const [showAirportDropdown, setShowAirportDropdown] = useState<{
    index: number;
    field: "origin" | "destination";
  } | null>(null);
  // const [airportSearchQuery, setAirportSearchQuery] = useState('');
  const [airportSearchQuery, setAirportSearchQuery] = useState<
    Record<string, string>
  >({});
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const cabinOptions = [
    { value: "economy", label: "Economy" },
    { value: "premium_economy", label: "Premium economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First" },
  ];

  const tripOptions = [
    { value: "roundtrip", label: "Round trip" },
    { value: "oneway", label: "One way" },
    { value: "multicity", label: "Multi-city" },
  ];

//   useEffect(() => {
//   if (tripType !== "multicity" && legs.length > 1) {
//     setLegs([legs[0]]);
//   }
// }, [tripType]);

useEffect(() => {
  if (defaultValues) {
    setTripType(defaultValues.tripType);
    setLegs(defaultValues.legs);
    setPassengers(defaultValues.passengers);
    setCabinClass(defaultValues.cabinClass);

    if (defaultValues.tripType === 'roundtrip') {
      setReturnDate(defaultValues.legs[0]?.returnDate ?? '');
    }

    // Pre-fill airport input fields
    const initialQuery: Record<string, string> = {};
    defaultValues.legs.forEach((leg, index) => {
      initialQuery[`${index}-origin`] = leg.origin;
      initialQuery[`${index}-destination`] = leg.destination;
    });
    setAirportSearchQuery(initialQuery);
  }
}, [defaultValues]);

  const searchAirports = async (query: string) => {
    if (query.length < 2) {
      setAirportSearchResults([]);
      return;
    }

    try {
      const results = await FlightApiService.searchAirports(query);
      setAirportSearchResults(results);
    } catch (error) {
      console.error("Error searching airports:", error);
      setAirportSearchResults([]);
    }
  };

  // const handleAirportSearch = (query: string, index: number, field: 'origin' | 'destination') => {
  //   // setAirportSearchQuery(query);
  //   setShowAirportDropdown({ index, field });

  //   if (searchTimeoutRef.current) {
  //     clearTimeout(searchTimeoutRef.current);
  //   }

  //   searchTimeoutRef.current = setTimeout(() => {
  //     searchAirports(query);
  //   }, 300);
  // };

  const handleAirportSearch = (
    query: string,
    index: number,
    field: "origin" | "destination"
  ) => {
    const key = `${index}-${field}`;
    setAirportSearchQuery((prev) => ({ ...prev, [key]: query }));
    setShowAirportDropdown({ index, field });

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchAirports(query);
    }, 300);
  };

  //   const selectAirport = (airport: Airport, index: number, field: 'origin' | 'destination') => {
  //   const updatedLegs = [...legs];
  //   updatedLegs[index] = {
  //     ...updatedLegs[index],
  //     [field]: airport.navigation.relevantFlightParams.skyId,
  //     [`${field}EntityId`]: airport.navigation.relevantFlightParams.entityId,
  //   };
  //   setLegs(updatedLegs);
  //   setShowAirportDropdown(null);
  //   setAirportSearchResults([]);
  // };

  const selectAirport = (
    airport: Airport,
    index: number,
    field: "origin" | "destination"
  ) => {
    const updatedLegs = [...legs];
    updatedLegs[index] = {
      ...updatedLegs[index],
      [field]: airport.navigation.relevantFlightParams.skyId,
      [`${field}EntityId`]: airport.navigation.relevantFlightParams.entityId,
    };
    setLegs(updatedLegs);
    setShowAirportDropdown(null);
    setAirportSearchResults([]);

    const key = `${index}-${field}`;
    setAirportSearchQuery((prev) => ({
      ...prev,
      [key]: airport.navigation.relevantFlightParams.skyId,
    }));
  };

  const swapAirports = (index: number) => {
    const updatedLegs = [...legs];
    const temp = updatedLegs[index].origin;
    const tempEntityId = updatedLegs[index].originEntityId;
    updatedLegs[index].origin = updatedLegs[index].destination;
    updatedLegs[index].originEntityId = updatedLegs[index].destinationEntityId;
    updatedLegs[index].destination = temp;
    updatedLegs[index].destinationEntityId = tempEntityId;
    setLegs(updatedLegs);
  };

  const addFlight = () => {
    setLegs([
      ...legs,
      {
        origin: "",
        destination: "",
        date: "",
        returnDate: undefined,
      },
    ]);
  };

  const removeFlight = (index: number) => {
    if (legs.length > 1) {
      setLegs(legs.filter((_, i) => i !== index));
    }
  };

  const updateLeg = (index: number, field: keyof FlightLeg, value: string) => {
    const updatedLegs = [...legs];
    updatedLegs[index] = { ...updatedLegs[index], [field]: value };
    setLegs(updatedLegs);
  };

  const handleSearch = () => {
    const searchParams: SearchParams = {
      tripType,
      legs: tripType === "roundtrip" ? [{ ...legs[0], returnDate }] : legs,
      passengers,
      cabinClass,
    };
    onSearch(searchParams);
  };

  const getTotalPassengers = () => {
    return (
      passengers.adults +
      passengers.children +
      passengers.infantsInSeat +
      passengers.infantsOnLap
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      {/* Trip Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tripOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTripType(value as typeof tripType)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tripType === value
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {label}
            {tripType === value && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Flight Legs */}
      <div className="space-y-4 mb-6">
        {legs.map((leg, index) => (
          <div key={index} className="relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* From Airport */}
              <div className="md:col-span-4 relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Where from?"
                    // value={leg.origin}
                    // onChange={(e) => {
                    //   updateLeg(index, 'origin', e.target.value);
                    //   handleAirportSearch(e.target.value, index, 'origin');
                    // }}
                    value={airportSearchQuery[`${index}-origin`] ?? ""}
                    onChange={(e) => {
                      handleAirportSearch(e.target.value, index, "origin");
                    }}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <MapPin
                    size={20}
                    className="absolute right-3 top-3 text-gray-400"
                  />
                </div>

                {/* Airport Dropdown */}
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

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center">
                <button
                  onClick={() => swapAirports(index)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <ArrowUpDown size={20} />
                </button>
              </div>

              {/* To Airport */}
              <div className="md:col-span-4 relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Where to?"
                    // value={leg.destination}
                    value={airportSearchQuery[`${index}-destination`] ?? ""}
                    onChange={(e) => {
                      handleAirportSearch(e.target.value, index, "destination");
                    }}
                    // onChange={(e) => {
                    //   updateLeg(index, 'destination', e.target.value);
                    //   handleAirportSearch(e.target.value, index, 'destination');
                    // }}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <MapPin
                    size={20}
                    className="absolute right-3 top-3 text-gray-400"
                  />
                </div>

                {/* Airport Dropdown */}
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

              {/* Date */}
              <div className="md:col-span-2">
                <div className="relative">
                  <input
                    type="date"
                    value={leg.date}
                    onChange={(e) => updateLeg(index, "date", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <Calendar
                    size={20}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>
                {leg.date && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(leg.date)}
                  </div>
                )}
              </div>

              {/* Remove Button for Multi-city */}
              {tripType === "multicity" && (
                <div className="md:col-span-1 flex justify-center">
                  <button
                    onClick={() => removeFlight(index)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    disabled={legs.length === 1}
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Return Date for Round Trip */}
        {tripType === "roundtrip" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-9"></div>
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="date"
                  placeholder="Return"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <Calendar
                  size={20}
                  className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                />
              </div>
              {returnDate && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatDate(returnDate)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Flight Button for Multi-city */}
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

      {/* Passenger and Class Selection */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Passenger Selector */}
        <div className="relative">
          <button
            onClick={() => setIsPassengerModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors dark:bg-gray-700 dark:text-white"
          >
            <Users size={20} />
            <span>
              {getTotalPassengers()} passenger
              {getTotalPassengers() !== 1 ? "s" : ""}
            </span>
            <ChevronDown size={16} />
          </button>

          {isPassengerModalOpen && (
            <PassengerSelector
              passengers={passengers}
              onPassengersChange={setPassengers}
              onClose={() => setIsPassengerModalOpen(false)}
            />
          )}
        </div>

        {/* Cabin Class Selector */}
        <select
          value={cabinClass}
          onChange={(e) => setCabinClass(e.target.value as typeof cabinClass)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          {cabinOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={
          loading || !legs[0].origin || !legs[0].destination || !legs[0].date
        }
        className="flex items-center justify-center space-x-2 w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        <Search size={20} />
        <span>{loading ? "Searching..." : "Search"}</span>
      </button>
    </div>
  );
};

export default SearchForm;
