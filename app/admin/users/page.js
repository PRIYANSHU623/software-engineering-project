'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", batch: ""});


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
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/admin/user");
      // console.log(response);
      if (!response.data.ok)
        throw new Error('Failed to fetch data');
      setUsers(response.data.allStudents);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/user`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({ id: userId }), // Send as an object
      });
      if (response.ok) {
        alert('User deleted successfully');
        fetchItems();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post("/api/admin/user", newUser);
      if (response.data.ok) {
        setUsers([...users, response.data.newUser]);
        setShowModal(false);
        setNewUser({ name: "", email: "", batch: "" });
      } else {
        alert("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-blue-900 text-white py-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="IIIT Logo" className="w-12" />
            <p className="text-lg font-semibold">Training and Placement Cell Website</p>
          </div>
          <div className="">
            <a href="/admin/dashboard" className="hover:text-blue-400 mr-5">
              Dashboard
            </a>
            <a href="/admin/gallery" className="hover:text-blue-400 mr-5">
              Gallery
            </a>
            <a href="/admin/job-postings" className="hover:text-blue-400 mr-5">
              Job Postings
            </a>
            <a href="/admin/users" className="text-blue-300 font-semibold mr-5">
              Users
            </a>
            <a href="/admin/profile" className="hover:text-blue-400">Profile</a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          User Management
        </h1>

        {/* Search Bar */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Add User
          </button>
          <input
            type="text"
            placeholder="Search by Batch..."
            className="px-4 py-2 border rounded-lg w-80 shadow focus:outline-none text-black focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <div className="min-w-full">
            {/* Header Row */}
            <div className="bg-gray-100 grid grid-cols-4 font-semibold text-gray-600 px-4 py-3 border-b">
              <p className="text-left">Name</p>
              <p className="text-left">Email</p>
              <p className="text-left">Batch</p>
              <p className="text-left">Actions</p>
            </div>

            {/* Users List */}
            <div>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user._id} className="grid grid-cols-4 items-center px-4 py-3 border-b hover:bg-gray-50">
                    {/* <p className="text-gray-800">{user.name}</p> */}
                    <Link href={`/admin/users/${user._id}`}>
                        <span className="text-blue-600 hover:underline cursor-pointer">{user.name}</span>
                    </Link>
                    <p className="text-gray-700">{user.email}</p>
                    <p>
                      <span className={`px-3 py-1 rounded text-sm 
                        ${user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'Placement Officer' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'}`}>
                        {user.batch}
                      </span>
                    </p>
                    <div>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 hover:text-red-800 cursor-pointer "
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No users found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl text-blue-600 font-semibold mb-4">Add User</h2>
            
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-2 px-3 py-2 border rounded-lg text-black"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full mb-2 px-3 py-2 border rounded-lg text-black"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Batch"
              className="w-full mb-2 px-3 py-2 border rounded-lg text-black"
              value={newUser.batch}
              onChange={(e) => setNewUser({ ...newUser, batch: e.target.value })}
            />

            <div className="flex justify-between items-center">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 cursor-pointer">Cancel</button>
              <button onClick={handleAddUser} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}