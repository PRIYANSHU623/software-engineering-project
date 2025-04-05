'use client';
import { useState, useEffect } from 'react';
import Footer from "../../foot/footer";

function StudentNavbar() {
  return (
    <nav className="bg-green-800 text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">Student Panel</div>
      <div>
        <a href="/student/dashboard" className="px-4 hover:text-gray-300">Dashboard</a>
        <a href="/student/training" className="px-4 hover:text-gray-300">Training</a>
        <a href="/student/profile" className="px-4 hover:text-gray-300">Profile</a>
        <a href="/student/applications" className="px-4 hover:text-gray-300">My Applications</a>
        <a href="/logout" className="px-4 hover:text-gray-300">Logout</a>
      </div>
    </nav>
  );
}
export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const userEmail = "john@example.com";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`/api/student/applied-jobs?email=${encodeURIComponent(userEmail)}`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! Status: ${res.status}. Response: ${errorText.slice(0, 100)}`);
        }
        const data = await res.json();
        if (data.ok) {
          setApplications(data.appliedJobs);
        } else {
          console.error("API error:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };
    fetchApplications();
  }, [userEmail]);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <StudentNavbar />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-800">My Applications</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3">Job Title</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{app.title || app.jobTitle}</td>
                  <td className="p-3">{app.company}</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {app.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-600">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
