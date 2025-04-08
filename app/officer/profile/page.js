
'use client';
import { useState, useEffect } from 'react';
import Footer from "../../foot/footer";
import axios from 'axios';
import Router from 'next/router';
import { useRouter } from 'next/navigation';

function StudentNavbar() {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="IIIT Logo" className="w-12" />
            <p className="text-lg font-semibold">Training &amp; Placement Cell Website</p>
          </div>      <div>
        <a href="/officer/dashboard" className="text-white hover:text-blue-300 font-semibold mr-5">Dashboard</a>
        <a href="/officer/profile" className="text-white hover:text-blue-300 font-semibold mr-5">Add Job</a>
        <a href="/officer/profile" className="text-white hover:text-blue-300 font-semibold mr-5">Add Training</a>
        <a href="/officer/training" className="text-white hover:text-blue-300 font-semibold mr-5">Approved Training</a>
        <a href="/officer/profile" className="text-blue-300 font-semibold mr-5">Profile</a>
        <a href="/" className="text-white hover:text-blue-300 font-semibold mr-5">Logout</a>
      </div>
    </nav>
  );
}

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

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
        
        const data = await response.json()
        console.log(data)
        
        if (data.role !== "Officer") {
          // message("your data is unauthirized")
          return router.push("/unauthorized")
        }
  
        if (!response.ok) {
          alert("not response okay")
          toast("Something went wrong!")
          return router.push("/")
        }
  
  
  
        return router.push("/officer/profile")
  
      } catch (error) {
        console.error(error)
        toast("Something went wrong")
        return router.push("/")
      }
    }

  useEffect(() => {
    AuthorizeUser()
    if (typeof window !== "undefined") {
      const email = sessionStorage.getItem("userEmail");
      console.log("Fetched email from sessionStorage:", email); // Add this line
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    if (userEmail === null) return; // Wait until sessionStorage is checked
    if (!userEmail) {
      Router.push("/portal");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/officer/profile`);
        
        console.log("Response data:", res.data);
        if (res.data.ok) {
          setProfile(res.data.data);
        } else {
          setError(res.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userEmail]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <StudentNavbar />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-black">My Profile</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-md mx-auto">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <p className="mt-2">
              <a href="/portal" className="underline text-blue-600">Click here to log in again</a>
            </p>
          </div>
        )}
        {loading ? (
  <p className="text-center text-gray-600">Loading profile...</p>
) : profile ? (
  <div className="bg-white shadow-lg p-6 rounded-lg max-w-full mx-auto">
    <div className="grid grid-cols-3 gap-4 text-lg text-center">
      {/* Header Row */}
      <div className="font-bold text-green-800">Name</div>
      <div className="font-bold text-green-800">Email</div>
      <div className="font-bold text-green-800">Batch</div>

      {/* Data Row */}
      <div className = "text-black">{profile.name}</div>
      <div className = "text-black">{profile.email}</div>
      <div className = "text-black">{profile.batch}</div>
    </div>
  </div>
) : null}

      </div>
      <Footer />
    </div>
  );
}