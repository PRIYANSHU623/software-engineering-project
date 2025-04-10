"use client";
import { useState } from "react";
import {
  FaUsers,
  FaStar,
  FaUniversity,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

// Modal Component
const Modal = ({ title, content, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-80 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4">
        {title && (
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        )}
        <p className="text-gray-700">{content}</p>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Footer = () => {
  const [modalData, setModalData] = useState(null);

  // Open modal
  const openModal = (title, content) => {
    setModalData({ title, content });
  };

  // Close modal
  const closeModal = () => {
    setModalData(null);
  };

  return (
    <div className="bg-blue-900 text-white py-12 px-6">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Why IIIT Vadodara - International Campus Diu
        </h2>
        <p className="text-gray-300">
          IIIT Vadodara ICD aims to provide world-class education, fostering
          innovation, research, and all-round development. Our rigorous academic
          curriculum, strong alumni network, and industry collaborations ensure
          that students receive the best possible opportunities to excel in
          their careers.
        </p>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 text-center">
  {/* Alumni */}
  <div className="group hover:scale-95 transition-transform duration-300 ease-in-out cursor-pointer flex flex-col items-center">
    <FaUsers className="text-3xl mb-2 transition-transform duration-300 ease-in-out" />
    <h3 
      className="text-lg font-semibold transition-transform duration-300 ease-in-out"
      onClick={() => openModal("Alumni", "The alumni of IIIT Vadodara ICD are of the highest calibre and repute. Many of them have reached positions of eminence in their selected fields of professions. They have reached perfection through excellence in their selected fields of industry, business, the public sector, academics and research or as entrepreneurs. The Institute recognizes its alumni who have distinguished themselves through their work and have done the Institute proud. The Distinguished Alumnus Award have been instituted for this purpose. This Institute also involves Alumni in its educational and research activities wherever possible, by inviting them to participate on its advisory boards, as visiting faculty or guest speakers. Our alumni too have responded wholeheartedly by supporting the Institute and also by their most generous endowments leading to establishment of schools, labs, scholarships, chairs and various infrastructure developments.")}
    >
      Alumni
    </h3>
    <p className="text-gray-300 text-sm mt-1">
      Our alumni have excelled in various fields, creating a strong professional network worldwide.
    </p>
  </div>

  {/* Ranking */}
  <div className="group hover:scale-95 transition-transform duration-300 ease-in-out cursor-pointer flex flex-col items-center">
    <FaStar className="text-3xl mb-2 transition-transform duration-300 ease-in-out" />
    <h3 
      className="text-lg font-semibold transition-transform duration-300 ease-in-out"
      onClick={() => openModal("Ranking", "IIIT Vadodara ICD ranks among the top institutions in India...")}
    >
      Ranking
    </h3>
    <p className="text-gray-300 text-sm mt-1">
      Recognized for academic excellence, we rank among the top institutions in India.
    </p>
  </div>

  {/* Admission */}
  <div className="group hover:scale-95 transition-transform duration-300 ease-in-out cursor-pointer flex flex-col items-center">
    <FaUniversity className="text-3xl mb-2 transition-transform duration-300 ease-in-out" />
    <h3 
      className="text-lg font-semibold transition-transform duration-300 ease-in-out"
      onClick={() => openModal("Admission Process", "Admissions to the four year B.Tech...")}
    >
      Admission Process
    </h3>
    <p className="text-gray-300 text-sm mt-1">
      A transparent and merit-based admission process ensures the best talents join us.
    </p>
  </div>

  {/* Follow Us */}
  <div className="flex flex-col items-center">
    <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
    <p className="text-gray-300 text-sm mb-3 text-center">Stay updated with our latest news and events.</p>
    <div className="flex justify-center space-x-4">
      <a href="https://facebook.com" className="hover:scale-110 transition-transform duration-300"><FaFacebook className="text-2xl" /></a>
      <a href="https://twitter.com" className="hover:scale-110 transition-transform duration-300"><FaTwitter className="text-2xl" /></a>
      <a href="https://linkedin.com" className="hover:scale-110 transition-transform duration-300"><FaLinkedin className="text-2xl" /></a>
      <a href="https://instagram.com" className="hover:scale-110 transition-transform duration-300"><FaInstagram className="text-2xl" /></a>
    </div>
  </div>
</div>


      {/* Modal */}
      {modalData && (
        <Modal
          title={modalData.title}
          content={modalData.content}
          onClose={closeModal}
        />
      )}

      {/* Footer Bottom */}
      <p className="text-center text-sm mt-8">
        &copy; {new Date().getFullYear()} IIIT Vadodara - International Campus
        Diu. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
