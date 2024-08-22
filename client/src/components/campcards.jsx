import React from 'react';
import { Link } from 'react-router-dom';

export default function CampCards({ id, image, name, location, trainers }) {
  return (
    <Link to={`/camps/${id}`} className="block w-96 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white">
      <div className="relative h-56">
        <img 
          className="w-full h-full object-cover" 
          src={image}
          alt={`${name} training camp`}
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-2xl mb-3 text-gray-800">{name}</div>
        <p className="flex items-center text-gray-600 text-lg mb-2">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {location}
        </p>
        <p className="flex items-center text-gray-600 text-lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          Trainers: {trainers || 6}
        </p>
      </div>
    </Link>
  );
}