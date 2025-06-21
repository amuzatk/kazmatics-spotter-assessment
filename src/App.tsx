import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import FlightResults from "./components/FlightResults";
import FlightDetail from "./components/FlightDetail";
import BookingFlow from "./components/BookingFlow";
import { Flight, SearchParams } from "./types/flight";
import { FlightApiService } from "./services/flightApi";
import { initializeTheme, applyTheme } from "./utils/theme";

type AppView = "search" | "results" | "detail" | "booking";

function App() {
  const [view, setView] = useState<AppView>("search");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  useEffect(() => {
    const initialTheme = initializeTheme();
    setTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setSearchParams(params);

    try {
      let response;

      if (params.tripType === "multicity") {
        response = await FlightApiService.searchMultiCityFlights(params.legs, {
          cabinClass: params.cabinClass,
          adults: params.passengers.adults,
          children: params.passengers.children,
        });
      } else {
        const leg = params.legs[0];
        response = await FlightApiService.searchFlights({
          originSkyId: leg.origin,
          originEntityId: leg.originEntityId!,
          destinationSkyId: leg.destination,
          destinationEntityId: leg.destinationEntityId!,
          date: leg.date,
          returnDate:
            params.tripType === "roundtrip"
              ? params.legs[0].returnDate
              : undefined,
          cabinClass: params.cabinClass,
          adults: params.passengers.adults,
          children: params.passengers.children,
        });
      }

      setFlights(response.data.itineraries);
      setView("results");
    } catch (error) {
      console.error("Search failed:", error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setView("detail");
  };

  const handleBackToResults = () => {
    setView("results");
    setSelectedFlight(null);
  };

  const handleBackToSearch = () => {
    setView("search");
    setFlights([]);
    setSelectedFlight(null);
    setSearchParams(null);
  };

  const handleContinueBooking = () => {
    setView("booking");
  };

  const handleBackToDetail = () => {
    setView("detail");
  };

  return (
    // <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors pt-16">

      <Header theme={theme} onThemeChange={handleThemeChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "search" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Find your perfect flight
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Search and compare flights from hundreds of airlines
              </p>
            </div>

            <SearchForm
              onSearch={handleSearch}
              loading={loading}
              defaultValues={searchParams}
            />
          </div>
        )}

        {view === "results" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Flight Results
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {flights.length} flights found
                </p>
              </div>
              <button
                onClick={handleBackToSearch}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                New search
              </button>
            </div>

            <FlightResults
              flights={flights}
              loading={loading}
              onFlightSelect={handleFlightSelect}
            />
          </div>
        )}

        {view === "detail" && selectedFlight && (
          <FlightDetail
            flight={selectedFlight}
            onBack={handleBackToResults}
            onContinue={handleContinueBooking}
          />
        )}

        {view === "booking" && selectedFlight && (
          <BookingFlow flight={selectedFlight} onBack={handleBackToDetail} />
        )}
      </main>
    </div>
  );
}

export default App;
