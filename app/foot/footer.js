"use client";
import { useState } from "react";
import Link from "next/link";
import { FaUsers, FaStar, FaUniversity, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

// Modal Component
const Modal = ({ title, content, onClose }) => {
    console.log("Modal props:", { title, content }); // Debugging log
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black-900 bg-opacity-80 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4">
                {title && <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>}
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

    // Function to open modal
    const openModal = (title, content) => {
        setModalData({ title, content });
    };

    // Function to close modal
    const closeModal = () => {
        setModalData(null);
    };

    return (
        <div className="bg-blue-900 text-white py-12 px-6">
            {/* Why IIIT Vadodara ICD Section */}
            <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Why IIIT Vadodara - International Campus Diu</h2>
                <p className="text-gray-300">
                    IIIT Vadodara ICD aims to provide world-class education, fostering innovation, research, and all-round development. 
                    Our rigorous academic curriculum, strong alumni network, and industry collaborations ensure that students receive 
                    the best possible opportunities to excel in their careers.
                </p>
            </div>

            {/* Four Sections */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 text-center">
                {/* Alumni */}
                <div>
                    <FaUsers className="text-3xl mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">Alumni</h3>
                    <p className="text-gray-300 text-sm">Our alumni have excelled in various fields, creating a strong professional network worldwide.</p>
                    <button 
                        onClick={() => openModal("Alumni", "The alumni of IIT Bombay are of the highest calibre and repute. Many of them have reached positions of eminence in their selected fields of professions. They have reached perfection through excellence in their selected fields of industry, business, the public sector, academics and research or as entrepreneurs. The Institute recognizes its alumni who have distinguished themselves through their work and have done the Institute proud. The Distinguished Alumnus Award have been instituted for this purpose. This Institute also involves Alumni in its educational and research activities wherever possible, by inviting them to participate on its advisory boards, as visiting faculty or guest speakers. Our alumni too have responded wholeheartedly by supporting the Institute and also by their most generous endowments leading to establishment of schools, labs, scholarships, chairs and various infrastructure developments.")}
                        className="mt-4 inline-block bg-white text-blue-900 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Know More
                    </button>
                </div>

                {/* Ranking */}
                <div>
                    <FaStar className="text-3xl mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">Ranking</h3>
                    <p className="text-gray-300 text-sm">Recognized for academic excellence, we rank among the top institutions in India.</p>
                    <button 
                        onClick={() => openModal("Ranking", "IIIT Vadodara ICD ranks among the top institutions in India, known for its academic excellence.")}
                        className="mt-4 inline-block bg-white text-blue-900 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Know More
                    </button>
                </div>

                {/* Admission Process */}
                <div>
                    <FaUniversity className="text-3xl mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">Admission Process</h3>
                    <p className="text-gray-300 text-sm">A transparent and merit-based admission process ensures the best talents join us.</p>
                    <button 
                        onClick={() => openModal("Admission Process", "Admissions to the four year B.Tech. Program in CSE of the Institute is made through the examination conducted by National Testing Agency under the name and style of JEE (Main). Based upon the merit in the written examination, Central Counseling Board of JEE (Main) known as Central Seat Allocation Board (CSAB) invites candidates for counseling at selected centers and seats for various participating institutions are allotted, based upon individual merit.")}
                        className="mt-4 inline-block bg-white text-blue-900 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Know More
                    </button>
                </div>

                {/* Follow Us */}
                <div>
                    <h3 className="text-lg font-semibold">Follow Us</h3>
                    <p className="text-gray-300 text-sm mb-3">Stay updated with our latest news and events.</p>
                    <div className="flex justify-center space-x-4">
                        <a href="https://www.instagram.com/_vedansh_54/?hl=en" target="_blank" rel="noopener noreferrer" className="text-white text-2xl hover:text-gray-400"><FaFacebook /></a>
                        <a href="https://www.instagram.com/_vedansh_54/?hl=en" target="_blank" rel="noopener noreferrer" className="text-white text-2xl hover:text-gray-400"><FaTwitter /></a>
                        <a href="https://www.instagram.com/_vedansh_54/?hl=en" target="_blank" rel="noopener noreferrer" className="text-white text-2xl hover:text-gray-400"><FaLinkedin /></a>
                        <a href="https://www.instagram.com/_vedansh_54/?hl=en" target="_blank" rel="noopener noreferrer" className="text-white text-2xl hover:text-gray-400"><FaInstagram /></a>
                    </div>
                </div>
            </div>

            {/* Modal Component */}
            {modalData && <Modal title={modalData.title} content={modalData.content} onClose={closeModal} />}

            {/* Copyright */}
            <p className="text-center text-sm mt-8">&copy; {new Date().getFullYear()} IIIT Vadodara - International Campus Diu. All Rights Reserved.</p>
        </div>
    );
};

export default Footer;