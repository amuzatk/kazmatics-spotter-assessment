import React from "react";
import {
  Users,
  ChevronDown,
  Check,
  ArrowLeftRight,
  ArrowRight,
} from "lucide-react";

interface Props {
  tripType: "roundtrip" | "oneway" | "multicity";
  setTripType: (type: "roundtrip" | "oneway" | "multicity") => void;
  passengers: any;
  setIsPassengerModalOpen: (open: boolean) => void;
  isPassengerModalOpen: boolean;
  PassengerSelector: React.FC<any>;
  cabinClass: "economy" | "premium_economy" | "business" | "first";
  setCabinClass: (
    cls: "economy" | "premium_economy" | "business" | "first"
  ) => void;

  tripOptions: { value: string; label: string }[];
  cabinOptions: { value: string; label: string }[];
  showTripDropdown: boolean;
  setShowTripDropdown: (val: boolean) => void;
  showCabinDropdown: boolean;
  setShowCabinDropdown: (val: boolean) => void;
  getTotalPassengers: () => number;
}

const TripTypePassengerClass: React.FC<Props> = ({
  tripType,
  setTripType,
  passengers,
  setIsPassengerModalOpen,
  isPassengerModalOpen,
  PassengerSelector,
  cabinClass,
  setCabinClass,
  tripOptions,
  cabinOptions,
  showTripDropdown,
  setShowTripDropdown,
  showCabinDropdown,
  setShowCabinDropdown,
  getTotalPassengers,
}) => {
  return (
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
                    setTripType(value as typeof tripType);
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
          className="flex items-center gap-3 px-4 py-[10px] dark:border-gray-600 rounded-lg dark:hover:border-gray-500 transition-colors dark:bg-gray-700 dark:text-white hover:bg-gray-50"
        >
          <Users size={16} />
          <span>{getTotalPassengers()}</span>
          <ChevronDown size={16} />
        </button>

        {isPassengerModalOpen && (
          <PassengerSelector
            passengers={passengers}
            onPassengersChange={() => {}}
            onClose={() => setIsPassengerModalOpen(false)}
          />
        )}
      </div>

      {/* Cabin Class Selector */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          className="inline-flex justify-between items-center gap-3 px-4 py-[10px] text-sm font-medium dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50"
          onClick={() => setShowCabinDropdown(!showCabinDropdown)}
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
                    setCabinClass(
                      value as
                        | "economy"
                        | "premium_economy"
                        | "business"
                        | "first"
                    );
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
  );
};

export default TripTypePassengerClass;
