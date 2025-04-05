"use client";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify"
// import { useEffect } from "react"
import { useRouter } from "next/navigation"


export default function Home() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [openItem, setOpenItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [interestedStudents, setInterestedStudents] = useState([]);
  const [selectedInterestedJob, setSelectedInterestedJob] = useState(null);

  // Form states
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "Internship",
    description: "",
    requirements: [],
    responsibilities: [],
    salary: null,
    salary_type: "Annual",
    duration: null,
    duration_unit: "months",
    application_deadline: "",
    apply_link: "",
  });

  const [newTraining, setNewTraining] = useState({
    title: "",
    provider: "",
    location: "",
    type: "Workshop",
    description: "",
    skillsCovered: [],
    prerequisites: [],
    duration: 1,
    durationUnit: "days",
    startDate: "",
    endDate: "",
    registrationLink: "",
    status: "Pending Approval"
  });

  const router = useRouter()
  
  const AuthorizeUser = async () => {
    try {
      const email = sessionStorage.getItem("officerEmail")
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



      return router.push("/officer/dashboard")

    } catch (error) {
      console.error(error)
      toast("Something went wrong")
      return router.push("/")
    }
  }

  useEffect(() => {
    AuthorizeUser()
    const fetchData = async () => {
      try {
        const [jobsRes, notifsRes, trainingsRes] = await Promise.all([
          axios.get("/api/admin/dashboard"),
          axios.get("/api/notifications"),
          axios.get("/api/admin/trainings")
        ]);
        
        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
        setNotifs(Array.isArray(notifsRes.data) ? notifsRes.data : []);
        setTrainings(Array.isArray(trainingsRes.data) ? trainingsRes.data : []);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set empty arrays if there's an error
        setJobs([]);
        setTrainings([]);
        setNotifs([]);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const fetched = await axios.get("/api/admin/dashboard");
    const trainingsRes = await axios.get("/api/admin/trainings");
    
    setCards(fetched.data);
    setTrainings(trainingsRes.data.trainings || trainingsRes.data); // Handle both formats
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
  const filteredItems = useMemo(() => {
    const searchTerm = search.toLowerCase();
    const filteredJobs = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm)
    );
    
    const filteredTrainings = trainings.filter(training =>
      training.title.toLowerCase().includes(searchTerm) ||
      training.provider.toLowerCase().includes(searchTerm)
    );

    return [...filteredJobs, ...filteredTrainings];
  }, [jobs, trainings, search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "requirements" || name === "responsibilities") {
      setNewJob({
        ...newJob,
        [name]: value.split(",").map(item => item.trim()),
      });
    } else {
      setNewJob({ ...newJob, [name]: value });
    }
  };

  const handleTrainingInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "skillsCovered" || name === "prerequisites") {
      setNewTraining({ 
        ...newTraining, 
        [name]: value.split(",").map(item => item.trim()) 
      });
    } else {
      setNewTraining({ ...newTraining, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/admin/job-postings", newJob);
      setIsModalOpen(false);
      setNewJob({
        title: "",
        company: "",
        location: "",
        type: "Internship",
        description: "",
        requirements: [],
        responsibilities: [],
        salary: null,
        salary_type: "Annual",
        duration: null,
        duration_unit: "months",
        application_deadline: "",
        apply_link: "",
      });
      // Refresh jobs
      const res = await axios.get("/api/admin/dashboard");
      setJobs(res.data);
    } catch (error) {
      console.error("Error adding job posting:", error);
    }
  };

  const handleTrainingSubmit = async () => {
    try {
      await axios.post("/api/admin/trainings", newTraining);
      setIsTrainingModalOpen(false);
      setNewTraining({
        title: "",
        provider: "",
        location: "",
        type: "Workshop",
        description: "",
        skillsCovered: [],
        prerequisites: [],
        duration: 1,
        durationUnit: "days",
        startDate: "",
        endDate: "",
        registrationLink: "",
        status: "Pending Approval"
      });
      // Refresh trainings
      const res = await axios.get("/api/admin/trainings");
      setTrainings(res.data);
      alert("Training program submitted successfully!");
    } catch (error) {
      console.error("Error submitting training:", error);
      alert("Failed to submit training. Please try again.");
    }
  };

  const handleViewInterested = async (jobId) => {
    try {
      const res = await axios.get(`/api/admin/job-postings/${jobId}/interested`);
      setInterestedStudents(res.data);
      setSelectedInterestedJob(jobId);
    } catch (error) {
      console.error("Error fetching interested students:", error);
    }
  };
  const handleLogout = () => {
    sessionStorage.removeItem("studentId");
    sessionStorage.removeItem("userEmail"); // if you store email too
    window.location.href = "/"; // redirect to homepage or login
  };
  
  return (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <div className="bg-blue-900 text-white py-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="IIIT Logo" className="w-12" />
            <p className="text-lg font-semibold">Training and Placement Cell Website</p>
          </div>
          <div>
            <a href="/officer/dashboard" className="text-blue-300 font-semibold mr-5">Dashboard</a>
            <button onClick={() => setIsModalOpen(true)} className="hover:text-blue-400 mr-5">Add Job</button>
            <button onClick={() => setIsTrainingModalOpen(true)} className="hover:text-blue-400 mr-5">Add Training</button>
            <a href="/officer/training" className="hover:text-blue-400 mr-5">Approved Training</a>
            <a href="/admin/profile" className="hover:text-blue-400">Profile</a>
            <button onClick={() => handleLogout(true)} className="hover:text-blue-400 mr-5">Logout</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Officer Dashboard</h1>
        
        {/* Search Bar */}
        <div className="flex justify-center mt-6">
          <input
            type="text"
            placeholder="Search jobs or trainings..."
            className="bg-white px-4 py-2 rounded border text-black w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-4 gap-6 p-6">
          {/* Notifications Section */}
          <div className="p-6 col-span-1 justify-items-center">
            <h3 className="font-bold text-black text-lg">Notifications</h3>
            <div className="p-6 mb-5 rounded-lg shadow-lg border w-80 text-center h-9/12">
              {notifs.length > 0 ? (
                notifs.map((notif) => (
                  <p key={notif._id} className="text-gray-700 text-xl">
                    {notif.message}
                  </p>
                ))
              ) : (
                <p className="text-black text-xl">No New Notifications</p>
              )}
            </div>
          </div>

          {/* Jobs and Trainings Section */}
          <div className="p-6 col-span-3 justify-items-center">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item._id} className="p-4 mb-5 rounded-lg shadow-lg border w-full">
                  <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">
                    {item.type || 'Training Program'}
                  </span>
                  <h3 className="font-bold text-gray-800 mt-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.company || item.provider}</p>
                  <p className="mt-2 text-gray-700">{item.description}</p>

                  {openItem === item._id && (
                    <div>
                      <h4 className="text-black font-semibold m-auto mt-2">
                        Location: <span className="text-blue-600 font-light">{item.location}</span>
                      </h4>

                      {/* Job-specific details */}
                      {item.type && (
                        <>
                          <h4 className="text-black font-semibold m-auto mt-2">Requirements:</h4>
                          <ul className="list-disc list-inside text-gray-700 pl-5">
                            {item.requirements?.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>

                          <h4 className="text-black font-semibold m-auto mt-2">Responsibilities:</h4>
                          <ul className="list-disc list-inside text-gray-700 pl-5">
                            {item.responsibilities?.map((resp, index) => (
                              <li key={index}>{resp}</li>
                            ))}
                          </ul>

                          <h4 className="text-black font-semibold m-auto mt-2">
                            Salary: <span className="text-blue-600 font-light">{item.salary} {item.salary_type}</span>
                          </h4>

                          <h4 className="text-black font-semibold m-auto">
                            Duration: <span className="text-blue-600 font-light">
                              {item.duration === 0 || item.duration_unit === "0" || item.duration == null || item.duration_unit == null
                                ? "NA"
                                : `${item.duration} ${item.duration_unit}`}
                            </span>
                          </h4>

                          <h4 className="text-black font-semibold m-auto">
                            Deadline: <span className="text-blue-600 font-light">{item.application_deadline}</span>
                          </h4>

                          <h4 className="text-black font-semibold m-auto">
                            Apply Here: <a className="text-blue-600 font-light" href={item.apply_link}>{item.apply_link}</a>
                          </h4>
                        </>
                      )}

                      {/* Training-specific details */}
                      {!item.type && (
                        <>
                          <h4 className="text-black font-semibold m-auto mt-2">Skills Covered:</h4>
                          <ul className="list-disc list-inside text-gray-700 pl-5">
                            {item.skillsCovered?.map((skill, index) => (
                              <li key={index}>{skill}</li>
                            ))}
                          </ul>

                          <h4 className="text-black font-semibold m-auto mt-2">Prerequisites:</h4>
                          <ul className="list-disc list-inside text-gray-700 pl-5">
                            {item.prerequisites?.map((prereq, index) => (
                              <li key={index}>{prereq}</li>
                            ))}
                          </ul>

                          <h4 className="text-black font-semibold m-auto mt-2">
                            Duration: <span className="text-blue-600 font-light">
                              {item.duration} {item.durationUnit}
                            </span>
                          </h4>

                          <h4 className="text-black font-semibold m-auto">
                            Dates: <span className="text-blue-600 font-light">
                              {item.startDate} to {item.endDate}
                            </span>
                          </h4>

                          <h4 className="text-black font-semibold m-auto">
                            Status: <span className="text-blue-600 font-light">{item.status}</span>
                          </h4>

                          <h4 className="text-black font-semibold m-auto">
                            Register Here: <a className="text-blue-600 font-light" href={item.registrationLink}>
                              {item.registrationLink}
                            </a>
                          </h4>
                        </>
                      )}
                    </div>
                  )}
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => setOpenItem(prev => prev === item._id ? null : item._id)}
                      className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded"
                    >
                      {openItem === item._id ? "Hide Details" : "View Details"}
                    </button>
                    {item.type && (
                      <button
                        onClick={() => handleViewInterested(item._id)}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                      >
                        View Interested
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black text-2xl">No Results Found</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-1/3 h-3/5 overflow-y-scroll rounded-lg">
            <h2 className="text-xl font-bold text-black mb-4">Add Job Posting</h2>
            <input
              type="text"
              name="title"
              placeholder="Title*"
              className="border p-2 w-full my-2 text-black"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Company*"
              className="border p-2 w-full my-2 text-black"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location*"
              className="border p-2 w-full my-2 text-black"
              onChange={handleInputChange}
              required
            />
            <select
              name="type"
              className="border p-2 w-full my-2 text-black"
              onChange={handleInputChange}
              required
            >
              <option value="Internship">Internship</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>
            <textarea
              name="description"
              placeholder="Description*"
              className="border p-2 w-full my-2 text-black"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="requirements"
              placeholder="Requirements (comma separated)*"
              className="border p-2 w-full my-2 text-black"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="responsibilities"
              placeholder="Responsibilities (comma separated)"
              className="border p-2 w-full my-2 text-black"
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="salary"
              placeholder="Salary"
              className="border p-2 w-full my-2 text-black"
              min="1"
              onChange={handleInputChange}
            />
            <select
              name="salary_type"
              className="border p-2 w-full my-2 text-black"
              onChange={handleInputChange}
            >
              <option value="Annual">Annual</option>
              <option value="Monthly">Monthly</option>
              <option value="Stipend/month">Stipend/month</option>
              <option value="Hourly">Hourly</option>
            </select>
            <input
              type="number"
              name="duration"
              placeholder="Duration"
              className="border p-2 w-full my-2 text-black"
              min="0"
              onChange={handleInputChange}
            />
            <select
              name="duration_unit"
              className="border p-2 w-full my-2 text-black"
              onChange={handleInputChange}
            >
              <option value="weeks">weeks</option>
              <option value="months">months</option>
              <option value="years">years</option>
            </select>
            <input
              type="date"
              name="application_deadline"
              className="border p-2 w-full my-2 text-black"
              onChange={handleInputChange}
              required
            />
            <input
              type="url"
              name="apply_link"
              placeholder="Apply Link*"
              className="border p-2 w-full my-2 text-black"
              onChange={handleInputChange}
              required
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Training Modal */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 w-1/2 max-h-[80vh] overflow-y-auto rounded-lg border border-gray-300">
            <h2 className="text-2xl font-bold mb-4 text-black">Create New Training Program</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-black mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={newTraining.title}
                  onChange={handleTrainingInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-black mb-1">Provider*</label>
                <input
                  type="text"
                  name="provider"
                  value={newTraining.provider}
                  onChange={handleTrainingInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-black mb-1">Type*</label>
                <select
                  name="type"
                  value={newTraining.type}
                  onChange={handleTrainingInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Certification">Certification</option>
                  <option value="Technical">Technical</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>

              <div>
                <label className="block text-black mb-1">Location*</label>
                <input
                  type="text"
                  name="location"
                  value={newTraining.location}
                  onChange={handleTrainingInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-black mb-1">Description*</label>
                <textarea
                  name="description"
                  value={newTraining.description}
                  onChange={handleTrainingInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-black mb-1">Skills Covered (comma separated)</label>
                <input
                  type="text"
                  name="skillsCovered"
                  value={newTraining.skillsCovered.join(", ")}
                  onChange={handleTrainingInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                />
              </div>

              <div>
                <label className="block text-black mb-1">Prerequisites (comma separated)</label>
                <input
                  type="text"
                  name="prerequisites"
                  value={newTraining.prerequisites.join(", ")}
                  onChange={handleTrainingInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                />
              </div>

              <div>
                <label className="block text-black mb-1">Duration*</label>
                <div className="flex">
                  <input
                    type="number"
                    name="duration"
                    value={newTraining.duration}
                    onChange={handleTrainingInputChange}
                    className="w-1/2 p-2 border border-gray-300 rounded text-black"
                    min="1"
                    required
                  />
                  <select
                    name="durationUnit"
                    value={newTraining.durationUnit}
                    onChange={handleTrainingInputChange}
                    className="w-1/2 p-2 border border-gray-300 rounded ml-2 text-black"
                    required
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-black mb-1">Start Date*</label>
                <input
                  type="date"
                  name="startDate"
                  value={newTraining.startDate}
                  onChange={handleTrainingInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-black mb-1">End Date*</label>
                <input
                  type="date"
                  name="endDate"
                  value={newTraining.endDate}
                  onChange={handleTrainingInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-black mb-1">Registration Link*</label>
                <input
                  type="url"
                  name="registrationLink"
                  value={newTraining.registrationLink}
                  onChange={handleTrainingInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setIsTrainingModalOpen(false)}
                className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleTrainingSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interested Students Modal */}
      {/* {selectedInterestedJob && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-1/3 max-h-[80vh] overflow-y-auto rounded-lg">
            <h2 className="text-xl font-bold text-black mb-4">
              Interested Students ({interestedStudents.length})
            </h2>
            {interestedStudents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {interestedStudents.map((student) => (
                  <li key={student._id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {student.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.branch} • {student.batch}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No students have expressed interest yet.</p>
            )}
            <button
              onClick={() => {
                setSelectedInterestedJob(null);
                setInterestedStudents([]);
              }}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )} */}

      {selectedInterestedJob && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-1/3 max-h-[80vh] overflow-y-auto rounded-lg">
            <h2 className="text-xl font-bold text-black mb-4">
              Interested Students ({interestedStudents.length})
            </h2>
            {interestedStudents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {interestedStudents.map((student) => (
                  <li key={student._id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {student.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.branch} • {student.batch}
                        </p>
                      </div>
                      <a
                        href={"/student/profile/${student._id}"}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Profile
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No students have expressed interest yet.</p>
            )}
            <button
              onClick={() => {
                setSelectedInterestedJob(null);
                setInterestedStudents([]);
              }}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// "use client";
// import axios from "axios";
// import { useEffect, useState, useMemo } from "react";

// export default function Home() {
//   const [search, setSearch] = useState("");
//   const [jobs, setJobs] = useState([]);
//   const [trainings, setTrainings] = useState([]);
//   const [notifs, setNotifs] = useState([]);
//   const [openItem, setOpenItem] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
//   const [interestedStudents, setInterestedStudents] = useState([]);
//   const [selectedInterestedJob, setSelectedInterestedJob] = useState(null);

//   // Form states
//   const [newJob, setNewJob] = useState({
//     title: "",
//     company: "",
//     location: "",
//     type: "Internship",
//     description: "",
//     requirements: [],
//     responsibilities: [],
//     salary: null,
//     salary_type: "Annual",
//     duration: null,
//     duration_unit: "months",
//     application_deadline: "",
//     apply_link: "",
//   });

//   const [newTraining, setNewTraining] = useState({
//     title: "",
//     provider: "",
//     location: "",
//     type: "Workshop",
//     description: "",
//     skillsCovered: [],
//     prerequisites: [],
//     duration: 1,
//     durationUnit: "days",
//     startDate: "",
//     endDate: "",
//     registrationLink: "",
//     status: "Pending Approval"
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [jobsRes, notifsRes, trainingsRes] = await Promise.all([
//           axios.get("/api/admin/dashboard"),
//           axios.get("/api/notifications"),
//           axios.get("/api/admin/trainings")
//         ]);
        
//         setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
//         setNotifs(Array.isArray(notifsRes.data) ? notifsRes.data : []);
//         setTrainings(Array.isArray(trainingsRes.data) ? trainingsRes.data : []);
        
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         // Set empty arrays if there's an error
//         setJobs([]);
//         setTrainings([]);
//         setNotifs([]);
//       }
//     };
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//   try {
//     const fetched = await axios.get("/api/admin/dashboard");
//     const trainingsRes = await axios.get("/api/admin/trainings");
    
//     setCards(fetched.data);
//     setTrainings(trainingsRes.data.trainings || trainingsRes.data); // Handle both formats
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };
//   const filteredItems = useMemo(() => {
//     const searchTerm = search.toLowerCase();
//     const filteredJobs = jobs.filter(job => 
//       job.title.toLowerCase().includes(searchTerm) ||
//       job.company.toLowerCase().includes(searchTerm)
//     );
    
//     const filteredTrainings = trainings.filter(training =>
//       training.title.toLowerCase().includes(searchTerm) ||
//       training.provider.toLowerCase().includes(searchTerm)
//     );

//     return [...filteredJobs, ...filteredTrainings];
//   }, [jobs, trainings, search]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "requirements" || name === "responsibilities") {
//       setNewJob({
//         ...newJob,
//         [name]: value.split(",").map(item => item.trim()),
//       });
//     } else {
//       setNewJob({ ...newJob, [name]: value });
//     }
//   };

//   const handleTrainingInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "skillsCovered" || name === "prerequisites") {
//       setNewTraining({ 
//         ...newTraining, 
//         [name]: value.split(",").map(item => item.trim()) 
//       });
//     } else {
//       setNewTraining({ ...newTraining, [name]: value });
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       await axios.post("/api/admin/job-postings", newJob);
//       setIsModalOpen(false);
//       setNewJob({
//         title: "",
//         company: "",
//         location: "",
//         type: "Internship",
//         description: "",
//         requirements: [],
//         responsibilities: [],
//         salary: null,
//         salary_type: "Annual",
//         duration: null,
//         duration_unit: "months",
//         application_deadline: "",
//         apply_link: "",
//       });
//       // Refresh jobs
//       const res = await axios.get("/api/admin/dashboard");
//       setJobs(res.data);
//     } catch (error) {
//       console.error("Error adding job posting:", error);
//     }
//   };

//   const handleTrainingSubmit = async () => {
//     try {
//       await axios.post("/api/admin/trainings", newTraining);
//       setIsTrainingModalOpen(false);
//       setNewTraining({
//         title: "",
//         provider: "",
//         location: "",
//         type: "Workshop",
//         description: "",
//         skillsCovered: [],
//         prerequisites: [],
//         duration: 1,
//         durationUnit: "days",
//         startDate: "",
//         endDate: "",
//         registrationLink: "",
//         status: "Pending Approval"
//       });
//       // Refresh trainings
//       const res = await axios.get("/api/admin/trainings");
//       setTrainings(res.data);
//       alert("Training program submitted successfully!");
//     } catch (error) {
//       console.error("Error submitting training:", error);
//       alert("Failed to submit training. Please try again.");
//     }
//   };

//   const handleViewInterested = async (jobId) => {
//     try {
//       const res = await axios.get(`/api/admin/job-postings/${jobId}/interested`);
//       setInterestedStudents(res.data);
//       setSelectedInterestedJob(jobId);
//     } catch (error) {
//       console.error("Error fetching interested students:", error);
//     }
//   };

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
//             <a href="/officer/dashboard" className="text-blue-300 font-semibold mr-5">Dashboard</a>
//             <button onClick={() => setIsModalOpen(true)} className="hover:text-blue-400 mr-5">Add Job</button>
//             <button onClick={() => setIsTrainingModalOpen(true)} className="hover:text-blue-400 mr-5">Add Training</button>
//             <a href="/admin/profile" className="hover:text-blue-400">Profile</a>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8 flex-grow">
//         <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Officer Dashboard</h1>
        
//         {/* Search Bar */}
//         <div className="flex justify-center mt-6">
//           <input
//             type="text"
//             placeholder="Search jobs or trainings..."
//             className="bg-white px-4 py-2 rounded border text-black w-80"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-4 gap-6 p-6">
//           {/* Notifications Section */}
//           <div className="p-6 col-span-1 justify-items-center">
//             <h3 className="font-bold text-black text-lg">Notifications</h3>
//             <div className="p-6 mb-5 rounded-lg shadow-lg border w-80 text-center h-9/12">
//               {notifs.length > 0 ? (
//                 notifs.map((notif) => (
//                   <p key={notif._id} className="text-gray-700 text-xl">
//                     {notif.message}
//                   </p>
//                 ))
//               ) : (
//                 <p className="text-black text-xl">No New Notifications</p>
//               )}
//             </div>
//           </div>

//           {/* Jobs and Trainings Section */}
//           <div className="p-6 col-span-3 justify-items-center">
//             {filteredItems.length > 0 ? (
//               filteredItems.map((item) => (
//                 <div key={item._id} className="p-4 mb-5 rounded-lg shadow-lg border w-full">
//                   <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">
//                     {item.type || 'Training Program'}
//                   </span>
//                   <h3 className="font-bold text-gray-800 mt-2">{item.title}</h3>
//                   <p className="text-gray-600 text-sm">{item.company || item.provider}</p>
//                   <p className="mt-2 text-gray-700">{item.description}</p>

//                   {openItem === item._id && (
//                     <div>
//                       <h4 className="text-black font-semibold m-auto mt-2">
//                         Location: <span className="text-blue-600 font-light">{item.location}</span>
//                       </h4>

//                       {/* Job-specific details */}
//                       {item.type && (
//                         <>
//                           <h4 className="text-black font-semibold m-auto mt-2">Requirements:</h4>
//                           <ul className="list-disc list-inside text-gray-700 pl-5">
//                             {item.requirements?.map((req, index) => (
//                               <li key={index}>{req}</li>
//                             ))}
//                           </ul>

//                           <h4 className="text-black font-semibold m-auto mt-2">Responsibilities:</h4>
//                           <ul className="list-disc list-inside text-gray-700 pl-5">
//                             {item.responsibilities?.map((resp, index) => (
//                               <li key={index}>{resp}</li>
//                             ))}
//                           </ul>

//                           <h4 className="text-black font-semibold m-auto mt-2">
//                             Salary: <span className="text-blue-600 font-light">{item.salary} {item.salary_type}</span>
//                           </h4>

//                           <h4 className="text-black font-semibold m-auto">
//                             Duration: <span className="text-blue-600 font-light">
//                               {item.duration === 0 || item.duration_unit === "0" || item.duration == null || item.duration_unit == null
//                                 ? "NA"
//                                 : `${item.duration} ${item.duration_unit}`}
//                             </span>
//                           </h4>

//                           <h4 className="text-black font-semibold m-auto">
//                             Deadline: <span className="text-blue-600 font-light">{item.application_deadline}</span>
//                           </h4>

//                           <h4 className="text-black font-semibold m-auto">
//                             Apply Here: <a className="text-blue-600 font-light" href={item.apply_link}>{item.apply_link}</a>
//                           </h4>
//                         </>
//                       )}

//                       {/* Training-specific details */}
//                       {!item.type && (
//                         <>
//                           <h4 className="text-black font-semibold m-auto mt-2">Skills Covered:</h4>
//                           <ul className="list-disc list-inside text-gray-700 pl-5">
//                             {item.skillsCovered?.map((skill, index) => (
//                               <li key={index}>{skill}</li>
//                             ))}
//                           </ul>

//                           <h4 className="text-black font-semibold m-auto mt-2">Prerequisites:</h4>
//                           <ul className="list-disc list-inside text-gray-700 pl-5">
//                             {item.prerequisites?.map((prereq, index) => (
//                               <li key={index}>{prereq}</li>
//                             ))}
//                           </ul>

//                           <h4 className="text-black font-semibold m-auto mt-2">
//                             Duration: <span className="text-blue-600 font-light">
//                               {item.duration} {item.durationUnit}
//                             </span>
//                           </h4>

//                           <h4 className="text-black font-semibold m-auto">
//                             Dates: <span className="text-blue-600 font-light">
//                               {item.startDate} to {item.endDate}
//                             </span>
//                           </h4>

//                           <h4 className="text-black font-semibold m-auto">
//                             Status: <span className="text-blue-600 font-light">{item.status}</span>
//                           </h4>

//                           <h4 className="text-black font-semibold m-auto">
//                             Register Here: <a className="text-blue-600 font-light" href={item.registrationLink}>
//                               {item.registrationLink}
//                             </a>
//                           </h4>
//                         </>
//                       )}
//                     </div>
//                   )}
//                   <div className="mt-4 flex gap-4">
//                     <button
//                       onClick={() => setOpenItem(prev => prev === item._id ? null : item._id)}
//                       className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded"
//                     >
//                       {openItem === item._id ? "Hide Details" : "View Details"}
//                     </button>
//                     {item.type && (
//                       <button
//                         onClick={() => handleViewInterested(item._id)}
//                         className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
//                       >
//                         View Interested
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-black text-2xl">No Results Found</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add Job Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 w-1/3 h-3/5 overflow-y-scroll rounded-lg">
//             <h2 className="text-xl font-bold text-black mb-4">Add Job Posting</h2>
//             <input
//               type="text"
//               name="title"
//               placeholder="Title*"
//               className="border p-2 w-full my-2 text-black"
//               onChange={handleInputChange}
//               required
//             />
//             <input
//               type="text"
//               name="company"
//               placeholder="Company*"
//               className="border p-2 w-full my-2 text-black"
//               onChange={handleInputChange}
//               required
//             />
//             <input
//               type="text"
//               name="location"
//               placeholder="Location*"
//               className="border p-2 w-full my-2 text-black"
//               onChange={handleInputChange}
//               required
//             />
//             <select
//               name="type"
//               className="border p-2 w-full my-2 text-black"
//               onChange={handleInputChange}
//               required
//             >
//               <option value="Internship">Internship</option>
//               <option value="Full-Time">Full-Time</option>
//               <option value="Part-Time">Part-Time</option>
//               <option value="Contract">Contract</option>
//             </select>
//             <textarea
//               name="description"
//               placeholder="Description*"
//               className="border p-2 w-full my-2 text-black"
//               onChange={handleInputChange}
//               required
//             />
//             <input
//               type="text"
//               name="requirements"
//               placeholder="Requirements (comma separated)*"
//               className="border p-2 w-full my-2 text-black"
//               onChange={handleInputChange}
//               required
//             />
//             <input
//               type="text"
//               name="responsibilities"
//               placeholder="Responsibilities (comma separated)"
//               className="border p-2 w-full my-2 text-black"
//               onChange={handleInputChange}
//             />
//             <input
//               type="number"
//               name="salary"
//               placeholder="Salary"
//               className="border p-2 w-full my-2 text-black"
//               min="1"
//               onChange={handleInputChange}
//             />
//             <select
//               name="salary_type"
//               className="border p-2 w-full my-2 text-black"
//               onChange={handleInputChange}
//             >
//               <option value="Annual">Annual</option>
//               <option value="Monthly">Monthly</option>
//               <option value="Stipend/month">Stipend/month</option>
//               <option value="Hourly">Hourly</option>
//             </select>
//             <input
//               type="number"
//               name="duration"
//               placeholder="Duration"
//               className="border p-2 w-full my-2 text-black"
//               min="0"
//               onChange={handleInputChange}
//             />
//             <select
//               name="duration_unit"
//               className="border p-2 w-full my-2 text-black"
//               onChange={handleInputChange}
//             >
//               <option value="weeks">weeks</option>
//               <option value="months">months</option>
//               <option value="years">years</option>
//             </select>
//             <input
//               type="date"
//               name="application_deadline"
//               className="border p-2 w-full my-2 text-black"
//               onChange={handleInputChange}
//               required
//             />
//             <input
//               type="url"
//               name="apply_link"
//               placeholder="Apply Link*"
//               className="border p-2 w-full my-2 text-black"
//               onChange={handleInputChange}
//               required
//             />
//             <div className="flex justify-between mt-4">
//               <button
//                 onClick={handleSubmit}
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 Submit
//               </button>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Training Modal */}
//       {isTrainingModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-start pt-20 z-50">
//           <div className="bg-white p-6 w-1/2 max-h-[80vh] overflow-y-auto rounded-lg border border-gray-300">
//             <h2 className="text-2xl font-bold mb-4 text-black">Create New Training Program</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <label className="block text-black mb-1">Title*</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={newTraining.title}
//                   onChange={handleTrainingInputChange}
//                   className="w-full p-2 border border-gray-300 rounded text-black"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-black mb-1">Provider*</label>
//                 <input
//                   type="text"
//                   name="provider"
//                   value={newTraining.provider}
//                   onChange={handleTrainingInputChange}
//                   className="w-full p-2 border border-gray-300 rounded text-black"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-black mb-1">Type*</label>
//                 <select
//                   name="type"
//                   value={newTraining.type}
//                   onChange={handleTrainingInputChange}
//                   className="w-full p-2 border border-gray-300 rounded text-black"
//                   required
//                 >
//                   <option value="Workshop">Workshop</option>
//                   <option value="Certification">Certification</option>
//                   <option value="Technical">Technical</option>
//                   <option value="Soft Skills">Soft Skills</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-black mb-1">Location*</label>
//                 <input
//                   type="text"
//                   name="location"
//                   value={newTraining.location}
//                   onChange={handleTrainingInputChange}
//                   className="w-full p-2 border border-gray-300 rounded text-black"
//                   required
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-black mb-1">Description*</label>
//                 <textarea
//                   name="description"
//                   value={newTraining.description}
//                   onChange={handleTrainingInputChange}
//                   className="w-full p-2 border border-gray-300 rounded text-black"
//                   rows={3}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-black mb-1">Skills Covered (comma separated)</label>
//                 <input
//                   type="text"
//                   name="skillsCovered"
//                   value={newTraining.skillsCovered.join(", ")}
//                   onChange={handleTrainingInputChange}
//                   className="w-full p-2 border border-gray-300 rounded text-black"
//                 />
//               </div>

//               <div>
//                 <label className="block text-black mb-1">Prerequisites (comma separated)</label>
//                 <input
//                   type="text"
//                   name="prerequisites"
//                   value={newTraining.prerequisites.join(", ")}
//                   onChange={handleTrainingInputChange}
//                   className="w-full p-2 border border-gray-300 rounded text-black"
//                 />
//               </div>

//               <div>
//                 <label className="block text-black mb-1">Duration*</label>
//                 <div className="flex">
//                   <input
//                     type="number"
//                     name="duration"
//                     value={newTraining.duration}
//                     onChange={handleTrainingInputChange}
//                     className="w-1/2 p-2 border border-gray-300 rounded text-black"
//                     min="1"
//                     required
//                   />
//                   <select
//                     name="durationUnit"
//                     value={newTraining.durationUnit}
//                     onChange={handleTrainingInputChange}
//                     className="w-1/2 p-2 border border-gray-300 rounded ml-2 text-black"
//                     required
//                   >
//                     <option value="hours">Hours</option>
//                     <option value="days">Days</option>
//                     <option value="weeks">Weeks</option>
//                     <option value="months">Months</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-black mb-1">Start Date*</label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={newTraining.startDate}
//                   onChange={handleTrainingInputChange}
//                   className="w-full p-2 border border-gray-300 rounded text-black"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-black mb-1">End Date*</label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={newTraining.endDate}
//                   onChange={handleTrainingInputChange}
//                   className="w-full p-2 border border-gray-300 rounded text-black"
//                   required
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-black mb-1">Registration Link*</label>
//                 <input
//                   type="url"
//                   name="registrationLink"
//                   value={newTraining.registrationLink}
//                   onChange={handleTrainingInputChange}
//                   className="w-full p-2 border border-gray-300 rounded text-black"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end mt-6 space-x-4">
//               <button
//                 onClick={() => setIsTrainingModalOpen(false)}
//                 className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 border border-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleTrainingSubmit}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Submit for Approval
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Interested Students Modal */}
//       {/* {selectedInterestedJob && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 w-1/3 max-h-[80vh] overflow-y-auto rounded-lg">
//             <h2 className="text-xl font-bold text-black mb-4">
//               Interested Students ({interestedStudents.length})
//             </h2>
//             {interestedStudents.length > 0 ? (
//               <ul className="divide-y divide-gray-200">
//                 {interestedStudents.map((student) => (
//                   <li key={student._id} className="py-4">
//                     <div className="flex items-center space-x-4">
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-gray-900 truncate">
//                           {student.name}
//                         </p>
//                         <p className="text-sm text-gray-500 truncate">
//                           {student.email}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           {student.branch} • {student.batch}
//                         </p>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">No students have expressed interest yet.</p>
//             )}
//             <button
//               onClick={() => {
//                 setSelectedInterestedJob(null);
//                 setInterestedStudents([]);
//               }}
//               className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )} */}

//       {selectedInterestedJob && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 w-1/3 max-h-[80vh] overflow-y-auto rounded-lg">
//             <h2 className="text-xl font-bold text-black mb-4">
//               Interested Students ({interestedStudents.length})
//             </h2>
//             {interestedStudents.length > 0 ? (
//               <ul className="divide-y divide-gray-200">
//                 {interestedStudents.map((student) => (
//                   <li key={student._id} className="py-4">
//                     <div className="flex items-center space-x-4">
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-gray-900 truncate">
//                           {student.name}
//                         </p>
//                         <p className="text-sm text-gray-500 truncate">
//                           {student.email}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           {student.branch} • {student.batch}
//                         </p>
//                       </div>
//                       <a
//                         href={`/student/profile/${student._id}`}
//                         className="text-blue-600 hover:underline text-sm"
//                       >
//                         View Profile
//                       </a>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">No students have expressed interest yet.</p>
//             )}
//             <button
//               onClick={() => {
//                 setSelectedInterestedJob(null);
//                 setInterestedStudents([]);
//               }}
//               className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }