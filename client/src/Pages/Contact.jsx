import React, { useState } from "react";
import ContactPhoto from "../Assets/ContactUs.png";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [contacted, setContacted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
    } else {
      alert("Please fill all fields!");
    }
  };

  const handleContactDone = () => {
    setContacted(true);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 px-6 md:px-16 py-10">
      {/* Left side - Image */}
      <div className="w-full md:w-[45%] flex justify-center mb-10 md:mb-0">
        <img
          src={ContactPhoto}
          alt="Contact Us"
          className="w-[85%] max-w-[500px] rounded-2xl shadow-2xl object-cover"
        />
      </div>

      {/* Right side - Form / Info */}
      <div className="w-full md:w-[50%] bg-white p-10 rounded-2xl shadow-lg">
        {!submitted && !contacted && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Contact Us
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg text-lg h-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white text-lg py-3 rounded-lg hover:bg-blue-700 transition-all"
              >
                Submit
              </button>
            </form>
          </>
        )}

        {/* After submission → show contact info */}
        {submitted && !contacted && (
          <div className="text-center py-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-5">
              Get in Touch With Me
            </h2>
            <p className="text-gray-700 mb-3 text-lg">
              📧 Email: <span className="font-medium">crimorahelp@gmail.com</span>
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              📞 Phone: <span className="font-medium">+91 98765 43210</span>
            </p>
            <button
              onClick={handleContactDone}
              className="bg-green-600 text-white text-lg py-3 px-8 rounded-lg hover:bg-green-700 transition-all"
            >
              I have contacted
            </button>
          </div>
        )}

        {/* After contacting → show thank you message */}
        {contacted && (
          <div className="text-center py-8">
            <h2 className="text-3xl font-semibold text-green-700 mb-3">
              Thank You! 🌟
            </h2>
            <p className="text-gray-600 text-lg">
              Your message has been received. We'll get back to you soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
