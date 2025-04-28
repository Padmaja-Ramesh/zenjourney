"use client"

import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import TravelForm from './components/TravelForm'
import TravelPlanDisplay from './components/TravelPlanDisplay'

interface TravelPlan {
  destination: string;
  itinerary: { [key: string]: {
    weather: string;
    breakfast: string;
    must_visit: {
      attraction: string;
      crowd_info: string;
      recommended_time: string;
    };
    local_event: {
      name: string;
      type: string;
      duration: string;
    };
    dinner: string;
    travel_tips: {
      morning_activity: string;
      transport: string;
      local_customs: string;
    };
  }};
  estimated_cost: number;
  hotel_suggestions?: Array<{
    name: string;
    rating: number;
    price_per_night: number;
    amenities: string[];
    location: string;
  }>;
  travel_tips?: {
    best_time_to_visit: string;
    local_transportation: string;
    currency: string;
    language: string;
    emergency_numbers: {
      police: string;
      ambulance: string;
      tourist_helpline: string;
    };
  };
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null)
  const [error, setError] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 3 // Show 3 days per page

  const handleSubmit = async (formData: {
    destination: string;
    start_date: string;
    end_date: string;
    budget: number;
    preferences: string;
  }) => {
    setLoading(true)
    setError('')
    setTravelPlan(null)
    
    try {
      const response = await fetch('https://zenjourney-simple-api.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setTravelPlan(data)
    } catch (err) {
      setError('Failed to fetch travel plan. Make sure the agent API is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const [searchParams, setSearchParams] = useState({
    destination: '',
    budget: '',
    days: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTravelPlan(null);
    
    // Convert the simplified search form to the format expected by the API
    const apiFormData = {
      destination: searchParams.destination,
      start_date: new Date().toISOString().split('T')[0], // Today
      end_date: new Date(Date.now() + parseInt(searchParams.days) * 86400000).toISOString().split('T')[0], // Today + days
      budget: searchParams.budget === 'budget' ? 1000 : searchParams.budget === 'moderate' ? 2500 : 5000, // Convert budget selection to number
      preferences: 'Based on search form', // Default preferences
    };
    
    try {
      const response = await fetch('https://zenjourney-simple-api.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiFormData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setTravelPlan(data);
    } catch (err) {
      setError('Failed to fetch travel plan. Make sure the agent API is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const popularDestinations = [
    { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop', description: 'The city of love and lights' },
    { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000&auto=format&fit=crop', description: 'A blend of traditional and ultramodern' },
    { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop', description: 'The city that never sleeps' },
    { name: 'Bali', image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1000&auto=format&fit=crop', description: 'Island paradise with spiritual retreats' },
  ];
  
  const features = [
    {
      title: 'AI-Powered Planning',
      description: 'Our intelligent agents work together to create the perfect itinerary based on your preferences.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Budget Optimization',
      description: 'Save money without sacrificing quality. Our agents find the best deals that match your budget constraints.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Personalized Experiences',
      description: 'Get recommendations tailored to your interests, preferences, and travel style.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: 'Real-Time Collaboration',
      description: 'Our agents work together in real-time to ensure all aspects of your trip are perfectly coordinated.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  const totalPages = travelPlan ? Math.ceil(Object.keys(travelPlan.itinerary).length / itemsPerPage) : 0
  const currentDays = travelPlan ? Object.entries(travelPlan.itinerary).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) : []

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:py-32 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=2000&auto=format&fit=crop"
            alt="Travel background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
              Your Journey, <span className="text-blue-400">Intelligently Planned</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
              ZenJourney uses advanced AI agents to create personalized travel experiences tailored just for you.
            </p>
            
            <div className="mt-10">
              <form onSubmit={handleSubmitSearch} className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-200 mb-1">Destination</label>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      placeholder="Where would you like to go?"
                      value={searchParams.destination}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-200 mb-1">Budget</label>
                    <select
                      id="budget"
                      name="budget"
                      value={searchParams.budget}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="" className="bg-gray-700 text-white">Select your budget</option>
                      <option value="budget" className="bg-gray-700 text-white">Budget ($)</option>
                      <option value="moderate" className="bg-gray-700 text-white">Moderate ($$)</option>
                      <option value="luxury" className="bg-gray-700 text-white">Luxury ($$$)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="days" className="block text-sm font-medium text-gray-200 mb-1">Trip Duration</label>
                    <input
                      type="number"
                      id="days"
                      name="days"
                      placeholder="Number of days"
                      min="1"
                      max="30"
                      value={searchParams.days}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Plan My Journey
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Travel Plan Results */}
      {(loading || error || travelPlan) && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Your Travel Plan</h2>
              
              {error && (
                <div className="p-4 mb-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
                  <p className="mb-2">{error}</p>
                  <p className="text-sm">
                    Make sure the backend agents are running. You can start them with:
                    <code className="block bg-gray-800 p-2 mt-1 rounded text-xs">
                      source venv/bin/activate<br />
                      python travel_planning_agent.py
                    </code>
                  </p>
                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => window.location.href = "/#advanced-form"} 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      Try Advanced Planning Form
                    </button>
                  </div>
                </div>
              )}
              
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              
              {travelPlan && !loading && (
                <div>
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">{travelPlan.destination}</h3>
                    <p className="text-green-400 font-medium text-lg">
                      Estimated Cost: ${travelPlan.estimated_cost.toFixed(2)}
                    </p>
                  </div>
                  
                  {/* Highlights View with Pagination */}
                  <div className="space-y-6">
                    {currentDays.map(([day, plan]) => (
                      <div key={day} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-xl shadow-lg border border-gray-700/50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-bold text-white">{day}</h4>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                            {plan.weather}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="bg-gray-700/30 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <h5 className="font-semibold text-blue-400">Main Attraction</h5>
                              </div>
                              <p className="text-gray-200">{plan.must_visit.attraction}</p>
                              <p className="text-sm text-gray-400 mt-1">{plan.must_visit.crowd_info}</p>
                            </div>
                            
                            <div className="bg-gray-700/30 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <h5 className="font-semibold text-purple-400">Local Event</h5>
                              </div>
                              <p className="text-gray-200">{plan.local_event.name}</p>
                              <p className="text-sm text-gray-400 mt-1">{plan.local_event.type}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-gray-700/30 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                <h5 className="font-semibold text-green-400">Dining</h5>
                              </div>
                              <p className="text-gray-200">{plan.dinner}</p>
                            </div>
                            
                            <div className="bg-gray-700/30 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <h5 className="font-semibold text-red-400">Travel Tips</h5>
                              </div>
                              <p className="text-gray-200">{plan.travel_tips.morning_activity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 space-x-4">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            } transition-colors`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
                      >
                        Next
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {/* Hotel Suggestions */}
                  {travelPlan.hotel_suggestions && (
                    <div className="mt-12">
                      <h4 className="text-xl font-bold text-white mb-6 text-center">Recommended Hotels</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {travelPlan.hotel_suggestions.map((hotel, index) => (
                          <div key={index} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-xl shadow-lg border border-gray-700/50">
                            <h5 className="font-bold text-white text-lg mb-2">{hotel.name}</h5>
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${i < hotel.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <p className="text-green-400 font-medium mb-2">${hotel.price_per_night}/night</p>
                            <p className="text-gray-400 mb-3">{hotel.location}</p>
                            <div className="flex flex-wrap gap-2">
                              {hotel.amenities.map((amenity, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">How ZenJourney Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-400">
              Our intelligent multi-agent system coordinates to create the perfect travel experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Destinations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Popular Destinations</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-400">
              Discover amazing places already optimized by our AI agents
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg h-72">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                  <p className="text-gray-300 text-sm mt-1">{destination.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-white/80 mb-8 text-lg">
            Let our intelligent agents plan your perfect trip. Experience travel planning reimagined.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about" className="px-8 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Learn More
            </Link>
            <Link href="/contact" className="px-8 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      
      {/* Advanced Planning Form */}
      <section id="advanced-form" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Detailed Travel Planning</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-400">
              Get a comprehensive travel plan with detailed daily activities and recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <TravelForm onSubmit={handleSubmit} loading={loading} />
            <TravelPlanDisplay travelPlan={travelPlan} loading={loading} error={error} />
          </div>
        </div>
      </section>
    </div>
  )
} 