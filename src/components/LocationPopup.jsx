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

function getLocalStorageLocation() {
  try {
    const stored = localStorage.getItem("user_location");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function LocationPopup() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const storedLocation = getLocalStorageLocation();

    if (storedLocation) {
      setSelectedLocation(storedLocation);
      setQuery(storedLocation.name);
    } else {
      setSelectedLocation(defaultLocation);
      setQuery(defaultLocation.name);
      setOpen(true);
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
        )}&limit=5&addressdetails=1&dedupe=1`
      );
      const data = await response.json();

      const results = data.map((item) => ({
        name: item.display_name,
        lat: Number(item.lat),
        lon: Number(item.lon),
      }));

      setSuggestions(results);
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
    setQuery(e.target.value);
  };

  const handleSelect = (loc) => {
    setSelectedLocation(loc);
    setQuery(loc.name);
    setSuggestions([]);
    setShowConfirm(false); // confirm only for current location
  };

  const confirmSelection = () => {
    if (selectedLocation) {
      localStorage.setItem("user_location", JSON.stringify(selectedLocation));
      setOpen(false);
    }
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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();

          const currentLoc = {
            name: data.display_name || `Current Location`,
            lat: latitude,
            lon: longitude,
          };

          setSelectedLocation(currentLoc);
          setQuery(currentLoc.name);
          setSuggestions([]);
          setShowConfirm(true); // only now show confirm
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          setLocationError("Could not determine location name.");
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
            setLocationError("An unknown error occurred.");
            break;
        }
      }
    );
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg z-50 bg-white text-gray-900 border border-gray-200 shadow-xl jost-text">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-gray-900 text-xl font-semibold">
              Select Your Location
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative w-full">
              <Input
                value={query}
                onChange={handleInputChange}
                placeholder="Search for your location"
                className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-gray-300 focus:border-primary focus:ring-primary"
              />
              {isSearching && (
                <div className="absolute bg-white border border-gray-200 w-full mt-1 rounded shadow-lg z-10 p-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching locations...
                  </div>
                </div>
              )}
              {!isSearching && suggestions.length > 0 && (
                <ul className="absolute bg-white border border-gray-200 w-full mt-1 rounded shadow-lg z-[1000] max-h-48 overflow-y-auto">
                  {suggestions.map((loc, index) => (
                    <li
                      key={index}
                      className="p-3 cursor-pointer hover:bg-primary/10 text-sm border-b border-gray-100 last:border-b-0 text-gray-900 transition-colors flex items-center gap-2"
                      onClick={() => handleSelect(loc)}
                    >
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="truncate">{loc.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {locationError && (
              <div className="text-sm text-red-800 bg-red-50 p-3 rounded-md border border-red-200 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                {locationError}
              </div>
            )}

            {selectedLocation && (
              <div className="bg-primary/10 border border-primary rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary mb-1">
                      Selected Location
                    </p>
                    <p className="text-sm text-primary break-words">
                      {selectedLocation.name}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full h-[280px] border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-100 shadow-inner">
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

          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-primary/10 text-primary border-2 border-primary transition-all duration-200 py-3 font-medium"
            >
              {isGettingLocation ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-primary">Getting your location...</span>
                </>
              ) : (
                <>
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-primary">Use my current location</span>
                </>
              )}
            </Button>

            {showConfirm && (
              <Button
                onClick={confirmSelection}
                className="w-full bg-primary hover:bg-primary text-white font-semibold py-3 transition-all duration-200 shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
              >
                Confirm Location
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
