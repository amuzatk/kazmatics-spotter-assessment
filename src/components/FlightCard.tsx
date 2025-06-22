import React from 'react'
import { cityFlights } from '../data/data'

const FlightCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 border border-red-500">

  {cityFlights.map((flight, idx) => (
    <div
      key={idx}
      className="  overflow-hidden dark:bg-gray-800"
    >
      <img
        src={flight.image}
        alt={flight.name}
        className="w-full h-[140px] rounded-[16px] object-cover"
      />
      <div className="">
        <div className="flex justify-between items-center text-lg font-semibold text-gray-800 dark:text-white">
          <span>{flight.name}</span>
          <span>{flight.amount}</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          <p>{flight.dateRange}</p>
          <p>{flight.flightInfo}</p>
        </div>
      </div>
    </div>
  ))}
    </div>

  )
}

export default FlightCard