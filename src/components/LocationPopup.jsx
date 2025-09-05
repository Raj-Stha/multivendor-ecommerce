"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup as LeafletPopup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const defaultLocation = { name: "Kathmandu, Nepal", lat: 27.7172, lon: 85.324 };

// helper functions for cookies
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Change map center when location changes
function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lon], 10);
    }
  }, [coords, map]);
  return null;
}

export default function LocationPopup() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const cookieLocation = getCookie("user_location");
    if (cookieLocation) {
      try {
        const loc = JSON.parse(cookieLocation);
        setSelectedLocation(loc);
        setQuery(loc.name);
      } catch (e) {
        console.error("Invalid cookie JSON");
      }
    } else {
      setSelectedLocation(defaultLocation);
      setQuery(defaultLocation.name);
      setOpen(true); // show popup on first visit
    }
  }, []);

  const searchLocations = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`
      );
      const data = await response.json();

      const locations = data.map((item) => ({
        name: item.display_name,
        lat: Number.parseFloat(item.lat),
        lon: Number.parseFloat(item.lon),
      }));

      setSuggestions(locations);
    } catch (error) {
      console.error("Error searching locations:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchLocations(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSelect = (loc) => {
    setSelectedLocation(loc);
    setQuery(loc.name);
    setSuggestions([]);
    setCookie("user_location", JSON.stringify(loc), 7); // store for 7 days
    setOpen(false);
  };

  const handleMapClick = (e) => {
    const loc = {
      name: "Custom Location",
      lat: e.latlng.lat,
      lon: e.latlng.lng,
    };
    setSelectedLocation(loc);
    setQuery(loc.name);
    setCookie("user_location", JSON.stringify(loc), 7);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg jost-text z-50">
          <DialogHeader>
            <DialogTitle>Select Your Location</DialogTitle>
          </DialogHeader>

          <div className="relative w-full">
            <Input
              value={query}
              onChange={handleInputChange}
              placeholder="Enter your location (e.g., India, New York, London)"
            />
            {isSearching && (
              <div className="absolute bg-white border w-full mt-1 rounded shadow-md z-10 p-2 text-sm text-gray-500">
                Searching...
              </div>
            )}
            {!isSearching && suggestions.length > 0 && (
              <ul className="absolute bg-white border w-full mt-1 rounded shadow-md z-[1000] max-h-48 overflow-y-auto">
                {suggestions.map((loc, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-100 text-sm border-b last:border-b-0"
                    onClick={() => handleSelect(loc)}
                  >
                    {loc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-2 text-sm mb-2">
            Selected Location: {selectedLocation?.name}
          </div>

          <MapContainer
            center={[
              selectedLocation?.lat || defaultLocation.lat,
              selectedLocation?.lon || defaultLocation.lon,
            ]}
            zoom={10}
            style={{ height: "300px", width: "100%" }}
            whenCreated={(map) => map.invalidateSize()}
            onclick={handleMapClick}
            className="z-49"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                <LeafletPopup>{selectedLocation.name}</LeafletPopup>
              </Marker>
            )}
            {selectedLocation && <ChangeMapView coords={selectedLocation} />}
          </MapContainer>
        </DialogContent>
      </Dialog>
    </>
  );
}
