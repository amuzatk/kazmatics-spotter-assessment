# ✈️ Responsive Google Flights Version – Kazeem's Spotter Frontend Assessment

A responsive React-based flight search interface modeled after Google Flights. Built using the [SkyScrapper API](https://rapidapi.com/apiheya/api/sky-scrapper) from RapidAPI.

## 🚀 Features

- Responsive multi-city flight search UI
- Dynamic autocomplete for airport selection
- Real-time flight data fetching
- Date pickers for departure inputs
- Form validation and loading states
- Clean, modular codebase with component reuse

## 🔧 Tech Stack

- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** useState, useEffect (React hooks)
- **HTTP Client:** Axios
- **Utilities:** Day.js for date formatting

## 📽️ Loom Demo

👉 [Watch the Demo](https://www.loom.com/share/ab7088b22bdf4f79aa82d40b6bdd3b3a?sid=8e979fe8-b03b-412b-a43c-0056ec71c71b)

ℹ️ Note on API Usage
Due to quota limits on the free tier of the SkyScrapper API, real-time requests were only available for the first few test runs. To continue development and demonstrate functionality, I switched to using mock data based on the actual API responses I received earlier.

All logic (parsing, UI behavior, and state management) remains true to how it would work with live data. This workaround is also explained in detail in the Loom video demo.

👉 [View Live on Vercel](https://kazmatics-spotter-assessment.vercel.app)  
*(Deployed using Vercel with environment variables configured securely)*

## 🛠️ Setup & Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/amuzatk/kazmatics-spotter-assessment.git
   cd google-flights-clone
