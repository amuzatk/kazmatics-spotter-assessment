import { Airport, FlightLeg, FlightSearchResponse } from "../types/flight";

export const cityFlights = [
  {
    name: "London",
    amount: "NGN 1,200,000.00",
    image: "/assets/London.jpg",
    dateRange: "4 Jul – 11 Jul",
    flightInfo: "1 stop · 8 hrs 45 min",
  },
  {
    name: "Paris",
    amount: "NGN 950,000.00",
    image: "/assets/Paris.jpg",
    dateRange: "4 Jul – 11 Jul",
    flightInfo: "1 stop · 8 hrs 45 min",
  },
  {
    name: "Lagos",
    amount: "NGN 450,000.00",
    image: "/assets/Lagos.jpg",
    dateRange: "4 Jul – 11 Jul",
    flightInfo: "1 stop · 8 hrs 45 min",
  },
  {
    name: "Dubai",
    amount: "NGN 1,050,000.00",
    image: "/assets/Dubai.jpg",
    dateRange: "4 Jul – 11 Jul",
    flightInfo: "1 stop · 8 hrs 45 min",
  },
];

export const mockAirports: Airport[] = [
  {
    skyId: "JFK",
    entityId: "1",
    presentation: {
      title: "New York John F. Kennedy Intl (JFK)",
      suggestionTitle: "JFK - New York John F. Kennedy Intl",
      subtitle: "United States",
    },
    navigation: {
      relevantFlightParams: {
        skyId: "JFK",
        entityId: "1",
        flightPlaceType: "airport",
        localizedName: "John F. Kennedy International Airport",
      },
    },
  },
  {
    skyId: "LHR",
    entityId: "2",
    presentation: {
      title: "London Heathrow (LHR)",
      suggestionTitle: "LHR - London Heathrow",
      subtitle: "United Kingdom",
    },
    navigation: {
      relevantFlightParams: {
        skyId: "LHR",
        entityId: "2",
        flightPlaceType: "airport",
        localizedName: "London Heathrow",
      },
    },
  },
  {
    skyId: "LOS",
    entityId: "3",
    presentation: {
      title: "Lagos Murtala Muhammed (LOS)",
      suggestionTitle: "LOS - Lagos Murtala Muhammed",
      subtitle: "Nigeria",
    },
    navigation: {
      relevantFlightParams: {
        skyId: "LOS",
        entityId: "3",
        flightPlaceType: "airport",
        localizedName: "Murtala Muhammed International Airport",
      },
    },
  },
];

export const getMockOneWayFlights = (): FlightSearchResponse => ({
  status: true,
  timestamp: Date.now(),
  sessionId: "mock-session-id",
  data: {
    context: {
      status: "success",
      sessionId: "mock-session-id",
      totalResults: 2,
    },
    itineraries: [],
    filterStats: {
      duration: { min: 420, max: 450 },
      airports: [],
      carriers: [],
      stopPrices: {},
    },
    destinationImageUrl: "https://example.com/london.jpg",
  },
});

export const getMockMultiCityFlights = (legs: FlightLeg[]): FlightSearchResponse => ({
  status: true,
  timestamp: Date.now(),
  sessionId: "mock-session-multi",
  data: {
    context: {
      status: "success",
      sessionId: "mock-session-multi",
      totalResults: 1,
    },
    itineraries: [
      {
        id: "multi-001",
        price: {
          raw: 980,
          formatted: "$980",
          pricingOptionId: "multi-opt-1",
        },
        legs: legs.map((leg, index) => ({
          id: `leg-${index + 1}`,
          origin: {
            id: leg.origin,
            entityId: "mock-entity-origin",
            name: `Mock Origin ${leg.origin}`,
            displayCode: leg.origin,
            city: "Mock City",
            country: "Mockland",
            isHighlighted: false,
          },
          destination: {
            id: leg.destination,
            entityId: "mock-entity-dest",
            name: `Mock Destination ${leg.destination}`,
            displayCode: leg.destination,
            city: "Mock City",
            country: "Mockland",
            isHighlighted: false,
          },
          durationInMinutes: 300,
          stopCount: 0,
          isSmallestStops: true,
          departure: leg.date + "T08:00:00Z",
          arrival: leg.date + "T13:00:00Z",
          timeDeltaInDays: 0,
          carriers: {
            marketing: [
              {
                id: 99,
                alternateId: "MOCK",
                logoUrl: "https://logo.clearbit.com/mock.com",
                name: "Mock Airline",
              },
            ],
            operationType: "direct",
          },
          segments: [],
        })),
        isSelfTransfer: false,
        isProtectedSelfTransfer: false,
        farePolicy: {
          isChangeAllowed: true,
          isPartiallyChangeable: true,
          isCancellationAllowed: true,
          isPartiallyRefundable: true,
        },
        eco: {
          ecoContenderDelta: 0.5,
        },
        fareAttributes: {},
        tags: [],
        isMashUp: false,
        hasFlexibleOptions: true,
        score: 9.0,
      },
    ],
    filterStats: {
      duration: {
        min: 300,
        max: 300,
      },
      airports: [],
      carriers: [],
      stopPrices: {},
    },
    destinationImageUrl: "",
  },
});


  export const cabinOptions = [
    { value: "economy", label: "Economy" },
    { value: "premium_economy", label: "Premium economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First" },
  ];

  export const tripOptions = [
    { value: "roundtrip", label: "Round trip" },
    { value: "oneway", label: "One-way" },
    { value: "multicity", label: "Multi-city" },
  ];

   export const sortOptions = [
    { value: "best", label: "Best" },
    { value: "cheapest", label: "Cheapest" },
    { value: "fastest", label: "Fastest" },
  ];