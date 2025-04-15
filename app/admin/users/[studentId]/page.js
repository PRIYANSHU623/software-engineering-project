"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Custom Student Navbar
function StudentNavbar() {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">Student Panel</div>
      <div>
        {/* <a href="/student/dashboard" className="px-4 hover:text-gray-300">Dashboard</a>
        <a href="/student/profile" className="px-4 hover:text-gray-300">Profile</a>
        <a href="/student/applications" className="px-4 hover:text-gray-300">My Applications</a>
        <a href="/logout" className="px-4 hover:text-gray-300">Logout</a> */}
      </div>
    </nav>
  );
}

const StudentProfile = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      const fetchStudent = async () => {
        try {
          const res = await fetch(`/api/admin/user/${studentId}`);
          if (!res.ok) {
            console.error(`Request failed with status ${res.status}`);
            return alert("Failed to fetch student data");
          }
          const data = await res.json();
          if (data.ok) {
            setStudent(data.student);
          } else {
            alert("Failed to fetch student data");
          }
        } catch (error) {
          console.error("Error fetching student:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [studentId]);

  if (loading) return <p className="text-center mt-10 text-gray-700">Loading...</p>;
  if (!student) return <p className="text-center mt-10 text-red-500">Student not found.</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <StudentNavbar />

      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-800">Student Profile</h1>

        <div className="max-w-xl shadow-md hover:shadow-lg  mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{student.name}</h2>
          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-bold">Email:</span> {student.email}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Batch:</span> {student.batch}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;