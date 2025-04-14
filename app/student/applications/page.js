'use client';
import { useState, useEffect } from 'react';
import Footer from "../../foot/footer";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

function StudentNavbar() {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src="/logo.png" alt="IIIT Logo" className="w-12" />
        <p className="text-lg font-semibold">Training & Placement Cell</p>
      </div>      
      <div>
        <a href="/student/dashboard" className="px-4 font-semibold hover:text-blue-300">Dashboard</a>
        <a href="/student/training" className="px-4 font-semibold hover:text-blue-300">Training Program</a>
        <a href="/student/profile" className="px-4 font-semibold hover:text-blue-300">Profile</a>
        <a href="/student/applications" className="px-4 font-semibold text-blue-300">My Applications</a>
        <a href="/" className="px-4 font-semibold hover:text-blue-300">Logout</a>
      </div>
    </nav>
  );
}
export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

    // const router = useRouter()
    
    // const AuthorizeUser = async () => {
    //   try {
    //     const email = sessionStorage.getItem("userEmail")
    //     const response = await fetch("/api/auth/role", {
    //       method: "POST",
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({ email })
    //     })
        
    //     const data = await response.json()
    //     console.log(data)
        
    //     if (data.role !== "Student") {
    //       // message("your data is unauthirized")
    //       return router.push("/unauthorized")
    //     }
  
    //     if (!response.ok) {
    //       alert("not response okay")
    //       toast("Something went wrong!")
    //       return router.push("/")
    //     }
  
    //     return router.push("/student/dashboard")
  
    //   } catch (error) {
    //     console.error(error)
    //     toast("Something went wrong")
    //     return router.push("/")
    //   }
    // }

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    // AuthorizeUser();
    if (!userEmail) return;
    const fetchApplications = async () => {
      try {
        const res = await fetch(`/api/students/applied-jobs?email=${encodeURIComponent(userEmail)}`);
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
        <h1 className="text-4xl font-bold text-center mb-8 text-black">My Applications</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-green-700 text-black">
              <tr>
                <th className="text-left p-3">Job Title</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Stipend</th>
                <th className="text-left p-3">Duration</th>
                <th className="text-left p-3">Apply Link</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-100 text-black">
                  <td className="p-3">{app.title || app.jobTitle}</td>
                  <td className="p-3">{app.company}</td>
                  <td className="p-3">{app.salary}</td>
                  <td className="p-3">{app.duration && app.duration_unit? `${app.duration} ${app.duration_unit}`: "N/A"}</td>
                  <td className="p-3">{app.status === true ?(<a href={app.applyLink || "#"}target="_blank"rel="noopener noreferrer"className="text-black hover:text-blue-600 hover:underline">
                  Apply
                  </a>
                  ) : (
                  <span className="text-gray-500">Approval Pending.</span>)}</td>
                  <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${app.status? "bg-green-100 text-green-800": "bg-yellow-100 text-yellow-800"}`}>{app.status ? "Verified" : "Pending"}
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
