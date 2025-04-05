'use client'
import { useState, useEffect } from "react";
import Navbar from "./nav/navbar";
import Footer from "./foot/footer";
import axios from "axios";

export default function Home() {
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("/api/admin/gallery");
      setGalleryItems(res.data);
      
      const imageData = {};
        res.data.forEach(item => {
            imageData[item.title] = item.image;
        });

        localStorage.setItem("galleryImages", JSON.stringify(imageData));
        // console.log("Stored Images:", localStorage.getItem("galleryImages"));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <Navbar item={"Home"}/>
      <div className="bg-gradient-to-r from-blue-900 to-blue-400 text-white py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl font-bold">Welcome to IIIT Vadodara - International Campus Diu</h1>
            <p className="mt-4 text-lg">Empowering students with world-class training and placement opportunities.</p>
            <div className="mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <a href="#" className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">Download Brochure</a>
              <a href="/portal" className="bg-transparent border border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-900">Explore Portal</a>
            </div>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0 text-center">
            <img src="bg.jpg" alt="Students at IIIT Vadodara" className="w-full max-w-md mx-auto rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}