"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import axios from "axios";

export default function TrainingProgramsPage() {
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [openTraining, setOpenTraining] = useState(null);

  const router = useRouter()

  const AuthorizeUser = async () => {
    try {
      const email = sessionStorage.getItem("userEmail")
      const response = await fetch("/api/auth/role", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        toast("You cannot access this page!")
        return router.push("/")
      }

      const data = await response.json()
      console.log(data)

      if (data.role !== "Admin") {
        return router.push("/unauthorized")
      }

      return router.push("/admin/training-program")

    } catch (error) {
      console.error(error)
      toast("Something went wrong")
      return router.push("/")
    }
  }

  useEffect(() => {
    AuthorizeUser()
    fetchTrainingPrograms();
  }, []);

  const fetchTrainingPrograms = async () => {
    try {
      const response = await axios.get("/api/admin/trainings/pending");
      if (!response.data.ok) throw new Error("Failed to fetch trainings");
      setTrainingPrograms(response.data.trainings || []);
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };

  // app/admin/training-program/page.js
const handleApprove = async (training) => {
    try {
      // Use PATCH to update the existing training record
      const response = await axios.patch(
        `/api/admin/trainings/${training._id}`,
        { 
          status: "Approved",
          approvedAt: new Date().toISOString() 
        }
      );
  
      if (response.data.success) {
        alert("Training approved successfully!");
        fetchTrainingPrograms(); // Refresh the list
        
        // Send notification to students
        await axios.post("/api/notifications", {
          message: `New training available: ${response.data.training.title}`,
          recipientType: "all-students",
          link: `/trainings/${training._id}`
        });
      } else {
        alert(response.data.message || "Approval failed");
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleReject = async (trainingId) => {
    try {
      const res = await axios.put(`/api/admin/trainings/${trainingId}/reject`);
      if (res.data.ok) {
        fetchTrainingPrograms();
      } else {
        alert("Failed to reject training");
      }
    } catch (error) {
      console.error("Error rejecting training:", error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-blue-900 text-white py-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="IIIT Logo" className="w-12" />
            <p className="text-lg font-semibold">Training and Placement Cell Website</p>
          </div>
          <div className="">
            <a href="/admin/dashboard" className="font-semibold hover:text-blue-300 mr-4">
              Dashboard
            </a>
            <a href="/admin/gallery" className="font-semibold hover:text-blue-300 mr-4">
              Gallery
            </a>
            <a href="/admin/job-postings" className="font-semibold hover:text-blue-300 mr-4">
              Job Postings
            </a>
            <a href="/admin/training-program" className="text-blue-300 font-semibold mr-4">
              Training Programs
            </a>
            <a href="/admin/users" className="font-semibold hover:text-blue-300 mr-4">
              Users
            </a>
            <a href="/admin/profile" className="font-semibold hover:text-blue-300 mr-4">
            Profile
            </a>
            <a href="/" className="font-semibold hover:text-blue-300 mr-4">
              Logout
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Training Programs Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-fit">
          {trainingPrograms.length > 0 ? (
            trainingPrograms.map((training) => (
              <div key={training._id} className="p-4 mb-5 rounded-lg shadow-lg border">
                <span className="bg-yellow-200 text-yellow-800 text-sm px-2 py-1 rounded">
                  {training.status || "Pending"}
                </span>
                <span className="bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded ml-2">
                  {training.type}
                </span>
                
                <h3 className="font-bold text-gray-800 mt-2">{training.title}</h3>
                <p className="text-gray-600 text-sm">By {training.provider}</p>
                <p className="mt-2 text-gray-700 line-clamp-2">{training.description}</p>

                {openTraining === training._id && (
                  <div className="mt-4">
                    <h4 className="text-black font-semibold mt-2">
                      Location: <span className="text-blue-600 font-light">{training.location}</span>
                    </h4>
                    
                    <h4 className="text-black font-semibold mt-2">Skills Covered:</h4>
                    <ul className="list-disc list-inside text-gray-700 pl-5">
                      {training.skillsCovered?.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>

                    <h4 className="text-black font-semibold mt-2">Duration: 
                      <span className="text-blue-600 font-light">
                        {training.duration} {training.durationUnit}
                      </span>
                    </h4>

                    <h4 className="text-black font-semibold mt-2">
                      Dates: <span className="text-blue-600 font-light">
                        {new Date(training.startDate).toLocaleDateString()} - {new Date(training.endDate).toLocaleDateString()}
                      </span>
                    </h4>

                    <div className="p-2 flex justify-between items-center gap-6 mt-4">
                      <button
                        onClick={() => handleApprove(training)}
                        className="w-full cursor-pointer p-2.5 border-2 border-green-500 text-green-500 hover:text-white hover:bg-green-500 rounded-3xl"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(training._id)}
                        className="w-full cursor-pointer p-2.5 border-2 border-red-500 text-red-500 hover:text-white rounded-3xl hover:bg-red-500"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setOpenTraining(prev => prev === training._id ? null : training._id)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {openTraining === training._id ? "Hide Details" : "View Details"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-black text-xl col-span-2 text-center">No pending training programs</p>
          )}
        </div>
      </div>
    </div>
  );
}


