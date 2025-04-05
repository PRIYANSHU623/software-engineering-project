// "use client";
// import axios from 'axios';
// import { useEffect, useState, useMemo } from 'react';

// export default function Home() {
//   const [search, setSearch] = useState("");
//   const [cards, setCards] = useState([]);
//   const [notifs, setNotifs] = useState([]);
//   const [openJob, setOpenJob] = useState(null);

//   useEffect(() => {
//     const fetchdata = async () => {
//       try {
//         const fetched = await axios.get("/api/admin/dashboard");
//         // console.log("Hello:", fetched.data);
//         setCards(fetched.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     const fetchNotifs = async () => {
//       try {
//         const fetched = await axios.get("/api/notifications");
//         // console.log("Notifs:", fetched.data);
//         setNotifs(fetched.data);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     }
//     fetchdata();
//     fetchNotifs();
//   }, []);

//   const filteredJobs = useMemo(() => {
//     return cards.filter((card) =>
//       card.title.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [cards, search]);

//   return (
//     <div className="bg-white min-h-screen">
//       {/* Navbar */}
//       <div className="bg-blue-900 text-white py-4 shadow-md sticky top-0 z-50">
//         <div className="container mx-auto flex justify-between items-center px-6">
//           <div className="flex items-center space-x-4">
//             <img src="/logo.png" alt="IIIT Logo" className="w-12" />
//             <p className="text-lg font-semibold">Training and Placement Cell Website</p>
//           </div>
//           <div>
//             <a href="/admin/dashboard" className="text-blue-300 font-semibold mr-5">Dashboard</a>
//             <a href="/admin/gallery" className="hover:text-blue-400 mr-5">Gallery</a>
//             <a href="/admin/job-postings" className="hover:text-blue-400 mr-5">Job Postings</a>
//             <a href="/admin/training-program" className="hover:text-blue-400 mr-5">Training Program</a>
//             <a href="/admin/profile" className="hover:text-blue-400">Profile</a>
//             <a href="/admin/trainings" className="hover:text-blue-400 mr-5">Trainings</a>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8 flex-grow">
//         <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h1>
//         {/* Search Bar */}
//         <div className="flex justify-center mt-6">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="bg-white px-4 py-2 rounded border text-black w-80"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-4 gap-6 p-6">
//           {/* Connect Section */}
//           <div className="p-6 col-span-1 justify-items-center">
//             <h3 className="font-bold text-black text-lg">Notifications</h3>
//             <div className="p-4 mb-5 rounded-lg shadow-lg border w-80 text-center h-9/12">
//               {notifs.length > 0 ? (notifs.map((notif) => (
//                 <p className="text-gray-700 text-sm">{notif.message}</p>
//               ))) : (<p className="text-black text-2xl">No New Notifications</p>)}
//             </div>
//           </div>

//           {/* Latest Post Section */}
//           <div className="p-6 col-span-3 justify-items-center">
//             {filteredJobs.length > 0 ? (filteredJobs.map((job) => (
//               <div key={job._id} className="p-4 mb-5 rounded-lg shadow-lg border">
//                 <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">{job.type}</span>
//                 <h3 className="font-bold text-gray-800 mt-2">{job.title}</h3>
//                 <p className="text-gray-600 text-sm">{job.company}</p>
//                 <p className="mt-2 text-gray-700">{job.description}</p>

//                 {openJob === job._id && (
//                   <div>
//                     <h4 className="text-black font-semibold m-auto mt-2">
//                       Location: <span className="text-blue-600 font-light">{job.location}</span>
//                     </h4>
//                     {/* Requirements List */}
//                     <h4 className="text-black font-semibold m-auto mt-2">Requirements:</h4>
//                     <ul className="list-disc list-inside text-gray-700 pl-5">
//                       {job.requirements.map((req, index) => (
//                         <li key={index}>{req}</li>
//                       ))}
//                     </ul>

//                     {/* Responsibilities List */}
//                     <h4 className="text-black font-semibold m-auto mt-2">Responsibilities:</h4>
//                     <ul className="list-disc list-inside text-gray-700 pl-5">
//                       {job.responsibilities.map((resp, index) => (
//                         <li key={index}>{resp}</li>
//                       ))}
//                     </ul>

//                     {/* Salary */}
//                     <h4 className="text-black font-semibold m-auto mt-2">
//                       Salary: <span className="text-blue-600 font-light">{job.salary} {job.salary_type}</span>
//                     </h4>

//                     <h4 className="text-black font-semibold m-auto">
//                       Duration: {" "}
//                       <span className="text-blue-600 font-light">
//                         {(job.duration === 0 || job.duration_unit === "0" || job.duration == null || job.duration_unit == null)
//                           ? "NA"
//                           : `${job.duration} ${job.duration_unit}`}
//                       </span>
//                     </h4>

//                     {/* Application Deadline */}
//                     <h4 className="text-black font-semibold m-auto">
//                       Deadline: <span className="text-blue-600 font-light">{job.application_deadline}</span>
//                     </h4>

//                     {/* Apply Link */}
//                     <h4 className="text-black font-semibold m-auto">
//                       Apply Here: <a className="text-blue-600 font-light" href={job.apply_link}>{job.apply_link}</a>
//                     </h4>
//                   </div>
//                 )}
//                 <button
//                   onClick={() => {
//                     setOpenJob((prev) => (prev === job._id ? null : job._id));
//                   }}
//                   className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//                 >
//                   {openJob === job._id ? "Hide Details" : "View Details"}
//                 </button>
//               </div>
//             ))
//             ) : (<p className="text-black text-2xl">No Results Found</p>)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import axios from "axios";
import { useEffect, useState, useMemo } from "react";

export default function Home() {
  const [openJob, setOpenJob] = useState(null);
  const [search, setSearch] = useState("");
  const [cards, setCards] = useState([]);
  const [notifs, setNotifs] = useState([]);

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
        toast("Something went wrong!")
        return router.push("/")
      }

      const data = await response.json()
      console.log(data)

      if (data.role !== "ADMIN") {
        return router.push("/unauthorized")
      }

      return router.push("/admin/dashboard")

    } catch (error) {
      console.error(error)
      toast("Something went wrong")
      return router.push("/")
    }
  }

  useEffect(() => {
    AuthorizeUser()
    const fetchdata = async () => {
      try {
        const fetched = await axios.get("/api/admin/dashboard");
        setCards(fetched.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchNotifs = async () => {
      try {
        const fetched = await axios.get("/api/notifications");
        setNotifs(fetched.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchdata();
    fetchNotifs();
  }, []);

  const filteredJobs = useMemo(() => {
    return cards.filter((card) =>
      card.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [cards, search]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <header className="bg-blue-900 text-white py-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="IIIT Logo" className="w-12" />
            <p className="text-xl font-semibold">Training &amp; Placement Cell</p>
          </div>
          <nav className="space-x-4">
            <a
              href="/admin/dashboard"
              className="text-blue-300 hover:text-white font-semibold"
            >
              Dashboard
            </a>
            <a
              href="/admin/gallery"
              className="hover:text-white transition-colors"
            >
              Gallery
            </a>
            <a
              href="/admin/job-postings"
              className="hover:text-white transition-colors"
            >
              Job Postings
            </a>
            <a
              href="/admin/users"
              className="hover:text-white transition-colors"
            >
              Users
            </a>
            <a
              href="/admin/profile"
              className="hover:text-white transition-colors"
            >
              Profile
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          Admin Dashboard
        </h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search job postings..."
          className="w-full max-w-md px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Notifications Section */}
          <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow border">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifs.length > 0 ? (
                notifs.map((notif, index) => (
                  <p
                    key={notif._id || index}
                    className="p-2 bg-gray-100 rounded text-gray-700 text-sm hover:bg-gray-200 transition"
                  >
                    {notif.message}
                  </p>
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg">
                  No New Notifications
                </p>
              )}
            </div>
          </aside>

          {/* Job Postings Section */}
          <section className="lg:col-span-3 space-y-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">
                      {job.type}
                    </span>
                    <button
                      onClick={() =>
                        setOpenJob((prev) => (prev === job._id ? null : job._id))
                      }
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {openJob === job._id ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                  <h3 className="text-2xl font-bold mt-2 text-gray-800">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{job.company}</p>
                  <p className="mt-2 text-gray-700">{job.description}</p>

                  {openJob === job._id && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="text-gray-800 font-semibold">
                        Location:{" "}
                        <span className="text-blue-600 font-light">
                          {job.location}
                        </span>
                      </h4>

                      <div className="mt-3">
                        <h4 className="text-gray-800 font-semibold mb-1">
                          Requirements:
                        </h4>
                        <ul className="list-disc list-inside text-gray-700">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-gray-800 font-semibold mb-1">
                          Responsibilities:
                        </h4>
                        <ul className="list-disc list-inside text-gray-700">
                          {job.responsibilities.map((resp, index) => (
                            <li key={index}>{resp}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-gray-800 font-semibold">
                          Salary:{" "}
                          <span className="text-blue-600 font-light">
                            {job.salary} {job.salary_type}
                          </span>
                        </h4>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-gray-800 font-semibold">
                          Duration:{" "}
                          <span className="text-blue-600 font-light">
                            {(job.duration === 0 ||
                              job.duration_unit === "0" ||
                              job.duration == null ||
                              job.duration_unit == null)
                              ? "NA"
                              : `${job.duration} ${job.duration_unit}`}
                          </span>
                        </h4>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-gray-800 font-semibold">
                          Deadline:{" "}
                          <span className="text-blue-600 font-light">
                            {job.application_deadline}
                          </span>
                        </h4>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-gray-800 font-semibold">
                          Apply Here:{" "}
                          <a
                            className="text-blue-600 font-light hover:underline"
                            href={job.apply_link}
                          >
                            {job.apply_link}
                          </a>
                        </h4>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 text-2xl">
                No Results Found
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}