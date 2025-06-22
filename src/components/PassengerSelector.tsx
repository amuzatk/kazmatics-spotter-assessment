import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

interface PassengerSelectorProps {
  passengers: {
    adults: number;
    children: number;
    infantsInSeat: number;
    infantsOnLap: number;
  };
  onPassengersChange: (passengers: {
    adults: number;
    children: number;
    infantsInSeat: number;
    infantsOnLap: number;
  }) => void;
  onClose: () => void;
}

const PassengerSelector: React.FC<PassengerSelectorProps> = ({
  passengers,
  onPassengersChange,
  onClose
}) => {
  const [localPassengers, setLocalPassengers] = useState(passengers);
  const [validationMessage, setValidationMessage] = useState('');

  const passengerTypes = [
    {
      key: 'adults' as keyof typeof localPassengers,
      label: 'Adults',
      description: '',
      min: 1,
      max: 9
    },
    {
      key: 'children' as keyof typeof localPassengers,
      label: 'Children',
      description: 'Aged 2-11',
      min: 0,
      max: 8
    },
    {
      key: 'infantsInSeat' as keyof typeof localPassengers,
      label: 'Infants',
      description: 'In seat',
      min: 0,
      max: 9
    },
    {
      key: 'infantsOnLap' as keyof typeof localPassengers,
      label: 'Infants',
      description: 'On lap',
      min: 0,
      max: 9
    }
  ];

  const validatePassengers = (pass: typeof localPassengers) => {
    const total = pass.adults + pass.children + pass.infantsInSeat + pass.infantsOnLap;
    const totalInfants = pass.infantsInSeat + pass.infantsOnLap;

    if (total > 9) {
      return 'Sorry, we do not support more than 9 passengers.';
    }

    if (totalInfants > pass.adults * 2) {
      return 'You must have at least one adult per two infants.';
    }

    if (pass.infantsOnLap > pass.adults) {
      return 'You must have at least one adult per infant on lap.';
    }

    return '';
  };

  useEffect(() => {
    const message = validatePassengers(localPassengers);
    setValidationMessage(message);
  }, [localPassengers]);

  const updatePassenger = (key: keyof typeof localPassengers, delta: number) => {
    const passengerType = passengerTypes.find(p => p.key === key);
    if (!passengerType) return;

    const newValue = Math.max(
      passengerType.min,
      Math.min(passengerType.max, localPassengers[key] + delta)
    );

    const newPassengers = { ...localPassengers, [key]: newValue };
    setLocalPassengers(newPassengers);
  };

  const handleDone = () => {
    if (!validationMessage) {
      onPassengersChange(localPassengers);
      onClose();
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
      <div className="p-6">
        <div className="space-y-4">
          {passengerTypes.map(({ key, label, description, min, max }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {label}
                </div>
                {description && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updatePassenger(key, -1)}
                  disabled={localPassengers[key] <= min}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                  {localPassengers[key]}
                </span>
                <button
                  onClick={() => updatePassenger(key, 1)}
                  disabled={localPassengers[key] >= max}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {validationMessage && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">
              {validationMessage}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
           <button
            onClick={onClose}
            className="px-6 py-2 disabled:bg-gray-400 disabled:cursor-not-allowed text-blue-600 font-medium rounded-lg transition-colors"
          >
           Cancel
          </button>
          <button
            onClick={handleDone}
            disabled={!!validationMessage}
            className="px-6 py-2 disabled:bg-gray-400 disabled:cursor-not-allowed text-blue-600 font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassengerSelector;