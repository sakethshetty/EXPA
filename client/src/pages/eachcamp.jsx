import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CampCards from '../components/campcards';
import { useParams } from 'react-router-dom';

export default function Eachcamp() {
  const [camps, setCamps] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {id} = useParams();
  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const currentDate = new Date().toISOString().split('T')[0];
        const response = await axios.post('http://127.0.0.1:8000/admin/camp_on_weekend', {
          date: id
        });
        setCamps(response.data.camps);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch camps');
        setLoading(false);
        console.error('Error fetching camps:', err);
      }
    };

    fetchCamps();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Training Camps</h1>
      <div className="flex flex-wrap gap-8 justify-center">
        {camps.map(camp => (
          <CampCards 
            key={camp._id}
            id={camp.id}
            image={camp.uri || 'https://via.placeholder.com/150'}
            name={camp.name}
            location={camp.location}
            trainers={camp.trainers}
          />
        ))}
      </div>
    </div>
  );
}