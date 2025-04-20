"use client";
import { useState, useEffect, useMemo } from "react";
import Footer from "../../foot/footer";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Custom Student Navbar
function StudentNavbar() {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src="/logo.png" alt="IIIT Logo" className="w-12" />
        <p className="text-lg font-semibold">Training &amp; Placement Cell</p>
      </div>
      <div>
        <a href="/student/dashboard" className="px-4 font-semibold text-blue-300">Dashboard</a>
        <a href="/student/training" className="px-4 font-semibold hover:text-blue-300">Training Program</a>
        <a href="/student/profile" className="px-4 font-semibold hover:text-blue-300">Profile</a>
        <a href="/student/applications" className="px-4 font-semibold hover:text-blue-300">My Applications</a>
        <a href="/" className="px-4 font-semibold hover:text-blue-300">Logout</a>
      </div>
    </nav>
  );
}

// Modal Component to show full job details with dropdown style
function JobDetailsModal({ job, onClose, onApply }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center pt-16 bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative max-h-[80vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">{job.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Company</h3>
              <p className="text-gray-600">{job.company}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Location</h3>
              <p className="text-gray-600">{job.location}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Job Type</h3>
              <p className="text-gray-600">{job.type}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Salary</h3>
              <p className="text-gray-600">{job.salary} {job.salary_type}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Duration</h3>
              <p className="text-gray-600">
                {job.duration && job.duration_unit 
                  ? `${job.duration} ${job.duration_unit}` 
                  : "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Deadline</h3>
              <p className="text-gray-600">{job.application_deadline}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700">Job Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>
          
          {job.apply_link && (
            <div className="pt-4">
            <button
              onClick={onClose}
              className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
              Close
            </button></div>)}

          {/* Show Apply Now only if status is approved */}
          {job.status === "approved" && (
            <div className="pt-4">
              <button
                onClick={() => onApply(job._id)}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Apply Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [jobPostings, setJobPostings] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  // const { data: session, status } = useSession();

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
    // AuthorizeUser();
    const fetchJobPostings = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        // Initialize each job's status to "none" if not set
        const updatedData = data.map((job) => ({
          ...job,
          status: job.status || "none",
        }));
        setJobPostings(updatedData);
      } catch (err) {
        console.error("Error fetching job postings:", err);
      }
    };

    const fetchAppliedJobs = async () => {
      try {
        const userEmail = sessionStorage.getItem("userEmail"); // or useSession, etc.
      if (!userEmail) {
        console.error("User email not available");
        return;
      }
        const res = await fetch(`/api/students/applied-jobs-count?email=${userEmail}`);
        const data = await res.json();
        if (data.ok) {
          setAppliedJobs(data.count);
        }
        console.log(data.count.length)
      } catch (err) {
        console.error("Error fetching applied job count:", err);
      }
    };
    

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/students/notification");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch notifications");
        setNotifications(data.notifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    

    fetchJobPostings();
    fetchAppliedJobs();
    fetchNotifications();
  }, []);

  const filteredJobPostings = useMemo(() => {
    return jobPostings.filter((job) =>
      job.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [jobPostings, search]);

  // Handle the "Interested" action
  const handleInterested = async (jobId) => {
    const studentId = sessionStorage.getItem("studentId");
    console.log("Student id is:", studentId);
  
    if (!studentId) {
      alert("Student ID not found. Please log in again.");
      return;
    }
  
    try {
      const res = await fetch(`/api/jobs/${jobId}/interested`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId }),
      });
  
      if (res.ok) {
        alert("Interest recorded successfully!");
      } else {
        let errorMsg = "Failed to mark interest";
        try {
          const data = await res.json();
          errorMsg = data?.message || errorMsg;
        } catch (e) {
          console.error("Failed to parse error JSON:", e);
        }
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Error in handleInterested:", error);
      alert("An error occurred while marking interest.");
    }
  };
  
  // Handle the "Apply" action (only available when status === "approved")
  const handleApply = async (jobId) => {
    try {
      const res = await fetch("/api/students/applied-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) {
        // Update local state to reflect that the student has applied
        setJobPostings((prev) =>
          prev.map((job) =>
            job._id === jobId ? { ...job, status: "applied" } : job
          )
        );
        // Also add the job to the applied jobs list if not already there
        const jobToApply = jobPostings.find((job) => job._id === jobId);
        if (jobToApply) {
          setAppliedJobs((prev) => [...prev, { ...jobToApply, status: "applied" }]);
        }
      } else {
        console.error("Failed to apply");
      }
    } catch (error) {
      console.error("Error in applying:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <StudentNavbar />

      <div className="container mx-auto px-6 py-10">
  <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
    Student Dashboard
  </h1>

  {/* Layout Grid: Notifications on Left, Main Dashboard on Right */}
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    {/* Notifications - Now on the Left */}
    <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow border">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h3>
      <div className="space-y-3 max-h-full overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
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

    {/* Main Dashboard Content */}
    <div className="lg:col-span-3 space-y-12">
      {/* Key Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-700">Available Jobs</h3>
          <p className="mt-2 text-4xl font-bold text-blue-600">{jobPostings.length}</p>
        </div>
        <div className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-700">Approved Job</h3>
          <p className="mt-2 text-4xl font-bold text-green-600">
            {appliedJobs ?? 0}
          </p>
        </div>
      </section>

      {/* Job Postings */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Job Postings
        </h2>
        <div className="flex justify-left mb-6">
          <input
            type="text"
            placeholder="Search job postings..."
            className="border border-gray-300 p-2 w-full text-black placeholder:text-black max-w-md rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-6">
          {filteredJobPostings.length > 0 ? (
            filteredJobPostings.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition duration-200"
              >
                <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="mt-2 text-gray-700">
                  {job.description.slice(0, 100)}...
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    View Details
                  </button>
                  {job.status === "none" && (
                    <button
                      onClick={() => handleInterested(job._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      Interested
                    </button>
                  )}
                  {job.status === "interested" && (
                    <button
                      disabled
                      className="bg-yellow-500 text-white px-4 py-2 rounded cursor-not-allowed"
                    >
                      Waiting for Approval
                    </button>
                  )}
                  {job.status === "approved" && (
                    <button
                      onClick={() => handleApply(job._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Apply
                    </button>
                  )}
                  {job.status === "applied" && (
                    <span className="bg-gray-300 text-gray-700 px-4 py-2 rounded inline-block">
                      Applied
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-2">
              No job postings found.
            </p>
          )}
        </div>
      </section>
    </div>
  </div>
</div>

      <Footer />

      {/* Modal for Job Details */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={(jobId) => {
            // Call the apply function from modal and then close it
            handleApply(jobId);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}