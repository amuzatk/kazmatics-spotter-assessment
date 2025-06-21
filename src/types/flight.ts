export interface Airport {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
  navigation: {
    relevantFlightParams: {
      skyId: string;
      entityId: string;
      flightPlaceType: string;
      localizedName: string;
    };
  };
}

export interface FlightLeg {
  returnDate: string | undefined;
  origin: string;
  destination: string;
  date: string;
  originEntityId?: string;
  destinationEntityId?: string;
}

export interface SearchParams {
  tripType: 'roundtrip' | 'oneway' | 'multicity';
  legs: FlightLeg[];
  passengers: {
    adults: number;
    children: number;
    infantsInSeat: number;
    infantsOnLap: number;
  };
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
}

export interface FlightSearchResponse {
  status: boolean;
  timestamp: number;
  sessionId: string;
  data: {
    context: {
      status: string;
      sessionId: string;
      totalResults: number;
    };
    itineraries: Flight[];
    filterStats: {
      duration: {
        min: number;
        max: number;
        multiCityMin?: number;
        multiCityMax?: number;
      };
      airports: Array<{
        city: string;
        airports: Array<{
          id: string;
          entityId: string;
          name: string;
        }>;
      }>;
      carriers: Array<{
        id: number;
        alternateId: string;
        logoUrl: string;
        name: string;
      }>;
      stopPrices: {
        direct?: {
          isPresent: boolean;
          formattedPrice: string;
        };
        one?: {
          isPresent: boolean;
          formattedPrice: string;
        };
        twoOrMore?: {
          isPresent: boolean;
        };
      };
    };
    destinationImageUrl: string;
  };
}

export interface Flight {
  id: string;
  price: {
    raw: number;
    formatted: string;
    pricingOptionId: string;
  };
  legs: Array<{
    id: string;
    origin: {
      id: string;
      entityId: string;
      name: string;
      displayCode: string;
      city: string;
      country: string;
      isHighlighted: boolean;
    };
    destination: {
      id: string;
      entityId: string;
      name: string;
      displayCode: string;
      city: string;
      country: string;
      isHighlighted: boolean;
    };
    durationInMinutes: number;
    stopCount: number;
    isSmallestStops: boolean;
    departure: string;
    arrival: string;
    timeDeltaInDays: number;
    carriers: {
      marketing: Array<{
        id: number;
        alternateId: string;
        logoUrl: string;
        name: string;
      }>;
      operationType: string;
    };
    segments: Array<{
      id: string;
      origin: {
        flightPlaceId: string;
        displayCode: string;
        parent: {
          flightPlaceId: string;
          displayCode: string;
          name: string;
          type: string;
        };
        name: string;
        type: string;
        country: string;
      };
      destination: {
        flightPlaceId: string;
        displayCode: string;
        parent: {
          flightPlaceId: string;
          displayCode: string;
          name: string;
          type: string;
        };
        name: string;
        type: string;
        country: string;
      };
      departure: string;
      arrival: string;
      durationInMinutes: number;
      flightNumber: string;
      marketingCarrier: {
        id: number;
        name: string;
        alternateId: string;
        allianceId: number;
        displayCode: string;
      };
      operatingCarrier: {
        id: number;
        name: string;
        alternateId: string;
        allianceId: number;
        displayCode: string;
      };
    }>;
  }>;
  isSelfTransfer: boolean;
  isProtectedSelfTransfer: boolean;
  farePolicy: {
    isChangeAllowed: boolean;
    isPartiallyChangeable: boolean;
    isCancellationAllowed: boolean;
    isPartiallyRefundable: boolean;
  };
  eco: {
    ecoContenderDelta: number;
  };
  fareAttributes: Record<string, unknown>;
  tags: string[];
  isMashUp: boolean;
  hasFlexibleOptions: boolean;
  score: number;
}