"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@/app/(home)/_context/UserContext";
import LocationPicker from "@/lib/locationpicker";
import { Label } from "@/components/ui/label";

export default function UserDetails({ user }) {
  const { getUser } = useUser();

  const initialFormData = {
    ...user,
    ...user.user_details,
  };
  delete initialFormData.user_details;

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationSelect = (lat, lng, address) => {
    const coordinates = `${lng}, ${lat}`;
    setFormData((prev) => ({
      ...prev,
      shipping_address: address,
      delivery_location: coordinates,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedFields = {};
      for (const key of Object.keys(formData)) {
        if (formData[key] !== initialFormData[key]) {
          updatedFields[key] = formData[key];
        }
      }

      if (Object.keys(updatedFields).length === 0) {
        toast("No changes made");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/updateuserdetails`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedFields),
        }
      );

      const data = await res.json();

      if (data.code === "00000") {
        getUser();
        toast.success(data.details?.[0] || "User details updated successfully");
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

  const displayFields = Object.keys(formData).filter(
    (f) => !["code", "hint"].includes(f)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
      </div>

      <div className="space-y-5">
        {displayFields.map((field) => {
          if (field === "shipping_address") return null;
          if (field === "billing_address") return null;

          return (
            <div key={field} className="hover:shadow-md space-y-4 transition">
              <Label
                htmlFor={field}
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                {formatLabel(field)}
              </Label>

              {field === "user_login_name" ? (
                <input
                  id={field}
                  type="text"
                  name={field}
                  readOnly
                  value={formData[field] ?? ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-800 
                     focus:outline-none "
                />
              ) : field === "user_gender" ? (
                <select
                  id={field}
                  name={field}
                  value={formData[field] ?? ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-800 
                     focus:outline-none transition bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : field === "delivery_location" ? (
                <div className="space-y-4 my-4 ">
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={user?.delivery_location ?? ""}
                  />
                </div>
              ) : (
                <input
                  id={field}
                  type="text"
                  name={field}
                  value={formData[field] ?? ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-800 
                     focus:outline-none transition"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full flex justify-center py-8">
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-3 rounded-xl 
                     bg-green-600 text-white cursor-pointer hover:opacity-90"
        >
          Update Details
        </button>
      </div>
    </div>
  );
}
