import React from 'react';
import Image from 'next/image';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">About ZenJourney</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg mb-6">
            ZenJourney is revolutionizing travel planning through AI-powered agent technology. 
            Our mission is to create personalized travel experiences that reduce stress and maximize enjoyment.
          </p>
          <p className="text-lg">
            We believe that technology should simplify your life, not complicate it. That's why we've 
            developed a system of intelligent agents that work together seamlessly to create the perfect 
            vacation package tailored to your preferences and budget.
          </p>
        </div>
        <div className="bg-white/10 p-8 rounded-lg relative h-64">
          <div className="absolute inset-0 flex items-center justify-center text-5xl text-blue-400 opacity-20">
            <span>ZenJourney</span>
          </div>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-center mb-12">The Power of Multi-Agent Systems</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white/5 p-6 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">Intelligent Coordination</h3>
          <p>
            Our agents communicate synchronously to ensure all aspects of your trip work together perfectly.
          </p>
        </div>
        
        <div className="bg-white/5 p-6 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">Specialized Expertise</h3>
          <p>
            Each agent is a specialist in its domain - flights, hotels, activities - ensuring optimal choices in every category.
          </p>
        </div>
        
        <div className="bg-white/5 p-6 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">Real-time Processing</h3>
          <p>
            Get instant recommendations and complete travel packages without the wait of traditional travel agencies.
          </p>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
      
      <div className="space-y-8 mb-16">
        <div className="bg-white/10 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Budget Optimization</h3>
            <p>
              Our system automatically balances your budget across all aspects of your trip, ensuring you get the most value without overspending. You specify your total budget, and we handle the rest.
            </p>
          </div>
        </div>
        
        <div className="bg-white/10 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Preference-Driven Recommendations</h3>
            <p>
              Simply tell us what you like - cultural experiences, adventure, relaxation, cuisine - and our agents will curate activities and accommodations that match your interests perfectly.
            </p>
          </div>
        </div>
        
        <div className="bg-white/10 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center">
          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">End-to-End Planning</h3>
            <p>
              ZenJourney handles everything from flights and accommodations to daily activities and local transportation, presenting you with a complete itinerary that you can take straight to your trip.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">Powered by Advanced Technology</h2>
        <p className="max-w-3xl mx-auto text-lg">
          ZenJourney utilizes the cutting-edge uAgents framework from Fetch.ai to create a network of autonomous, 
          intelligent agents that communicate effectively to solve complex travel planning challenges.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="bg-white/5 px-4 py-2 rounded-md">Next.js</div>
          <div className="bg-white/5 px-4 py-2 rounded-md">React</div>
          <div className="bg-white/5 px-4 py-2 rounded-md">Tailwind CSS</div>
          <div className="bg-white/5 px-4 py-2 rounded-md">uAgents</div>
          <div className="bg-white/5 px-4 py-2 rounded-md">Fetch.ai</div>
          <div className="bg-white/5 px-4 py-2 rounded-md">Python</div>
        </div>
      </div>
      
      <div className="bg-blue-900/20 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to plan your dream vacation?</h2>
        <p className="mb-6">Let our intelligent agents create the perfect travel package for you.</p>
        <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
          Start Planning Now
        </a>
      </div>
    </div>
  );
} 