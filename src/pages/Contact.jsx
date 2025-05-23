import React from "react";
import { Form } from "react-router-dom";
import { SectionTitle } from "../components";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";


const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <SectionTitle title="Contact" path="Home > Contact" />

      {/* Contact Information Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Email Card */}
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden h-64">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 transform -skew-y-12"></div>
              <div className="relative flex flex-col items-center">
                <FaEnvelope className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">Email Us</h3>
                <div className="space-y-2 text-center">
                  <p className="text-green-600 hover:text-green-700 transition-colors cursor-pointer" style={{"color": "#727272de",fontWeight:700}}>
                    <a href="mailto:support@quickdigitizing.com">support@quickdigitizing.com</a>
                  </p>
                  <p className="text-green-600 hover:text-green-700 transition-colors cursor-pointer" style={{"color": "#727272de",fontWeight:700}}>
                    <a href="mailto:sales@quickdigitizing.com">sales@quickdigitizing.com</a>
                  </p>
                  <p className="text-green-600 hover:text-green-700 transition-colors cursor-pointer" style={{"color": "#727272de",fontWeight:700}}>
                    <a href="mailto:quickdigitizing@yahoo.com">quickdigitizing@yahoo.com</a>
                  </p>

                </div>

              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden h-64">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 transform -skew-y-12"></div>
              <div className="relative flex flex-col items-center">
                <FaPhone className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">Call Us</h3>
                <div className="space-y-2 text-center">
                  <p className="text-green-600" style={{"color": "#727272de",fontWeight:700}}>
                    <a href="tel:+6624581057">+(662) 4581057</a>
                  </p>
                  <p className="text-green-600" style={{"color": "#727272de",fontWeight:700}}>
                    <a href="tel:+6624581055">+(662) 4581055</a>
                  </p>

                </div>

              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden h-64">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 transform -skew-y-12"></div>
              <div className="relative flex flex-col items-center">
                <FaMapMarkerAlt className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">Visit Us</h3>
                <p className="text-green-600 text-center cursor-pointer hover:text-green-700 transition-colors" style={{"color": "#727272de",fontWeight:700}}>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=149/1+Charansnitwong+Rd.+Soi+5,+Bangkokyai,+Bangkok,+10600+THAILAND"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    149/1 Charansnitwong Rd. Soi 5, Bangkokyai, Bangkok, 10600 THAILAND
                  </a>
                </p>


              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="w-full bg-white/80 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Map Section */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.7237743922788!2d100.46847508582863!3d13.735166252245817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2984d62789c6d%3A0x6068d1918ecad86f!2s149%2F1%20Charan%20Sanitwong%204%2C%20Khwaeng%20Wat%20Tha%20Phra%2C%20Khet%20Bangkok%20Yai%2C%20Krung%20Thep%20Maha%20Nakhon%2010600%2C%20Thailand!5e0!3m2!1sen!2sin!4v1717234186447!5m2!1sen!2sin"
                className="w-full h-[500px] rounded-2xl"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center" >
                Send Us a Message
              </h3>

              <Form className="space-y-6" >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                  </div>

                  {/* Subject Input */}
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="relative">
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Your message"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button type="submit" class="custom-button" style={{color:"white"}}>
                  <span >Send Message</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
