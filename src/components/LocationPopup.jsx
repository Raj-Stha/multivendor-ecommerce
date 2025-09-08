"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

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

export default function LocationPopup() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding to get location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();

          const currentLoc = {
            name:
              data.display_name ||
              `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(
                4
              )})`,
            lat: latitude,
            lon: longitude,
          };

          setSelectedLocation(currentLoc);
          setQuery(currentLoc.name);
          setSuggestions([]);
          setCookie("user_location", JSON.stringify(currentLoc), 7);

          try {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/updatelocation`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  location: `${latitude},${longitude}`,
                }),
              }
            );
          } catch (apiError) {
            console.error("Error sending location to API:", apiError);
          }

          setOpen(false);
        } catch (error) {
          console.error("Error getting location name:", error);
          const currentLoc = {
            name: `Current Location (${latitude.toFixed(
              4
            )}, ${longitude.toFixed(4)})`,
            lat: latitude,
            lon: longitude,
          };
          setSelectedLocation(currentLoc);
          setQuery(currentLoc.name);
          setSuggestions([]);
          setCookie("user_location", JSON.stringify(currentLoc), 7);

          try {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/updatelocation`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  location: `${latitude},${longitude}`,
                }),
              }
            );
          } catch (apiError) {
            console.error("Error sending location to API:", apiError);
          }

          setOpen(false);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied by user.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError(
              "An unknown error occurred while getting location."
            );
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 jost-text" />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg z-50 jost-text">
          <DialogHeader>
            <DialogTitle>Select Your Location</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
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

            {locationError && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {locationError}
              </div>
            )}

            <div className="text-sm mb-2">
              Selected Location: {selectedLocation?.name}
            </div>
          </div>

          <div className="w-full h-[300px] border rounded-lg overflow-hidden">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                (selectedLocation?.lon || defaultLocation.lon) - 0.01
              },${(selectedLocation?.lat || defaultLocation.lat) - 0.01},${
                (selectedLocation?.lon || defaultLocation.lon) + 0.01
              },${
                (selectedLocation?.lat || defaultLocation.lat) + 0.01
              }&layer=mapnik&marker=${
                selectedLocation?.lat || defaultLocation.lat
              },${selectedLocation?.lon || defaultLocation.lon}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="Location Map"
            />
          </div>

          <Button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            variant="outline"
            className="w-full flex items-center gap-2 bg-transparent"
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            {isGettingLocation
              ? "Getting your location..."
              : "Use my current location"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
