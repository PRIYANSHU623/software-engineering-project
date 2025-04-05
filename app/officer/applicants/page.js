'use client';
import { useState, useEffect } from 'react';

import Footer from "../../foot/footer";
import { toast } from "react-toastify"
// import { useEffect } from "react"
import { useRouter } from "next/navigation"

function OfficerNavbar() {
    return (
      <nav className="bg-purple-700 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Officer Panel</div>
        <div>
          <a href="/officer/dashboard" className="px-3 hover:text-gray-300">Dashboard</a>
          <a href="/officer/postings" className="px-3 hover:text-gray-300">Manage Postings</a>
          <a href="/officer/applicants" className="px-3 hover:text-gray-300">Applicants</a>
          <a href="/officer/training" className="hover:text-blue-400 mr-5">Approved Training</a>
          <a href="/logout" className="px-3 hover:text-gray-300">Logout</a>
        </div>
      </nav>
    );
  }

export default function ApplicantsPage() {
  const [applications, setApplications] = useState([]);

  const router = useRouter()
  
  const AuthorizeUser = async () => {
    try {
      const email = sessionStorage.getItem("OfficerEmail")
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

      if (data.role !== "ADMIN") {
        return router.push("/unauthorized")
      }

      return router.push("/officer/dashboard")

    } catch (error) {
      console.error(error)
      toast("Something went wrong")
      return router.push("/")
    }
  }

  useEffect(() => {
    AuthorizeUser()
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/officer/recent-applications');
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="bg-blue-50 min-h-screen">
      <OfficerNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Applicants</h1>

        <div className="bg-white shadow rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Student Name</th>
                <th className="text-left p-2">Job Title</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b">
                  <td className="p-2">{app.studentName}</td>
                  <td className="p-2">{app.jobTitle}</td>
                  <td className="p-2">
                    <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
