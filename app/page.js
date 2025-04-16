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
      <div className="bg-gradient-to-b from-blue-900 to-blue-500 text-white py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl font-bold">Welcome to IIIT Vadodara - International Campus Diu</h1>
            <p className="mt-4 text-lg">        
            The Indian Institute of Information Technology Vadodara International Campus Diu is one of the most reputed institutes for technological education and research in India.
            Known for its strong relations with the industry, the Institute has always been a favourite destination of recruitment for many firms.</p>
            <p className="text-white-700 mb-4">
            The Placement and Internship Office is the nodal point of contact for companies seeking to establish a fruitful relationship with IIIT Vadodara.
            </p>
            <div className="mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <a href="/IIITV icd_Curriculum_2018.pdf" download className="bg-white border text-blue-900 border-white px-4 py-2 rounded-lg font-semibold hover:bg-transparent hover:text-white">Download Brochure</a>
              <a href="/portal" className="bg-transparent border border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-900">Explore Portal</a>
            </div>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0 text-center">
            <img src="bg.jpg" alt="Students at IIIT Vadodara" className="w-full max-w-md mx-auto rounded-lg shadow-lg" />
          </div>
        </div>
      </div>

{/* Chair CPC Section */}
<section className="bg-gradient-to-b from-blue-500 to-blue-200 py-16">
  <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
    <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
      <img src="bg.jpg" alt="Prof. Sathyan Subbiah" className="w-48 h-48 rounded-full border-8 border-indigo-200 object-cover" />
      <p className="text-blue-900 font-semibold mt-4">PROF. DHARMENDRA SINGH</p>
    </div>
    <div className="md:w-2/3 md:pl-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">MESSAGE FROM THE DIRECTOR</h2>
      <p className="text-gray-700 mb-4">
        I warmly welcome you all to our campus to explore and meet with our students; I assure you that you will find many excellent opportunities
        to expand your human resource requirements. Our students are the best ones in the country, and they are very well trained via both academic and non-academic pursuits during their tenure...
      </p>
    </div>
  </div>
</section>


{/* Advisor Section */}
<section className="bg-gradient-to-b from-blue-200 to-white py-16">
  <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
    <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0 order-1 md:order-2">
      <img src="bg.jpg" alt="Advisor" className="w-48 h-48 rounded-full border-8 border-indigo-200 object-cover" />
      <p className="text-blue-900 font-semibold mt-4">PROF. RAVI CHUG</p>
    </div>
    <div className="md:w-2/3 md:pr-10 order-2 md:order-1">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">MESSAGE FROM THE REGISTRAR</h2>
      <p className="text-gray-700 mb-4">
        IIIT Vadodara ICD creates graduates of outstanding caliber at the undergraduate and postgraduate levels year after year.
        Our alumni have a proven track record of professional success, and we expect to keep this going with the upcoming batch...
      </p>
    </div>
  </div>
</section>

{/* Advisor Section */}
<section className="bg-white py-16">
  <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
    <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0 order-1 md:order-1">
      <img src="bg.jpg" alt="Advisor" className="w-48 h-48 rounded-full border-8 border-indigo-200 object-cover" />
      <p className="text-blue-900 font-semibold mt-4">PROF. AJAY NATH</p>
    </div>
    <div className="md:w-2/3 md:pr-10 order-2 md:order-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">MESSAGE FROM THE ASSOCIATE DEAN</h2>
      <p className="text-gray-700 mb-4">
        IIIT Vadodara ICD creates graduates of outstanding caliber at the undergraduate and postgraduate levels year after year.
        Our alumni have a proven track record of professional success, and we expect to keep this going with the upcoming batch...
      </p>
    </div>
  </div>
</section>
      <Footer />
    </div>
  );
}