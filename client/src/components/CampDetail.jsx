import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CampDetail = () => {
  const { id } = useParams();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainersAndRoutes = async () => {
      try {
        const trainersResponse = await axios.post('http://localhost:8000/admin/trainer_in_camp', { id: id, location: 'dfom', date: 'pdiofij', camp_size: 12 });
        const trainersData = trainersResponse.data.trainers;
        const trainersWithRoutes = await Promise.all(trainersData.map(async (trainer) => {
          try {
            const routeResponse = await axios.post('http://127.0.0.1:8000/trainer/route', {
              camp_id: id,
              trainer_id: trainer.id
            });
            
            const routeDetails = routeResponse.data.details;
            
            return { 
              ...trainer, 
              src: routeDetails.src,
              dest: routeDetails.dst,
              flight_no: routeDetails.flight_number,
              price: routeDetails.price,
              departure_time: routeDetails.departure_time,
              arrival_time: routeDetails.arrival_time,
            };
          } catch (routeError) {
            console.error('Error fetching route for trainer:', trainer.id, routeError);
            return { ...trainer, routeError: 'Failed to load route information' };
          }
        }));
    
        setTrainers(trainersWithRoutes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trainers:', err);
        setError('Failed to load trainer details');
        setLoading(false);
      }
    };

    fetchTrainersAndRoutes();
  }, [id]);

  const handleApproval = async (trainerId, isApproved) => {
    try {
      await axios.post('http://127.0.0.1:8000/admin/update_trainer_status', {
        camp_id: id,
        trainer_id: trainerId,
        status: isApproved ? 'approved' : 'not_approved'
      });

      setTrainers(prevTrainers => 
        prevTrainers.map(trainer => 
          trainer.id === trainerId 
            ? { ...trainer, status: isApproved ? 'approved' : 'not_approved' }
            : trainer
        )
      );
    } catch (error) {
      console.error('Error updating trainer status:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;
  if (trainers.length === 0) return <div className="text-center mt-8">No trainers available for this camp</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-indigo-700">Camp Trainers</h1>
      
      <h2 className="text-2xl font-semibold mb-4 text-slate-600">Trainers List</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-slate-500 text-white">
            <tr>
              <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">Sr. No</th>
              <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">Name</th>
              <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">Gender</th>
              <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">Experience</th>
              <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">SRC</th>
              <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">DEST</th>
              <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">Flight No.</th>
              <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">Price</th>
              <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trainers.map((trainer, index) => (
              <tr key={trainer.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-4 px-6 text-base font-bold text-gray-900">{index + 1}</td>
                <td className="py-4 px-6 text-base font-bold text-gray-900">{trainer.username}</td>
                <td className="py-4 px-6 text-base font-bold text-gray-700">{trainer.gender}</td>
                <td className="py-4 px-6 text-base font-bold text-gray-700">{trainer.experience}</td>
                <td className="py-4 px-6 text-base font-bold text-gray-700">{trainer.src}</td>
                <td className="py-4 px-6 text-base font-bold text-gray-700">{trainer.dest || '-'}</td>
                <td className="py-4 px-6 text-base font-bold text-gray-700">{trainer.flight_no || '-'}</td>
                <td className="py-4 px-6 text-base font-bold text-gray-700">{trainer.price || '-'}</td>
                <td className="py-4 px-6 text-base">
                  {trainer.status === 'approved' ? (
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Approved
                    </span>
                  ) : trainer.status === 'not_approved' ? (
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Not Approved
                    </span>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproval(trainer.id, true)}
                        className="px-3 py-1 text-sm leading-5 font-semibold rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleApproval(trainer.id, false)}
                        className="px-3 py-1 text-sm leading-5 font-semibold rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        ✗
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampDetail;