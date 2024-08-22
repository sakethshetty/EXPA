import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const trainerResponse = await axios.post("http://127.0.0.1:8000/trainer/get_details", { id, "username" : "eofj", "email" : "ein", "passwd" : "gosd", "location" : "oj", "experience": 12, "gender" : "roij"});
        setTrainer(trainerResponse.data.details);

        const campsResponse = await axios.post("http://127.0.0.1:8000/trainer/camp_for_trainer", { id, "username" : "eofj", "email" : "ein", "passwd" : "gosd", "location" : "oj", "experience": 12, "gender" : "roij"});
        setCamps(campsResponse.data.camps);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="text-gray-700">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!trainer) return <div className="text-gray-700">No trainer data available</div>;

  return (
    <div className='my-2'>
      <div className="mx-8 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Trainer Dashboard</h1>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 uppercase mb-1">Name</p>
              <p className="text-lg font-semibold text-gray-800">{trainer.username}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 uppercase mb-1">Gender</p>
              <p className="text-lg font-semibold text-gray-800">{trainer.gender}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 uppercase mb-1">Experience</p>
              <p className="text-lg font-semibold text-gray-800">{trainer.experience} years</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 uppercase mb-1">Location</p>
              <p className="text-lg font-semibold text-gray-800">{trainer.location}</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg md:col-span-2">
              <p className="text-sm text-pink-600 uppercase mb-1">Email</p>
              <p className="text-lg font-semibold text-gray-800">{trainer.email}</p>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Camps Registered</h2>
        {camps.length === 0 ? (
          <p className="text-gray-700">No camps allocated yet.</p>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 overflow-hidden">
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-slate-500 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider rounded-tl-lg">Camp ID</th>
                    <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">Location</th>
                    <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">Date</th>
                    <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">Camp Size</th>
                    <th className="py-4 px-6 text-left text-base font-semibold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {camps.map((camp, index) => (
                  <tr key={camp._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-4 px-6 text-base text-gray-700">{camp.id}</td>
                    <td className="py-4 px-6 text-base text-gray-700">{camp.location}</td>
                    <td className="py-4 px-6 text-base text-gray-700">{camp.date}</td>
                    <td className="py-4 px-6 text-base text-gray-700">{camp.camp_size}</td>
                    <td className="py-4 px-6 text-base">
                      {camp.status === 'allocated' ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-yellow-800">
                          Allocated
                        </span>
                      ) : camp.status === 'registered' ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-green-800">
                          Registered
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {camp.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;