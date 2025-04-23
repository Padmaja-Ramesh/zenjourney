"use client"

import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import TravelForm from './components/TravelForm'
import TravelPlanDisplay from './components/TravelPlanDisplay'

interface TravelPlan {
  destination: string;
  itinerary: string;
  estimated_cost: number;
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null)
  const [error, setError] = useState<string>('')

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
      const response = await fetch('http://localhost:8001/travel/plan', {
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
      const response = await fetch('http://localhost:8001/travel/plan', {
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
                      className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select your budget</option>
                      <option value="budget">Budget ($)</option>
                      <option value="moderate">Moderate ($$)</option>
                      <option value="luxury">Luxury ($$$)</option>
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
                      className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white">{travelPlan.destination}</h3>
                    <p className="text-green-400 font-medium text-lg mt-1">
                      Estimated Cost: ${travelPlan.estimated_cost.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 text-white">Your Itinerary:</h4>
                    <div className="bg-gray-800/80 p-5 rounded-lg whitespace-pre-line text-gray-200">
                      {travelPlan.itinerary}
                    </div>
                  </div>
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
            <h2 className="text-3xl font-bold text-white">Advanced Trip Planning</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-400">
              For more detailed travel planning with custom dates and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TravelForm onSubmit={handleSubmit} loading={loading} />
            <TravelPlanDisplay travelPlan={travelPlan} loading={loading} error={error} />
          </div>
        </div>
      </section>
    </div>
  )
} 