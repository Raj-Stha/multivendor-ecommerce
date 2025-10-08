"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "@/app/(home)/_context/UserContext";

const defaultLocation = {
  name: "New York",
  lat: 40.7128,
  lon: -74.006,
};

function getLocalStorageLocation() {
  try {
    const stored = localStorage.getItem("user_location");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function LocationPopup({ status = false, onClose }) {
  const { user, getUser } = useUser();
  const [open, setOpen] = useState(status);
  const [query, setQuery] = useState("");
  const [manualInput, setManualInput] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const storedLocation = getLocalStorageLocation();
    if (storedLocation) {
      setSelectedLocation(storedLocation);
      setQuery(storedLocation.name);
      // setOpen(false);
      return;
    }

    if (user === null) return;

    if (user.length > 0) {
      const shippingAddress =
        user[0].user_details.shipping_address ||
        user[0].user_details.billing_address ||
        "Nepal";

      const [lat, lon] = user[0].delivery_location
        .replace(/[()]/g, "")
        .split(",")
        .map(Number);

      const apiLocation = { name: shippingAddress, lat, lon };
      setSelectedLocation(apiLocation);
      setQuery(apiLocation.name);
      setOpen(true);
      return;
    }

    setSelectedLocation(defaultLocation);
    setQuery(defaultLocation.name);
    setOpen(true);
  }, [user]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!open || !selectedLocation || leafletMap.current) return;

    const initializeMap = async () => {
      const L = await import("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      const mapInstance = L.map(mapRef.current).setView(
        [selectedLocation.lat, selectedLocation.lon],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance);

      markerRef.current = L.marker([
        selectedLocation.lat,
        selectedLocation.lon,
      ]).addTo(mapInstance);
      mapInstance.invalidateSize();

      mapInstance.on("click", async (e) => {
        setManualInput(false);
        setShowSuggestions(false);
        const { lat, lng } = e.latlng;
        if (markerRef.current) mapInstance.removeLayer(markerRef.current);
        markerRef.current = L.marker([lat, lng]).addTo(mapInstance);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          const data = await response.json();
          const name =
            data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setSelectedLocation({ lat, lon: lng, name });
          setQuery(name);
        } catch {
          setSelectedLocation({
            lat,
            lon: lng,
            name: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          });
        }
      });

      leafletMap.current = mapInstance;
    };

    setTimeout(initializeMap, 100);
  }, [open, selectedLocation]);

  // Search
  useEffect(() => {
    if (!query.trim() || !manualInput) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        const results = data.map((item) => ({
          name: item.display_name,
          lat: Number(item.lat),
          lon: Number(item.lon),
        }));
        setSuggestions(results);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, manualInput]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setManualInput(true);
    if (e.target.value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (loc) => {
    setSelectedLocation(loc);
    setQuery(loc.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setManualInput(false);

    if (leafletMap.current && markerRef.current) {
      import("leaflet").then((L) => {
        leafletMap.current.setView([loc.lat, loc.lon], 15);
        leafletMap.current.removeLayer(markerRef.current);
        markerRef.current = L.marker([loc.lat, loc.lon]).addTo(
          leafletMap.current
        );
      });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      return;
    }
    setIsGettingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          const name =
            data.display_name ||
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          handleSelect({ lat: latitude, lon: longitude, name });
        } catch {
          handleSelect({
            lat: latitude,
            lon: longitude,
            name: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      () => {
        setIsGettingLocation(false);
        setLocationError("Unable to retrieve your location");
      }
    );
  };

  const confirmSelection = async () => {
    if (!selectedLocation) return;

    // Save in localStorage
    localStorage.setItem("user_location", JSON.stringify(selectedLocation));

    // Build payload like "lat,lon"
    const payload = {
      location: `${selectedLocation.lat},${selectedLocation.lon}`,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/updatelocation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update location");
      }

      const result = await response.json();
      toast.success("Location updated successfully");
      console.log("Location updated successfully:", result);
    } catch (error) {
      console.error("Error updating location:", error);
    }

    setOpen(false);
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (selectedLocation) {
      localStorage.setItem("user_location", JSON.stringify(selectedLocation));
    } else {
      localStorage.setItem("user_location", JSON.stringify(defaultLocation));
    }
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      )}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="max-w-lg z-50 bg-white text-gray-900 border border-gray-200 shadow-xl jost-text"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader className="pb-4">
            <DialogTitle className="text-gray-900 text-xl font-semibold">
              Select Your Location
            </DialogTitle>
          </DialogHeader>

          <div className="relative mb-3 z-[1000]">
            <Input
              value={query}
              onChange={handleInputChange}
              placeholder="Search for your location"
            />
            {isSearching && (
              <div className="absolute top-full left-0 right-0 bg-white border p-2 text-sm text-gray-600 z-50 shadow-md rounded-b">
                Searching...
              </div>
            )}
            {!isSearching && showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 bg-white border z-50 max-h-60 overflow-y-auto shadow-md rounded-b">
                {suggestions.map((loc, idx) => (
                  <li
                    key={idx}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelect(loc)}
                  >
                    {loc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            ref={mapRef}
            className="w-full h-[250px] border rounded-xl mb-3 z-0"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          />

          <Button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            variant="outline"
            className="w-full mb-3 flex items-center justify-center gap-2"
          >
            <LocateFixed className="w-5 h-5" />
            {isGettingLocation ? "Getting Location..." : "Use My Location"}
          </Button>

          {/* Always show confirm */}
          <Button
            onClick={confirmSelection}
            className="w-full bg-primary text-white"
          >
            Confirm Location
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
