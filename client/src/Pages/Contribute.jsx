import React, { useEffect, useRef, useState } from "react";

function Contribute() {
  const fileRef = useRef(null);

  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // Fetch logged-in user info
  // --------------------------------
  const fetchUser = async () => {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setUser(data);
  };

  // --------------------------------
  // Fetch user-reported crimes
  // --------------------------------
  const fetchReports = async () => {
    const res = await fetch("http://localhost:5000/api/crime/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setReports(data);
  };

  // --------------------------------
  // Upload profile picture
  // --------------------------------
  const uploadProfilePic = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      "http://localhost:5000/api/user/upload-profile-pic",
      {
        method: "POST",
        headers: {
           Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    // Update UI instantly
    setUser((prev) => ({ ...prev, profilePic: data.profilePic }));
  };

  // --------------------------------
  // Initial load
  // --------------------------------
  useEffect(() => {
    const load = async () => {
      await fetchUser();
      await fetchReports();
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="mt-20 text-center">Loading...</div>;

  return (
    <div className="mt-24 px-6 max-w-4xl mx-auto">
      {/* ============================= */}
      {/* PROFILE SECTION */}
      {/* ============================= */}
      <div className="flex items-center gap-6 mb-10">
        {/* Profile Image */}
        <div
          className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-600 cursor-pointer group"
          onClick={() => fileRef.current.click()}
        >
          <img
            src={
              user.profilePic ||
              "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"
            }
            alt="profile"
            className="w-full h-full object-cover"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            Upload
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => uploadProfilePic(e.target.files[0])}
        />

        {/* User Info */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {user.name}
          </h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* ============================= */}
      {/* USER REPORTS */}
      {/* ============================= */}
      <div>
        <h3 className="text-xl font-semibold text-indigo-600 mb-4">
          Your Reported Crimes
        </h3>

        {reports.length === 0 ? (
          <p className="text-gray-500">No reports submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <div
                key={r._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p>
                  <span className="font-semibold">Type:</span> {r.type}
                </p>
                <p>
                  <span className="font-semibold">Intensity:</span>{" "}
                  {r.intensity}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {r.location}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Contribute;
