"use client";
import { useState, useEffect } from "react";
import Footer from "../../foot/footer";

function StudentNavbar() {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src="/logo.png" alt="IIIT Logo" className="w-12" />
        <p className="text-lg font-semibold">Training &amp; Placement Cell</p>
      </div>
      <div>
        <a href="/student/dashboard" className="px-4 font-semibold hover:text-blue-300">Dashboard</a>
        <a href="/student/training" className="px-4 font-semibold text-blue-300">Training Program</a>
        <a href="/student/profile" className="px-4 font-semibold hover:text-blue-300">Profile</a>
        <a href="/student/applications" className="px-4 font-semibold hover:text-blue-300">My Applications</a>
        <a href="/" className="px-4 font-semibold hover:text-blue-300">Logout</a>
      </div>
    </nav>
  );
}

export default function TrainingProgramsPage() {
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await fetch(`/api/students/training`);
        if (res.ok) {
          const data = await res.json();
          setTrainings(data);
          setFilteredTrainings(data);
        } else {
          console.error("Failed to fetch training programs");
        }
      } catch (error) {
        console.error("Error fetching training programs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = trainings.filter((training) =>
      training.title.toLowerCase().includes(query) ||
      training.provider.toLowerCase().includes(query) ||
      training.skillsCovered.some(skill => skill.toLowerCase().includes(query))
    );
    setFilteredTrainings(filtered);
  }, [searchQuery, trainings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-black">
          Approved Training Programs
        </h1>

        {/* Search Box */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search by title, provider, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 text-black border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black"
          />
        </div>

        {loading ? (
          <p className="text-center">Loading training programs...</p>
        ) : filteredTrainings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrainings.map((training) => (
              <div key={training._id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300">
                <h2 className="text-2xl font-bold text-gray-800">{training.title}</h2>
                <p className="text-gray-600 mt-2"><strong>Provider:</strong> {training.provider}</p>
                <p className="text-gray-600 mt-2"><strong>Location:</strong> {training.location}</p>
                <p className="text-gray-600 mt-2"><strong>Type:</strong> {training.type}</p>
                <p className="text-gray-600 mt-2"><strong>Duration:</strong> {training.duration} {training.durationUnit}</p>
                <p className="text-gray-600 mt-2"><strong>Start:</strong> {new Date(training.startDate).toLocaleDateString()}</p>
                <p className="text-gray-600 mt-2"><strong>End:</strong> {new Date(training.endDate).toLocaleDateString()}</p>
                {training.description && (
                  <p className="text-gray-600 mt-2"><strong>Description:</strong> {training.description}</p>
                )}
                {training.skillsCovered.length > 0 && (
                  <p className="text-gray-600 mt-2">
                    <strong>Skills Covered:</strong> {training.skillsCovered.join(", ")}
                  </p>
                )}
                {training.prerequisites.length > 0 && (
                  <p className="text-gray-600 mt-2">
                    <strong>Prerequisites:</strong> {training.prerequisites.join(", ")}
                  </p>
                )}
                <div className="mt-4">
                  <a
                    href={training.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Join
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No training programs found for your search.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
