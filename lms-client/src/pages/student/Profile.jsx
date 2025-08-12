import React, { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import { getUserProfile, updateStudentProfile } from "../../api/student";

const Profile = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data.user || data); // Adjust if API returns { user }
        setFormData(data.user || data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target.id === "profile-modal") onClose();
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    setFormData((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(file),
      [`${field}File`]: file,
    }));
  };

  const handleSave = async () => {
    try {
      const dataToSend = new FormData();

      // Append editable fields
      const readonlyFields = ["role", "status", "joiningDate", "isVerified"];
      Object.entries(formData).forEach(([key, value]) => {
        if (!readonlyFields.includes(key) && !key.endsWith("File")) {
          dataToSend.append(key, value);
        }
      });

      // Append new image files if provided
      if (formData.profileImageFile) {
        dataToSend.append("profileImage", formData.profileImageFile);
      }
      if (formData.backgroundImageFile) {
        dataToSend.append("backgroundImage", formData.backgroundImageFile);
      }

      const res = await updateStudentProfile(user._id, dataToSend);

      setUser(res.user || res);
      setFormData(res.user || res);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert(err.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white p-6 rounded shadow-lg text-center text-blue-600 font-medium">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div
      id="profile-modal"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg relative overflow-y-auto max-h-[95vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold z-50"
        >
          <X />
        </button>

        {/* Background Image */}
        <div className="relative h-44 w-full rounded-t-xl overflow-hidden">
          <img
            src={
              formData.backgroundImage?.startsWith("blob:")
                ? formData.backgroundImage
                : formData.backgroundImage
                ? `http://localhost:5000/${formData.backgroundImage}`
                : "https://via.placeholder.com/700x430"
            }
            alt="Background"
            className="w-full h-full object-cover"
          />
          {isEditing && (
            <label className="absolute z-50 bottom-3 right-4 bg-white/70 backdrop-blur-sm rounded-full p-2 cursor-pointer hover:bg-white shadow">
              <Pencil size={18} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, "backgroundImage")}
              />
            </label>
          )}
        </div>

        {/* Profile Image */}
        <div className="relative -mt-12 flex justify-center">
          <div className="relative">
            <img
              src={
                formData.profileImage?.startsWith("blob:")
                  ? formData.profileImage
                  : formData.profileImage
                  ? `http://localhost:5000/${formData.profileImage}`
                  : "https://via.placeholder.com/200"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-white/70 backdrop-blur-sm rounded-full p-1 cursor-pointer hover:bg-white shadow">
                <Pencil size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "profileImage")}
                />
              </label>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-blue-600">My Profile</h2>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["Full Name", "fullName"],
              ["Username", "username"],
              ["Email", "email"],
              ["Mobile", "mobile"],
              ["Gender", "gender"],
              ["Date of Birth", "dob"],
              ["Address", "address"],
              ["Role", "role", true],
              ["Status", "status", true],
              ["Joining Date", "joiningDate", true],
              ["Verified", "isVerified", true],
            ].map(([label, name, readonly]) => (
              <div key={name}>
                <label className="text-sm font-medium text-gray-600">
                  {label}
                </label>
                {name === "gender" ? (
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing || readonly}
                    className={`w-full px-3 py-2 mt-1 border rounded text-sm ${
                      !isEditing || readonly
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                
                <input
                  type={
                    name === "dob" || name === "joiningDate" ? "date" : "text"
                  }
                  name={name}
                  readOnly={!isEditing || readonly}
                  value={
                    name === "joiningDate" || name === "dob"
                      ? formData[name]
                        ? new Date(formData[name])
                            .toISOString()
                            .split("T")[0]
                        : ""
                      : name === "isVerified"
                      ? formData[name]
                        ? "Yes"
                        : "No"
                      : formData[name] || ""
                  }
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 mt-1 border rounded text-sm ${
                    !isEditing || readonly
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-white"
                  }`}
                />
                )}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
