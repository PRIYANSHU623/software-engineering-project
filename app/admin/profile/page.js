

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import axios from "axios";

export default function AdminProfile() {
  const [storedImages, setStoredImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    slogan: "",
    oldPassword: "",
    nwPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [changePassword, setChangePassword] = useState(false);

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
    const images = localStorage.getItem("galleryImages");
    if (images) {
      setStoredImages(JSON.parse(images));
    }
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await axios.get("/api/admin/profile");
      // console.log("hello", response);
      if (response.data.ok) {
        setUpdatedData({
          name: response.data.data.name,
          email: response.data.data.email,
          slogan: response.data.data.slogan,
          oldPassword: "",
          nwPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (updatedData.nwPassword !== updatedData.confirmPassword) {
      setError("New passwords do not match!");
      return;
    }
    try {
      setError("");
      const response = await axios.put("/api/admin/profile", updatedData);

      if (response.data.ok) {
        alert("Password changed successfully");
        setUpdatedData({
          name: updatedData.name,
          email: updatedData.email,
          slogan: updatedData.slogan,
          oldPassword: "",
          nwPassword: "",
          confirmPassword: "",
        });
        setChangePassword(false);
      } else {
        alert("Failed to change password");
      }
    } catch (error) {
      setError((error.response?.data?.message || error.message));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await axios.put("/api/admin/profile", updatedData);
      if (response.data.ok) {
        alert("Profile updated successfully");
        setUpdatedData({
          name: response.data.data.name,
          email: updatedData.email,
          slogan: response.data.data.slogan,
          oldPassword: "",
        });
        setIsUpdate(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      setError((error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    router.push("/portal");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-blue-900 text-white py-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="IIIT Logo" className="w-12" />
            <p className="text-lg font-semibold">Training and Placement Cell Website</p>
          </div>
          <div>
            <a href="/admin/dashboard" className="hover:text-blue-400 mr-5">Dashboard</a>
            <a href="/admin/gallery" className="hover:text-blue-400 mr-5">Gallery</a>
            <a href="/admin/job-postings" className="hover:text-blue-400 mr-5">Job Postings</a>
            <a href="/admin/users" className="hover:text-blue-400 mr-5">Users</a>
            <a href="/admin/profile" className="text-blue-300 font-semibold">Profile</a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Admin Profile</h1>
        {loading ? <p> Loading... </p> : (
          <div className="max-w-lg h-auto mx-auto bg-white p-6 shadow-md rounded-lg">
            <div className="flex justify-center">
              <img src={`data:image/jpeg;base64,${storedImages["Placement Head"]}`} alt="Placement Head" className="w-38 h-38 border-4 border-blue-400 mx-auto rounded-full" />
            </div>
            <h4 className="text-black font-semibold m-auto mt-2">
              Name: <span className="text-blue-600 font-light">{updatedData.name}</span>
            </h4>
            <h4 className="text-black font-semibold m-auto mt-2">
              Email: <span className="text-blue-600 font-light">{updatedData.email}</span>
            </h4>
            <h4 className="text-black font-semibold m-auto mt-2">
              Slogan: <span className="text-blue-600 font-light">{updatedData.slogan}</span>
            </h4>
            <button onClick={() => {
              setChangePassword(true);
              setUpdatedData({ ...updatedData, oldPassword: "", nwPassword: "", confirmPassword: "" });
            }}
              className="mt-4 w-full bg-red-600 text-white p-2 rounded cursor-pointer">
              Change Password
            </button>
            <button onClick={() => {
              setIsUpdate(true);
              setUpdatedData({ ...updatedData, name: updatedData.name, oldPassword: "", slogan: updatedData.slogan });
            }}
              className="mt-4 w-full bg-green-600 text-white p-2 rounded cursor-pointer">
              Update Profile
            </button>
            <button onClick={handleLogout} className="mt-4 w-full bg-red-600 text-white p-2 rounded cursor-pointer">
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {changePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center text-black">Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <label className="block mb-2 text-black">Old Password:</label>
              <input
                required
                type="password"
                className="w-full p-2 border rounded mb-4 text-black"
                value={updatedData.oldPassword}
                onChange={(e) => setUpdatedData({ ...updatedData, oldPassword: e.target.value })}
                placeholder="Enter Old Password"
              />
              <label className="block mb-2 text-black">New Password:</label>
              <input
                required
                type="password"
                className="w-full p-2 border rounded mb-4 text-black"
                value={updatedData.nwPassword}
                onChange={(e) => setUpdatedData({ ...updatedData, nwPassword: e.target.value })}
                placeholder="Enter New Password"
              />
              <label className="block mb-2 text-black">Confirm Password:</label>
              <input
                required
                type="password"
                className="w-full p-2 border rounded mb-4 text-black"
                value={updatedData.confirmPassword}
                onChange={(e) => setUpdatedData({ ...updatedData, confirmPassword: e.target.value })}
                placeholder="Confirm Password"
              />

              {error && <p className="text-center mt-2 text-red-600">{error}</p>}

              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                  Save
                </button>
                <button onClick={() => setChangePassword(false)} type="button" className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center text-black">Update Profile</h2>
            <form onSubmit={handleUpdate}>
              <label className="block mb-2 text-black">Name:</label>
              <input
                type="text"
                className="w-full p-2 border rounded mb-4 text-black"
                value={updatedData.name}
                onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
              />

              <label className="block mb-2 text-black">Slogan:</label>
              <input
                type="text"
                className="w-full p-2 border rounded mb-4 text-black"
                value={updatedData.slogan}
                onChange={(e) => setUpdatedData({ ...updatedData, slogan: e.target.value })}
              />

              <label className="block mb-2 text-black">Password:</label>
              <input
                required
                type="password"
                className="w-full p-2 border rounded mb-4 text-black"
                value={updatedData.oldPassword}
                onChange={(e) => setUpdatedData({ ...updatedData, oldPassword: e.target.value })}
                placeholder="Enter Password"
              />

              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                  Save
                </button>

                {error && (<p className="text-center mt-2 text-red-600">{error}</p>)}

                <button type="button" onClick={() => setIsUpdate(false)} className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div >
  );
}