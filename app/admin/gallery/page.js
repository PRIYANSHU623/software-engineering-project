"use client";
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useState, useEffect } from "react";
import axios from "axios";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);

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
      const res = await axios.get("/api/admin/gallery");
      setGalleryItems(res.data.map((item) => ({ ...item, preview: null, selectedFile: null })));
    } catch (error) {
      console.error("Error fetching Items:", error);
    }
  };

  // Handle file selection for a specific item
  const handleFileChange = (event, itemId) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? { ...item, selectedFile: reader.result, preview: reader.result } : item
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateItem = async (itemId) => {
    const itemToUpdate = galleryItems.find((item) => item._id === itemId);
    // console.log("Received _id:", itemId);

    if (!itemToUpdate?.selectedFile) {
      alert("Please select an image before updating.");
      return;
    }
    const base64String = itemToUpdate.selectedFile.replace(/^data:image\/\w+;base64,/, "");
    // console.log("Hello:",itemToUpdate.selectedFile);
    try {
      const response = await axios.put("/api/admin/gallery", {
        image: base64String, // Send Base64 image
        _id: itemId,
      });

      if (response.data.ok) {
        alert("Image updated successfully!");
        const res = await axios.get("/api/admin/gallery");
        const imageData = {};
        res.data.forEach(item => {
          if (itemId === item._id)
            imageData[item.title] = base64String;
          else
            imageData[item.title] = item.image;
        });
        localStorage.setItem("galleryImages", JSON.stringify(imageData));
        fetchItems();
      } else {
        alert("Failed to update gallery item");
      }
    } catch (error) {
      console.error("Error updating gallery item:", error);
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
          <div>
            <a href="/admin/dashboard" className="hover:text-blue-400 mr-5">Dashboard</a>
            <a href="/admin/gallery" className="text-blue-300 font-semibold mr-5">Gallery</a>
            <a href="/admin/job-postings" className="hover:text-blue-400 mr-5">Job Postings</a>
            <a href="/admin/training-program" className="hover:text-blue-400 mr-5">Training Program</a>
            <a href="/admin/users" className="hover:text-blue-400 mr-5">Users</a>
            <a href="/admin/profile" className="hover:text-blue-400">Profile</a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Gallery Management</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div key={item._id} className="bg-white shadow rounded-lg overflow-hidden p-4">
              {/* Display existing image or selected preview */}
              <img src={item.preview || `data:image/jpeg;base64,${item.image}`}
                className="w-full h-48 object-cover border" />

              <p className="text-center text-black mt-2">{item.title}</p>

              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="file"
                  accept="image/*"
                  className="rounded px-2 py-1 text-gray-900 cursor-pointer file:border-0 file:mr-2 file:py-1 file:px-3 file:bg-gray-300 file:hover:bg-gray-400"
                  onChange={(e) => handleFileChange(e, item._id)}
                />
              </div>

              <button
                onClick={() => handleUpdateItem(item._id)}
                className="bg-green-600 text-white px-4 py-2 mt-2 rounded hover:bg-green-700 w-full cursor-pointer"
              >
                Update Image
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
