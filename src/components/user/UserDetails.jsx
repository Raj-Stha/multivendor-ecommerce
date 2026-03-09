"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@/app/(home)/_context/UserContext";
import { MapPin } from "lucide-react";

export default function UserDetails({
  userInfo,
  userLoginName,
  userEmail, // <-- added
  deliveryLocation,
  shippingAddress,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { getUser } = useUser();

  const userFields = Object.keys(userInfo);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = () => {
    setFormData({ ...userInfo });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Build changed fields only
      const updatedFields = {};
      for (const key of Object.keys(formData)) {
        if (formData[key] !== userInfo[key]) {
          updatedFields[key] = formData[key];
        }
      }

      if (Object.keys(updatedFields).length === 0) {
        toast("No changes made");
        setIsEditing(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/updateuserdetails`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedFields),
        },
      );

      if (!res.ok) throw new Error("Failed to update user details");

      const data = await res.json();
      if (data.code === "00000") {
        toast.success(data.details?.[0] || "User details updated successfully");
        setIsEditing(false);
        getUser();
      } else {
        toast.error("Failed to update details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const formatLabel = (field) =>
    field.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Details</h1>
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 cursor-pointer"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
          >
            Save
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-semibold">Login Name:</span>
          <span>{userLoginName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Email:</span>
          <span>{userEmail}</span> {/* <-- email displayed, not editable */}
        </div>
        {userFields.map((field) => (
          <div className="flex justify-between" key={field}>
            <span className="font-semibold">{formatLabel(field)}:</span>
            {isEditing ? (
              <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-1/2"
              />
            ) : (
              <span>{userInfo[field] || "-"}</span>
            )}
          </div>
        ))}
        <div className="bg-white shadow-sm  rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="font-semibold text-gray-700 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-primary" /> Shipping Address:
          </span>
          <span className="text-gray-600 break-words sm:text-right sm:w-2/3 flex items-center gap-4">
            {shippingAddress || "-"}
            <button
              onClick={() => navigator.clipboard.writeText(shippingAddress)}
              className="text-gray-400 bg-primary/15 shadow-2xl rounded-md p-1 cursor-pointer hover:text-gray-700"
              title="Copy address"
            >
              📋
            </button>
          </span>
        </div>
        {/* <div className="flex justify-between">
          <span className="font-semibold">Delivery Location:</span>
          <span>{deliveryLocation}</span>
        </div> */}
      </div>
    </>
  );
}
