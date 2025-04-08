"use client";
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useState, useEffect } from "react";
import axios from "axios";

export default function JobPostingsPage() {
  const [jobPostings, setJobPostings] = useState([]);
  const [openjob, setOpenjob] = useState(false);

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

      return router.push("/admin/job-postings")

    } catch (error) {
      console.error(error)
      toast("Something went wrong")
      return router.push("/")
    }
  }

  useEffect(() => {
    AuthorizeUser()
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      const response = await axios.get("/api/admin/job-postings");
      // console.log("helo", response);
      if (!response.data.ok)
        throw new Error("Failed to fetch data");
      setJobPostings(response.data.allJobPostings);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleApprove = async (job) => {
    try {
      const response = await axios.post("/api/admin/dashboard", job);
      if (response.data.ok) {
        alert("Job approved successfully");
        await axios.post("/api/notifications", { message: "New Job Posted" });
        fetchJobPostings();
      } else {
        alert("Failed to approve job");
      }
    } catch (error) {
      console.error("Error approving job:", error);
    }
  };

  const handleReject = async (jobId) => {
    try {
      const res = await fetch(`/api/admin/job-postings`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({ id: jobId }),
      });

      const response = await res.json();

      if (response.ok) {
        fetchJobPostings();
      } else {
        alert("Failed to reject job");
      }
    } catch (error) {
      console.error("Error rejecting job:", error);
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
            <a href="/admin/job-postings" className="font-semibold text-blue-300 mr-4">
              Job Postings
            </a>
            <a href="/admin/training-program" className="font-semibold hover:text-blue-300 mr-4">Training Program</a>

            <a href="/admin/users" className="font-semibold hover:text-blue-300 mr-4">
              Users
            </a>
            <a href="/admin/profile" className="font-semibold hover:text-blue-300 mr-4">
              Profile
            </a>
            <a href="/" className="font-semibold hover:text-blue-300">
              Logout
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
          Job Postings Management
        </h1>

        <div className="grid grid-cols-2 gap-6 w-full h-fit">
          {jobPostings.length > 0 ? (
            jobPostings.map((job) => (
              <div
                key={job._id}
                className="p-4 mb-5 rounded-lg shadow-md hover:shadow-lg border"
              >
                <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">
                  {job.type}
                </span>
                <h3 className="font-bold text-gray-800 mt-2">{job.title}</h3>
                <p className="text-gray-600 text-sm">{job.company}</p>
                <p className="mt-2 text-gray-700">{job.description}</p>

                {openjob === job._id && (
                  <div>
                    <h4 className="text-black font-semibold m-auto mt-2">
                      Location: <span className="text-blue-600 font-light">{job.location}</span>
                    </h4>
                    {/* Requirements List */}
                    <h4 className="text-black font-semibold m-auto mt-2">Requirements:</h4>
                    <ul className="list-disc list-inside text-gray-700 pl-5">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>

                    {/* Responsibilities List */}
                    <h4 className="text-black font-semibold m-auto mt-2">Responsibilities:</h4>
                    <ul className="list-disc list-inside text-gray-700 pl-5">
                      {job.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>

                    {/* Salary */}
                    <h4 className="text-black font-semibold m-auto mt-2">
                      Salary: <span className="text-blue-600 font-light">{job.salary} {job.salary_type}</span>
                    </h4>

                    <h4 className="text-black font-semibold m-auto">
                      Duration: {" "}
                      <span className="text-blue-600 font-light">
                        {(job.duration === 0 || job.duration_unit === "0" || job.duration == null || job.duration_unit == null)
                          ? "NA"
                          : `${job.duration} ${job.duration_unit}`}
                      </span>
                    </h4>

                    {/* Application Deadline */}
                    <h4 className="text-black font-semibold m-auto">
                      Deadline: <span className="text-blue-600 font-light">{job.application_deadline}</span>
                    </h4>

                    {/* Apply Link */}
                    <h4 className="text-black font-semibold m-auto">
                      Apply Here: <a className="text-blue-600 font-light" href={job.apply_link}>{job.apply_link}</a>
                    </h4>

                    <div className="p-2 flex justify-between items-center gap-6">
                      <button
                        onClick={() => {
                          handleApprove(job);
                          handleReject(job._id);
                        }}
                        className="w-full cursor-pointer p-2.5 border-2 border-green-500 text-green-500 hover:text-white hover:bg-green-500 rounded-3xl"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(job._id)}
                        className="w-full cursor-pointer p-2.5 border-2 border-red-500 text-red-500 hover:text-white rounded-3xl hover:bg-red-500"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setOpenjob((prev) => (prev === job._id ? null : job._id));
                  }}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {openjob === job._id ? "Hide Details" : "View Details"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-black text-2xl w-screen text-center">No Results Found</p>
          )}
        </div>
      </div>
    </div>
  );
}
