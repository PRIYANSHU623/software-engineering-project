// 'use client';
// import { useState, useEffect } from 'react';
// import Footer from "../../foot/footer";
// import axios from 'axios';
// import Router from 'next/router';

// function StudentNavbar() {
//   return (
//     <nav className="bg-green-800 text-white p-4 flex justify-between items-center">
//       <div className="text-2xl font-bold">Student Panel</div>
//       <div>
//         <a href="/student/dashboard" className="px-4 hover:text-gray-300">Dashboard</a>
//         <a href="/student/training" className="px-4 hover:text-gray-300">Training</a>
//         <a href="/student/profile" className="px-4 hover:text-gray-300">Profile</a>
//         <a href="/student/applications" className="px-4 hover:text-gray-300">My Applications</a>
//         <a href="/logout" className="px-4 hover:text-gray-300">Logout</a>
//       </div>
//     </nav>
//   );
// }

// export default function StudentProfile() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [userEmail, setUserEmail] = useState(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setUserEmail(sessionStorage.getItem("userEmail"));
//     }
//   }, []);

//   useEffect(() => {
//     if (userEmail === null) return; // Wait until sessionStorage is checked
//     if (!userEmail) {
//       Router.push("/portal");
//       return;
//     }

//     const fetchProfile = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(`/api/students/profile?email=${encodeURIComponent(userEmail)}`);
        
//         if (res.data.ok) {
//           setProfile(res.data.studentProfile);
//         } else {
//           setError(res.data.message);
//         }
//       } catch (error) {
//         console.error("Failed to fetch profile:", error);
//         setError("Failed to fetch profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userEmail]);

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <StudentNavbar />
//       <div className="container mx-auto px-6 py-10">
//         <h1 className="text-4xl font-bold text-center mb-8 text-green-800">My Profile</h1>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-md mx-auto">
//             <strong className="font-bold">Error: </strong>
//             <span className="block sm:inline">{error}</span>
//             <p className="mt-2">
//               <a href="/portal" className="underline text-blue-600">Click here to log in again</a>
//             </p>
//           </div>
//         )}
        
//         {loading ? (
//           <p className="text-center text-gray-600">Loading profile...</p>
//         ) : profile ? (
//           <div className="bg-white shadow-lg p-6 rounded-lg max-w-md mx-auto">
//             <p className="mb-4"><strong>Name:</strong> {profile.name}</p>
//             <p className="mb-4"><strong>Email:</strong> {profile.email}</p>
//             <p className="mb-4"><strong>Batch:</strong> {profile.batch}</p>
//           </div>
//         ) : null}
//       </div>
//       <Footer />
//     </div>
//   );
// }


'use client';
import { useState, useEffect } from 'react';
import Footer from "../../foot/footer";
import axios from 'axios';
import Router from 'next/router';

function StudentNavbar() {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src="/logo.png" alt="IIIT Logo" className="w-12" />
        <p className="text-lg font-semibold">Training & Placement Cell</p>
      </div>
        <div>
        <a href="/student/dashboard" className="px-4 font-semibold hover:text-blue-300">Dashboard</a>
        <a href="/student/training" className="px-4 font-semibold hover:text-blue-300">Training</a>
        <a href="/student/profile" className="px-4 font-semibold text-blue-300">Profile</a>
        <a href="/student/applications" className="px-4 font-semibold hover:text-blue-300">My Applications</a>
        <a href="/" className="px-4 font-semibold hover:text-blue-300">Logout</a>
      </div>
    </nav>
  );
}

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
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
        const res = await axios.get(`/api/students/profile?email=${encodeURIComponent(userEmail)}`);
        console.log("Response data:", res.data);
        if (res.data.ok) {
          setProfile(res.data.studentProfile);
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
        <h1 className="text-4xl font-bold text-center mb-8 text-green-800">My Profile</h1>
        
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
  <div className="bg-white shadow-md hover:shadow-lg p-6 rounded-lg max-w-full mx-auto">
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