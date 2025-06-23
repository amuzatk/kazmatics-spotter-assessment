import React, { useState, useRef, useEffect } from "react";
import {
  ArrowUpDown,
  Calendar,
  Users,
  Search,
  Plus,
  X,
  MapPin,
  ArrowRight,
  Check,
  ChevronDown,
  ArrowLeftRight,
  Circle,
} from "lucide-react";
import { Airport, SearchParams, FlightLeg } from "../types/flight";
import { FlightApiService } from "../services/flightApi";
import PassengerSelector from "./PassengerSelector";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
  defaultValues?: SearchParams | null;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  loading,
  defaultValues,
}) => {
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
  const [showTripDropdown, setShowTripDropdown] = useState(false);
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
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
    { value: "oneway", label: "One-way" },
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

      if (defaultValues.tripType === "roundtrip") {
        setReturnDate(defaultValues.legs[0]?.returnDate ?? "");
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

  const handleTripTypeChange = (type: typeof tripType) => {
    setTripType(type);

    setLegs([
      {
        origin: "",
        destination: "",
        date: "",
        returnDate: undefined,
      },
    ]);
    setReturnDate("");
    setAirportSearchQuery({});
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mx-auto relative">
      {/* Trip Type, Passenger and Class Selection */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mb-6">
        {/* Trip Type Selector */}
        <div className="relative inline-block text-left">
          <button
            type="button"
            className="inline-flex justify-between gap-3 items-center px-4 py-[10px] text-sm font-medium dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50"
            onClick={() => setShowTripDropdown(!showTripDropdown)}
          >
            <span className="flex items-center gap-2">
              {tripType === "roundtrip" && <ArrowLeftRight size={16} />}
              {tripType === "oneway" && <ArrowRight size={16} />}
              {tripType === "multicity" && (
                <ArrowLeftRight size={16} className="opacity-50" />
              )}
              {tripOptions.find((opt) => opt.value === tripType)?.label}
            </span>
            <ChevronDown size={16} />
          </button>

          {showTripDropdown && (
            <div className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {tripOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setShowTripDropdown(false);
                      handleTripTypeChange(value as typeof tripType);
                    }}
                    className={`relative w-full flex items-center px-4 py-2 text-sm text-left ${
                      tripType === value
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {tripType === value && (
                      <Check
                        size={16}
                        className="absolute left-3 text-blue-500"
                      />
                    )}
                    <span className="pl-6">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Passenger Selector */}
        <div className="relative">
          <button
            onClick={() => setIsPassengerModalOpen(true)}
            className="flex items-center gap-3 px-4 py-[10px]  dark:border-gray-600 rounded-lg dark:hover:border-gray-500 transition-colors dark:bg-gray-700 dark:text-white  hover:bg-gray-50"
          >
            <Users size={16} />
            <span>{getTotalPassengers()}</span>
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
        <div className="relative inline-block text-left">
          <button
            type="button"
            className="inline-flex justify-between items-center gap-3 px-4 py-[10px] text-sm font-medium  dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50"
            onClick={() => setShowCabinDropdown((prev) => !prev)}
          >
            <span className="flex items-center gap-2">
              {cabinOptions.find((opt) => opt.value === cabinClass)?.label}
            </span>
            <ChevronDown size={16} />
          </button>

          {showCabinDropdown && (
            <div className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {cabinOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setCabinClass(value as typeof cabinClass);
                      setShowCabinDropdown(false);
                    }}
                    className={`relative w-full flex items-center px-4 py-2 text-sm text-left ${
                      cabinClass === value
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {cabinClass === value && (
                      <Check
                        size={16}
                        className="absolute left-3 text-blue-500"
                      />
                    )}
                    <span className="pl-6">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flight Legs */}
      <div className="w-full  mb-6 flex flex-col  ">
        {legs.map((leg, index) => (
          <div key={index} className="w-full">
            <div className="w-full flex flex-col md:flex-row  gap-4 items-center mb-4">
              {/* From Airport */}
              <div className="w-full lg:w-[60%] relative flex flex-col md:flex-row justify-evenly gap-4 ">
                <div className="w-full  relative">
                  <div className="relative">
                    <Circle size={16} className="absolute left-4 top-6" />
                    <input
                      type="text"
                      placeholder="Where from?"
                      value={airportSearchQuery[`${index}-origin`] ?? ""}
                      onChange={(e) => {
                        handleAirportSearch(e.target.value, index, "origin");
                      }}
                      className="w-full h-[60px] pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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

                <button
                  onClick={() => swapAirports(index)}
                  className="hidden md:flex items-center justify-center top-8 right-1/2 z-10 absolute  translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 shadow"
                  aria-label="Swap airports"
                >
                  <ArrowLeftRight size={18} />
                </button>

                {/* To Airport */}
                <div className="w-full  relative">
                  <div className="relative">
                    <MapPin size={16} className="absolute left-5 top-6" />
                    <input
                      type="text"
                      placeholder="Where to?"
                      value={airportSearchQuery[`${index}-destination`] ?? ""}
                      onChange={(e) => {
                        handleAirportSearch(
                          e.target.value,
                          index,
                          "destination"
                        );
                      }}
                      className="w-full h-[60px] pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
              </div>

              <div className="w-full lg:w-[40%] flex flex-col md:flex-row gap-4">
                {/* Date */}
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

                {/* Return Date for Round Trip */}
                {tripType === "roundtrip" && (
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="date"
                        placeholder="Return"
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

                {/* Remove Button for Multi-city */}
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

      {/* Explore Button */}
      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleSearch}
          disabled={
            loading || !legs[0].origin || !legs[0].destination || !legs[0].date
          }
          className="flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-[30px] shadow-lg transition-colors"
        >
          <Search size={15} />
          <span>{loading ? "Exploring..." : "Explore"}</span>
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
