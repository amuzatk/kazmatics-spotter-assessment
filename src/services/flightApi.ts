import { Airport, FlightSearchResponse, FlightLeg } from '../types/flight';

// const API_KEY = '4c7e42704bmsh5aea0b0cf55f724p1c2b4bjsn87e3df59bb8a';//amuzatk
const API_KEY = 'a8ab0fde93mshfe1f003ff600b0ep1462dfjsn55b27345acb2';//amuzatk0001
// const API_KEY = '7ee7dca62dmsh80e88ef042cdd90p1259aejsn9c2109fa98d3';//amuzatk001
// 7ee7dca62dmsh80e88ef042cdd90p1259aejsn9c2109fa98d3

const BASE_URL = 'https://sky-scrapper.p.rapidapi.com/api';

const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
};

export class FlightApiService {
  // static async searchAirports(query: string): Promise<Airport[]> {
  //   try {
  //     const response = await fetch(
  //       `${BASE_URL}/v1/flights/searchAirport?query=${encodeURIComponent(query)}&locale=en-US`,
  //       { headers }
  //     );
      
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
      
  //     const data = await response.json();
  //     return data.data || [];
  //   } catch (error) {
  //     console.error('Error searching airports:', error);
  //     return [];
  //   }
  // }

  static async searchAirports(query: string): Promise<Airport[]> {
    const mockAirports: Airport[] = [
      {
        skyId: 'JFK',
        entityId: '1',
        presentation: {
          title: 'New York John F. Kennedy Intl (JFK)',
          suggestionTitle: 'JFK - New York John F. Kennedy Intl',
          subtitle: 'United States'
        },
        navigation: {
          relevantFlightParams: {
            skyId: 'JFK',
            entityId: '1',
            flightPlaceType: 'airport',
            localizedName: 'John F. Kennedy International Airport'
          }
        }
      },
      {
        skyId: 'LHR',
        entityId: '2',
        presentation: {
          title: 'London Heathrow (LHR)',
          suggestionTitle: 'LHR - London Heathrow',
          subtitle: 'United Kingdom'
        },
        navigation: {
          relevantFlightParams: {
            skyId: 'LHR',
            entityId: '2',
            flightPlaceType: 'airport',
            localizedName: 'London Heathrow'
          }
        }
      },
      {
        skyId: 'LOS',
        entityId: '3',
        presentation: {
          title: 'Lagos Murtala Muhammed (LOS)',
          suggestionTitle: 'LOS - Lagos Murtala Muhammed',
          subtitle: 'Nigeria'
        },
        navigation: {
          relevantFlightParams: {
            skyId: 'LOS',
            entityId: '3',
            flightPlaceType: 'airport',
            localizedName: 'Murtala Muhammed International Airport'
          }
        }
      }
    ];

    // Simulate delay and filter by query
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockAirports.filter((airport) =>
          airport.presentation.title.toLowerCase().includes(query.toLowerCase()) ||
          airport.presentation.subtitle.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  }

  static async getNearbyAirports(lat: number, lng: number): Promise<Airport[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/v1/flights/getNearByAirports?lat=${lat}&lng=${lng}&locale=en-US`,
        { headers }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error getting nearby airports:', error);
      return [];
    }
  }

//   static async searchFlightsOld(params: {
//     originSkyId: string;
//     destinationSkyId: string;
//     originEntityId: string;
//     destinationEntityId: string;
//     date?: string;
//     returnDate?: string;
//     cabinClass: string;
//     adults: number;
//     children?: number;
//     sortBy?: string;
//     currency?: string;
//     market?: string;
//     countryCode?: string;
//   }): Promise<FlightSearchResponse> {
//     try {
//       const queryParams = new URLSearchParams({
//         originSkyId: params.originSkyId,
//         destinationSkyId: params.destinationSkyId,
//         originEntityId: params.originEntityId,
//         destinationEntityId: params.destinationEntityId,
//         cabinClass: params.cabinClass,
//         adults: params.adults.toString(),
//         sortBy: params.sortBy || 'best',
//         currency: params.currency || 'USD',
//         market: params.market || 'en-US',
//         countryCode: params.countryCode || 'US',
//       });

//       if (params.date) {
//         queryParams.append('date', params.date);
//       }
//       if (params.children) {
//         queryParams.append('children', params.children.toString());
//       }

//       const endpoint = params.date 
//         ? `${BASE_URL}/v1/flights/searchFlights`
//         : `${BASE_URL}/v2/flights/searchFlights`;

//       const response = await fetch(`${endpoint}?${queryParams}`, { headers });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error searching flights:', error);
//       throw error;
//     }
//   }

//   static async searchFlightsOld2(params: {
//   originSkyId: string;
//   destinationSkyId: string;
//   date: string; // required now since your backend requires it
// }): Promise<FlightSearchResponse> {
//   try {
//     const queryParams = new URLSearchParams({
//       originSkyId: params.originSkyId,
//       destinationSkyId: params.destinationSkyId,
//       date: params.date,
//     });

//     const response = await fetch(`http://localhost:5000/api/flights?${queryParams}`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error searching flights via proxy:', error);
//     throw error;
//   }
// }


static async searchFlights(
  params: {
    originSkyId: string;
    destinationSkyId: string;
    date: string;
    originEntityId?: string;
    destinationEntityId?: string;
    returnDate?: string;
    cabinClass?: string;
    adults?: number;
    children?: number;
  }
): Promise<FlightSearchResponse> {
    const mockData: FlightSearchResponse = {
      status: true,
      timestamp: Date.now(),
      sessionId: 'mock-session-id',
      data: {
        context: {
          status: 'success',
          sessionId: 'mock-session-id',
          totalResults: 2,
        },
        itineraries: [
          {
            id: 'flight-001',
            price: {
              raw: 450,
              formatted: '$450',
              pricingOptionId: 'price-opt-1',
            },
            legs: [
              {
                id: 'leg-001',
                origin: {
                  id: 'JFK',
                  entityId: '1',
                  name: 'John F. Kennedy Intl',
                  displayCode: 'JFK',
                  city: 'New York',
                  country: 'USA',
                  isHighlighted: false,
                },
                destination: {
                  id: 'LHR',
                  entityId: '2',
                  name: 'London Heathrow',
                  displayCode: 'LHR',
                  city: 'London',
                  country: 'UK',
                  isHighlighted: false,
                },
                durationInMinutes: 420,
                stopCount: 0,
                isSmallestStops: true,
                departure: '2025-07-20T08:00:00Z',
                arrival: '2025-07-20T16:00:00Z',
                timeDeltaInDays: 0,
                carriers: {
                  marketing: [
                    {
                      id: 1,
                      alternateId: 'AA',
                      logoUrl: 'https://logo.clearbit.com/aa.com',
                      name: 'American Airlines',
                    }
                  ],
                  operationType: 'direct',
                },
                segments: [
                  {
                    id: 'seg-001',
                    origin: {
                      flightPlaceId: 'JFK',
                      displayCode: 'JFK',
                      parent: {
                        flightPlaceId: 'NYC',
                        displayCode: 'NYC',
                        name: 'New York',
                        type: 'city',
                      },
                      name: 'John F. Kennedy Intl',
                      type: 'airport',
                      country: 'USA',
                    },
                    destination: {
                      flightPlaceId: 'LHR',
                      displayCode: 'LHR',
                      parent: {
                        flightPlaceId: 'LON',
                        displayCode: 'LON',
                        name: 'London',
                        type: 'city',
                      },
                      name: 'London Heathrow',
                      type: 'airport',
                      country: 'UK',
                    },
                    departure: '2025-07-20T08:00:00Z',
                    arrival: '2025-07-20T16:00:00Z',
                    durationInMinutes: 420,
                    flightNumber: 'AA100',
                    marketingCarrier: {
                      id: 1,
                      name: 'American Airlines',
                      alternateId: 'AA',
                      allianceId: 1,
                      displayCode: 'AA',
                    },
                    operatingCarrier: {
                      id: 1,
                      name: 'American Airlines',
                      alternateId: 'AA',
                      allianceId: 1,
                      displayCode: 'AA',
                    },
                  },
                ],
              },
            ],
            isSelfTransfer: false,
            isProtectedSelfTransfer: false,
            farePolicy: {
              isChangeAllowed: true,
              isPartiallyChangeable: true,
              isCancellationAllowed: true,
              isPartiallyRefundable: true,
            },
            eco: {
              ecoContenderDelta: 0.8,
            },
            fareAttributes: {},
            tags: [],
            isMashUp: false,
            hasFlexibleOptions: true,
            score: 8.7,
          },
          {
            id: 'flight-002',
            price: {
              raw: 520,
              formatted: '$520',
              pricingOptionId: 'price-opt-2',
            },
            legs: [
              {
                id: 'leg-002',
                origin: {
                  id: 'JFK',
                  entityId: '1',
                  name: 'John F. Kennedy Intl',
                  displayCode: 'JFK',
                  city: 'New York',
                  country: 'USA',
                  isHighlighted: false,
                },
                destination: {
                  id: 'LHR',
                  entityId: '2',
                  name: 'London Heathrow',
                  displayCode: 'LHR',
                  city: 'London',
                  country: 'UK',
                  isHighlighted: false,
                },
                durationInMinutes: 450,
                stopCount: 1,
                isSmallestStops: false,
                departure: '2025-07-20T13:00:00Z',
                arrival: '2025-07-20T23:30:00Z',
                timeDeltaInDays: 0,
                carriers: {
                  marketing: [
                    {
                      id: 2,
                      alternateId: 'BA',
                      logoUrl: 'https://logo.clearbit.com/britishairways.com',
                      name: 'British Airways',
                    }
                  ],
                  operationType: 'one-stop',
                },
                segments: [
                  {
                    id: 'seg-002',
                    origin: {
                      flightPlaceId: 'JFK',
                      displayCode: 'JFK',
                      parent: {
                        flightPlaceId: 'NYC',
                        displayCode: 'NYC',
                        name: 'New York',
                        type: 'city',
                      },
                      name: 'John F. Kennedy Intl',
                      type: 'airport',
                      country: 'USA',
                    },
                    destination: {
                      flightPlaceId: 'BOS',
                      displayCode: 'BOS',
                      parent: {
                        flightPlaceId: 'BOS',
                        displayCode: 'BOS',
                        name: 'Boston',
                        type: 'city',
                      },
                      name: 'Logan Intl',
                      type: 'airport',
                      country: 'USA',
                    },
                    departure: '2025-07-20T13:00:00Z',
                    arrival: '2025-07-20T14:30:00Z',
                    durationInMinutes: 90,
                    flightNumber: 'BA200',
                    marketingCarrier: {
                      id: 2,
                      name: 'British Airways',
                      alternateId: 'BA',
                      allianceId: 2,
                      displayCode: 'BA',
                    },
                    operatingCarrier: {
                      id: 2,
                      name: 'British Airways',
                      alternateId: 'BA',
                      allianceId: 2,
                      displayCode: 'BA',
                    },
                  },
                  {
                    id: 'seg-003',
                    origin: {
                      flightPlaceId: 'BOS',
                      displayCode: 'BOS',
                      parent: {
                        flightPlaceId: 'BOS',
                        displayCode: 'BOS',
                        name: 'Boston',
                        type: 'city',
                      },
                      name: 'Logan Intl',
                      type: 'airport',
                      country: 'USA',
                    },
                    destination: {
                      flightPlaceId: 'LHR',
                      displayCode: 'LHR',
                      parent: {
                        flightPlaceId: 'LON',
                        displayCode: 'LON',
                        name: 'London',
                        type: 'city',
                      },
                      name: 'London Heathrow',
                      type: 'airport',
                      country: 'UK',
                    },
                    departure: '2025-07-20T17:00:00Z',
                    arrival: '2025-07-20T23:30:00Z',
                    durationInMinutes: 390,
                    flightNumber: 'BA201',
                    marketingCarrier: {
                      id: 2,
                      name: 'British Airways',
                      alternateId: 'BA',
                      allianceId: 2,
                      displayCode: 'BA',
                    },
                    operatingCarrier: {
                      id: 2,
                      name: 'British Airways',
                      alternateId: 'BA',
                      allianceId: 2,
                      displayCode: 'BA',
                    },
                  },
                ],
              },
            ],
            isSelfTransfer: false,
            isProtectedSelfTransfer: false,
            farePolicy: {
              isChangeAllowed: true,
              isPartiallyChangeable: true,
              isCancellationAllowed: false,
              isPartiallyRefundable: false,
            },
            eco: {
              ecoContenderDelta: 0.6,
            },
            fareAttributes: {},
            tags: ['popular'],
            isMashUp: false,
            hasFlexibleOptions: false,
            score: 8.2,
          }
        ],
        filterStats: {
          duration: {
            min: 420,
            max: 450,
          },
          airports: [],
          carriers: [],
          stopPrices: {},
        },
        destinationImageUrl: 'https://example.com/london.jpg',
      },
    };

    return new Promise((resolve) => setTimeout(() => resolve(mockData), 500));
  }

// static async searchFlights(params: {
//   originSkyId: string;
//   destinationSkyId: string;
//   date: string;
//   originEntityId?: string;
//   destinationEntityId?: string;
//   returnDate?: string;
//   cabinClass?: string;
//   adults?: number;
//   children?: number;
// }): Promise<FlightSearchResponse> {
//   try {
//     const queryParams = new URLSearchParams({
//       originSkyId: params.originSkyId,
//       destinationSkyId: params.destinationSkyId,
//       date: params.date,
//     });

//     if (params.originEntityId) queryParams.append('originEntityId', params.originEntityId);
//     if (params.destinationEntityId) queryParams.append('destinationEntityId', params.destinationEntityId);
//     if (params.returnDate) queryParams.append('returnDate', params.returnDate);
//     if (params.cabinClass) queryParams.append('cabinClass', params.cabinClass);
//     if (params.adults !== undefined) queryParams.append('adults', params.adults.toString());
//     if (params.children !== undefined) queryParams.append('children', params.children.toString());

//     const response = await fetch(`http://localhost:5000/api/flights?${queryParams}`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error searching flights via proxy:', error);
//     throw error;
//   }
// }

  static async searchFlightsComplete(
    sessionId: string,
    currency = 'USD',
    market = 'en-US',
    countryCode = 'US'
  ): Promise<FlightSearchResponse> {
    try {
      const queryParams = new URLSearchParams({
        sessionId,
        currency,
        market,
        countryCode,
      });

      const response = await fetch(
        `${BASE_URL}/v2/flights/searchIncomplete?${queryParams}`,
        { headers }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting complete flight data:', error);
      throw error;
    }
  }

  static async searchMultiCityFlights(
  legs: FlightLeg[],
  params: {
    cabinClass: string;
    adults: number;
    children?: number;
    sortBy?: string;
    currency?: string;
    market?: string;
    countryCode?: string;
  }
): Promise<FlightSearchResponse> {
  try {
    // MOCK RESPONSE (simulate one itinerary for multiple legs)
    const mockData: FlightSearchResponse = {
      status: true,
      timestamp: Date.now(),
      sessionId: 'mock-session-multi',
      data: {
        context: {
          status: 'success',
          sessionId: 'mock-session-multi',
          totalResults: 1,
        },
        itineraries: [
          {
            id: 'multi-001',
            price: {
              raw: 980,
              formatted: '$980',
              pricingOptionId: 'multi-opt-1',
            },
            legs: legs.map((leg, index) => ({
              id: `leg-${index + 1}`,
              origin: {
                id: leg.origin,
                entityId: 'mock-entity-origin',
                name: `Mock Origin ${leg.origin}`,
                displayCode: leg.origin,
                city: 'Mock City',
                country: 'Mockland',
                isHighlighted: false,
              },
              destination: {
                id: leg.destination,
                entityId: 'mock-entity-dest',
                name: `Mock Destination ${leg.destination}`,
                displayCode: leg.destination,
                city: 'Mock City',
                country: 'Mockland',
                isHighlighted: false,
              },
              durationInMinutes: 300,
              stopCount: 0,
              isSmallestStops: true,
              departure: leg.date + 'T08:00:00Z',
              arrival: leg.date + 'T13:00:00Z',
              timeDeltaInDays: 0,
              carriers: {
                marketing: [
                  {
                    id: 99,
                    alternateId: 'MOCK',
                    logoUrl: 'https://logo.clearbit.com/mock.com',
                    name: 'Mock Airline',
                  },
                ],
                operationType: 'direct',
              },
              segments: [
                {
                  id: `seg-${index + 1}`,
                  origin: {
                    flightPlaceId: leg.origin,
                    displayCode: leg.origin,
                    parent: {
                      flightPlaceId: 'MOCK',
                      displayCode: 'MOCK',
                      name: 'Mock City',
                      type: 'city',
                    },
                    name: `Mock Origin ${leg.origin}`,
                    type: 'airport',
                    country: 'Mockland',
                  },
                  destination: {
                    flightPlaceId: leg.destination,
                    displayCode: leg.destination,
                    parent: {
                      flightPlaceId: 'MOCK',
                      displayCode: 'MOCK',
                      name: 'Mock City',
                      type: 'city',
                    },
                    name: `Mock Destination ${leg.destination}`,
                    type: 'airport',
                    country: 'Mockland',
                  },
                  departure: leg.date + 'T08:00:00Z',
                  arrival: leg.date + 'T13:00:00Z',
                  durationInMinutes: 300,
                  flightNumber: `MOCK${100 + index}`,
                  marketingCarrier: {
                    id: 99,
                    name: 'Mock Airline',
                    alternateId: 'MOCK',
                    allianceId: 99,
                    displayCode: 'MOCK',
                  },
                  operatingCarrier: {
                    id: 99,
                    name: 'Mock Airline',
                    alternateId: 'MOCK',
                    allianceId: 99,
                    displayCode: 'MOCK',
                  },
                },
              ],
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
        destinationImageUrl: '',
      },
    };

    return new Promise(resolve => setTimeout(() => resolve(mockData), 500));
  } catch (error) {
    console.error('Error in mock multi-city:', error);
    throw error;
  }
}

  // static async searchMultiCityFlights(legs: FlightLeg[], params: {
  //   cabinClass: string;
  //   adults: number;
  //   children?: number;
  //   sortBy?: string;
  //   currency?: string;
  //   market?: string;
  //   countryCode?: string;
  // }): Promise<FlightSearchResponse> {
  //   try {
  //     const legsParam = encodeURIComponent(JSON.stringify(legs));
  //     const queryParams = new URLSearchParams({
  //       legs: legsParam,
  //       cabinClass: params.cabinClass,
  //       adults: params.adults.toString(),
  //       sortBy: params.sortBy || 'best',
  //       currency: params.currency || 'USD',
  //       market: params.market || 'en-US',
  //       countryCode: params.countryCode || 'US',
  //     });

  //     if (params.children) {
  //       queryParams.append('children', params.children.toString());
  //     }

  //     const response = await fetch(
  //       `${BASE_URL}/v1/flights/searchFlightsMultiStops?${queryParams}`,
  //       { headers }
  //     );
      
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
      
  //     return await response.json();
  //   } catch (error) {
  //     console.error('Error searching multi-city flights:', error);
  //     throw error;
  //   }
  // }
}