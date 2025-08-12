import React, { useEffect, useState } from "react";
import { getUserProfile, updateAdminProfile } from "../../api/admin"; // ✅ Your API import

const AdminProfile = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);

 useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(); // ✅ Use imported API
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target.id === "admin-profile-modal") {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profileImage") setProfileImageFile(files[0]);
    if (name === "backgroundImage") setBackgroundImageFile(files[0]);
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profileImageFile) data.append("profileImage", profileImageFile);
      if (backgroundImageFile) data.append("backgroundImage", backgroundImageFile);

      const updated = await updateAdminProfile(data); // ✅ Use imported API
      setUser(updated);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile");
    }
  };
   if (!user) return null;

  return (
    <div
      id="admin-profile-modal"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold z-50"
        >
          ×
        </button>
          <div className="relative h-44 w-full rounded-t-xl overflow-hidden">
      <img
    src={
      `http://localhost:5000${user.backgroundImage}`
    }
    alt="Cover"
    className="w-full h-full object-cover"
  />
  {editMode && (
    <>
      <input
        type="file"
        name="backgroundImage"
        accept="image/*"
        onChange={handleFileChange}
        ref={(ref) => (window.bgInput = ref)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => window.bgInput.click()}
        className="absolute z-50 bottom-3 right-4 bg-black bg-opacity-60 text-white  mt-1 px-2 py-1 rounded text-sm hover:bg-opacity-80"
      >
        Change Cover
      </button>
    </>
  )}
</div>
 <div className="relative -mt-12 flex justify-center">
   <div className="relative">
    <img
      src={
        `http://localhost:5000${user.profileImage}`
      }
      alt="Profile"
      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
    />
    {editMode && (
      <>
        <input
          type="file"
          name="profileImage"
          accept="image/*"
          onChange={handleFileChange}
          ref={(ref) => (window.profileInput = ref)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => window.profileInput.click()}
          className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-full hover:bg-opacity-80"
        >
          📷
        </button>
      </>
    )}
  </div>
</div>
 <div className="px-6 py-8">
   <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-600">
              Admin Profile
            </h2>
            {!editMode ? (
              <button
                className="px-4 py-1 bg-yellow-500 text-white rounded"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-1 bg-green-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData(user);
                    setProfileImageFile(null);
                    setBackgroundImageFile(null);
                  }}
                  className="px-4 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
               ["Full Name", "fullName"],
              ["Username", "username"],
              ["Email", "email"],
              ["Mobile", "mobile"],
              ["Role", "role"],
              ["Status", "status"],
              ["Gender", "gender"],
              ["Date of Birth", "dob"],
              ["Address", "address"],
              ["Joining Date", "joiningDate"],
              ["Verified", "isVerified"],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-600">
                  {label}
                </label>
                 {editMode && key !== "joiningDate" && key !== "isVerified" ? (
                  <input
                    type={key === "dob" ? "date" : "text"}
                    name={key}
                    value={
                      key === "dob"
                        ? formData[key]?.substring(0, 10) || ""
                        : formData[key] || ""
                    }
                    onChange={handleChange}
                    className="w-full px-3 py-2 mt-1 border rounded text-sm"
                  />
                ) : (
                  <input
                    type="text"
                    readOnly
                    value={
                      key === "dob" || key === "joiningDate"
                        ? formData[key]
                          ? new Date(formData[key]).toLocaleDateString()
                          : "N/A"
                        : key === "isVerified"
                        ? formData[key]
                          ? "Yes"
                          : "No"
                        : formData[key] || "N/A"
                    }
                    className="w-full px-3 py-2 mt-1 border rounded bg-gray-100 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;