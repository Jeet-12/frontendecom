import React from "react";
import { Link } from "react-router-dom";
import { FaSquareTwitter, FaSquareFacebook, FaSquareInstagram, FaSquareYoutube } from "react-icons/fa6";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#93C572] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p className="text-sm mb-4">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
            <p className="text-sm">© {new Date().getFullYear()} Quick Digitizing. All rights reserved.</p>
          </div>

          {/* Links */}
          <div className="flex flex-col rounded-lg">
            <h3 className="text-lg font-bold mb-4">Help</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="hover:underline text-white">Home</Link>
              <Link to="/gallery" className="hover:underline text-white">Gallery</Link>
              <Link to="/about-us" className="hover:underline text-white">About Us</Link>
              <Link to="/contact" className="hover:underline text-white">Contact</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col rounded-lg">
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="flex items-center mb-2">
              <FaEnvelope className="mr-2" />
              <a href="mailto:support@quickdigitizing.com" className="text-sm">support@quickdigitizing.com</a>
            </div>
            <div className="flex items-center mb-2">
              <FaPhone className="mr-2" />
              <a href="tel:+6624581057" className="text-sm">+(662) 4581057</a>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <a href="https://goo.gl/maps/3J6QV5J9z4v" className="text-sm">149/1 Charansnitwong Rd. Soi 5, Bangkokyai, Bangkok, 10600 THAILAND</a>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-200">
                <FaSquareFacebook size={24} />
              </a>
              <a href="#" className="hover:text-gray-200">
                <FaSquareTwitter size={24} />
              </a>
              <a href="#" className="hover:text-gray-200">
                <FaSquareInstagram size={24} />
              </a>
              <a href="#" className="hover:text-gray-200">
                <FaSquareYoutube size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#6BBF8A] text-black text-center py-4">
        <p>Copyrights © {new Date().getFullYear()}, Quick Digitizing.com. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
