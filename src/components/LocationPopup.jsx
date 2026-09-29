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

export default function LocationPopup({
  status = false,
  onClose,
  user,
  initialLocation,
}) {
  const [open, setOpen] = useState(status);
  const { getUser } = useUser();
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

  // =========================================================
  // Australia-only location validation
  // =========================================================
  const isAustraliaLocation = (lat, lon) => {
    // Approximate Australia bounding box.
    // Includes mainland Australia and Tasmania.
    return lat >= -43.7 && lat <= -10.5 && lon >= 112.0 && lon <= 154.0;
  };

  // =========================================================
  // Initialize popup with initialLocation
  // =========================================================
  useEffect(() => {
    const popStatus = localStorage.getItem("popStatus");

    if (initialLocation) {
      if (isAustraliaLocation(initialLocation.lat, initialLocation.lon)) {
        setSelectedLocation(initialLocation);
        setQuery(initialLocation.name);
      } else {
        // Do not allow an existing non-Australian location
        setSelectedLocation(null);
        setQuery("");
      }

      if (!popStatus) setOpen(true);
    }
  }, [initialLocation]);

  // =========================================================
  // Initialize Leaflet map
  // =========================================================
  // useEffect(() => {
  //   if (!open || leafletMap.current) return;

  //   const initializeMap = async () => {
  //     const L = await import("leaflet");

  //     delete L.Icon.Default.prototype._getIconUrl;

  //     L.Icon.Default.mergeOptions({
  //       iconRetinaUrl:
  //         "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  //       iconUrl:
  //         "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  //       shadowUrl:
  //         "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  //     });

  //     // Australia center
  //     const australiaCenter = [-25.2744, 133.7751];

  //     const hasValidLocation =
  //       selectedLocation &&
  //       isAustraliaLocation(selectedLocation.lat, selectedLocation.lon);

  //     const mapInstance = L.map(mapRef.current).setView(
  //       hasValidLocation
  //         ? [selectedLocation.lat, selectedLocation.lon]
  //         : australiaCenter,
  //       hasValidLocation ? 13 : 4,
  //     );

  //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //       attribution: "© OpenStreetMap contributors",
  //     }).addTo(mapInstance);

  //     // Add existing marker only if location is inside Australia
  //     if (hasValidLocation) {
  //       markerRef.current = L.marker([
  //         selectedLocation.lat,
  //         selectedLocation.lon,
  //       ]).addTo(mapInstance);
  //     }

  //     mapInstance.invalidateSize();

  //     // =====================================================
  //     // Map click
  //     // =====================================================
  //     mapInstance.on("click", async (e) => {
  //       setManualInput(false);
  //       setShowSuggestions(false);

  //       const { lat, lng } = e.latlng;

  //       // Reject locations outside Australia
  //       if (!isAustraliaLocation(lat, lng)) {
  //         toast.error("Please select a location within Australia");
  //         return;
  //       }

  //       if (markerRef.current) {
  //         mapInstance.removeLayer(markerRef.current);
  //       }

  //       markerRef.current = L.marker([lat, lng]).addTo(mapInstance);

  //       try {
  //         const response = await fetch(
  //           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
  //         );

  //         const data = await response.json();

  //         // Extra country validation
  //         const countryCode = data?.address?.country_code?.toLowerCase();

  //         if (countryCode !== "au") {
  //           toast.error("Please select a location within Australia");

  //           if (markerRef.current) {
  //             mapInstance.removeLayer(markerRef.current);
  //             markerRef.current = null;
  //           }

  //           return;
  //         }

  //         const name =
  //           data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

  //         setSelectedLocation({
  //           lat,
  //           lon: lng,
  //           name,
  //         });

  //         setQuery(name);
  //       } catch {
  //         // Even if reverse geocoding fails,
  //         // the coordinate must still be inside Australia's area.
  //         setSelectedLocation({
  //           lat,
  //           lon: lng,
  //           name: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
  //         });

  //         setQuery(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  //       }
  //     });

  //     leafletMap.current = mapInstance;
  //   };

  //   setTimeout(initializeMap, 100);

  //   return () => {
  //     if (leafletMap.current) {
  //       leafletMap.current.remove();
  //       leafletMap.current = null;
  //       markerRef.current = null;
  //     }
  //   };
  // }, [open]);

  // =========================================================
  // Initialize Leaflet map
  // =========================================================
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    let timer = null;

    const initializeMap = async () => {
      const L = await import("leaflet");

      // Component/effect may have been cleaned up
      if (cancelled) return;

      // Make sure the DOM element still exists
      if (!mapRef.current) return;

      // If Leaflet already has a map on this container,
      // remove it before creating a new one.
      const existingMap = mapRef.current._leaflet_id;

      if (existingMap) {
        try {
          const oldMap = leafletMap.current;

          if (oldMap) {
            oldMap.remove();
          }
        } catch (error) {
          console.warn("Error removing old Leaflet map:", error);
        }

        leafletMap.current = null;
        markerRef.current = null;

        // Remove Leaflet's internal container ID
        delete mapRef.current._leaflet_id;
      }

      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      // Australia center
      const australiaCenter = [-25.2744, 133.7751];

      const hasValidLocation =
        selectedLocation &&
        isAustraliaLocation(selectedLocation.lat, selectedLocation.lon);

      const mapInstance = L.map(mapRef.current).setView(
        hasValidLocation
          ? [selectedLocation.lat, selectedLocation.lon]
          : australiaCenter,
        hasValidLocation ? 13 : 4,
      );

      // If cleanup happened while creating the map
      if (cancelled) {
        mapInstance.remove();
        return;
      }

      leafletMap.current = mapInstance;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance);

      // Add existing marker only if location is inside Australia
      if (hasValidLocation) {
        markerRef.current = L.marker([
          selectedLocation.lat,
          selectedLocation.lon,
        ]).addTo(mapInstance);
      }

      setTimeout(() => {
        if (!cancelled && leafletMap.current) {
          leafletMap.current.invalidateSize();
        }
      }, 100);

      // =====================================================
      // Map click
      // =====================================================
      mapInstance.on("click", async (e) => {
        if (cancelled) return;

        setManualInput(false);
        setShowSuggestions(false);

        const { lat, lng } = e.latlng;

        // Reject locations outside Australia
        if (!isAustraliaLocation(lat, lng)) {
          toast.error("Please select a location within Australia");
          return;
        }

        // Remove previous marker
        if (markerRef.current) {
          try {
            mapInstance.removeLayer(markerRef.current);
          } catch (error) {
            console.warn("Unable to remove previous marker:", error);
          }

          markerRef.current = null;
        }

        // Add new marker
        markerRef.current = L.marker([lat, lng]).addTo(mapInstance);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          );

          const data = await response.json();

          // Extra country validation
          const countryCode = data?.address?.country_code?.toLowerCase();

          if (countryCode !== "au") {
            toast.error("Please select a location within Australia");

            if (markerRef.current) {
              mapInstance.removeLayer(markerRef.current);
              markerRef.current = null;
            }

            return;
          }

          const name =
            data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

          setSelectedLocation({
            lat,
            lon: lng,
            name,
          });

          setQuery(name);
        } catch {
          // Even if reverse geocoding fails,
          // coordinate must still be inside Australia
          setSelectedLocation({
            lat,
            lon: lng,
            name: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          });

          setQuery(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      });
    };

    // Small delay allows Radix Dialog to finish rendering
    timer = setTimeout(() => {
      initializeMap();
    }, 100);

    return () => {
      // Cancel pending initialization
      cancelled = true;

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      // Remove existing map
      if (leafletMap.current) {
        try {
          leafletMap.current.off();
          leafletMap.current.remove();
        } catch (error) {
          console.warn("Error cleaning up Leaflet map:", error);
        }

        leafletMap.current = null;
      }

      // Clear marker ref
      markerRef.current = null;

      // Remove Leaflet's internal container ID
      if (mapRef.current) {
        delete mapRef.current._leaflet_id;
      }
    };
  }, [open]);
  // =========================================================
  // Search suggestions - AUSTRALIA ONLY
  // =========================================================
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
            query,
          )}&countrycodes=au&limit=5&addressdetails=1`,
        );

        const data = await response.json();

        const results = data
          .filter((item) => item?.address?.country_code?.toLowerCase() === "au")
          .map((item) => ({
            name: item.display_name,
            lat: Number(item.lat),
            lon: Number(item.lon),
          }))
          .filter((item) => isAustraliaLocation(item.lat, item.lon));

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

  // =========================================================
  // Input change
  // =========================================================
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setManualInput(true);

    if (e.target.value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // =========================================================
  // Select search suggestion
  // =========================================================
  const handleSelect = (loc) => {
    // Final Australia validation
    if (!isAustraliaLocation(loc.lat, loc.lon)) {
      toast.error("Please select a location within Australia");
      return;
    }

    setSelectedLocation(loc);
    setQuery(loc.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setManualInput(false);

    if (leafletMap.current) {
      import("leaflet").then((L) => {
        leafletMap.current.setView([loc.lat, loc.lon], 15);

        if (markerRef.current) {
          leafletMap.current.removeLayer(markerRef.current);
        }

        markerRef.current = L.marker([loc.lat, loc.lon]).addTo(
          leafletMap.current,
        );
      });
    }
  };

  // =========================================================
  // Use My Location
  // =========================================================
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Reject user's current location if outside Australia
        if (!isAustraliaLocation(latitude, longitude)) {
          setIsGettingLocation(false);
          setLocationError("Your current location is outside Australia");
          toast.error("Your current location is outside Australia");
          return;
        }

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          );

          const data = await response.json();

          // Extra country validation
          const countryCode = data?.address?.country_code?.toLowerCase();

          if (countryCode !== "au") {
            setIsGettingLocation(false);
            toast.error("Your current location is outside Australia");
            return;
          }

          const name =
            data.display_name ||
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

          handleSelect({
            lat: latitude,
            lon: longitude,
            name,
          });
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
        toast.error("Unable to retrieve your location");
      },
    );
  };

  // =========================================================
  // Confirm selection
  // =========================================================
  const confirmSelection = async () => {
    if (!selectedLocation) {
      toast.error("Please select an Australian location");
      return;
    }

    // Final safety check before saving
    if (!isAustraliaLocation(selectedLocation.lat, selectedLocation.lon)) {
      toast.error("Please select a location within Australia");
      return;
    }

    localStorage.setItem("popStatus", "true");

    const payload = user?.user_login_name
      ? {
          delivery_location: `${selectedLocation.lat},${selectedLocation.lon}`,
        }
      : {
          location: `${selectedLocation.lat},${selectedLocation.lon}`,
        };

    try {
      const response = await fetch(
        user?.user_login_name
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/updateuserdetails`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/updatelocation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update location");
      }

      const result = await response.json();

      await getUser();

      toast.success("Location updated successfully");
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
      return;
    }

    setOpen(false);
    onClose?.();
  };

  // =========================================================
  // Close popup
  // =========================================================
  const handleClose = () => {
    localStorage.setItem("popStatus", "true");
    setOpen(false);
    onClose?.();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      )}

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="max-w-lg z-50 bg-white text-gray-900 border border-gray-200 shadow-xl"
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
              placeholder="Search your location in Australia"
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

            {!isSearching &&
              showSuggestions &&
              suggestions.length === 0 &&
              query.trim() && (
                <div className="absolute top-full left-0 right-0 bg-white border p-2 text-sm text-gray-600 z-50 shadow-md rounded-b">
                  No Australian location found
                </div>
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
            className="w-full mb-3 flex cursor-pointer items-center justify-center gap-2"
          >
            <LocateFixed className="w-5 h-5" />

            {isGettingLocation ? "Getting Location..." : "Use My Location"}
          </Button>

          <Button
            onClick={confirmSelection}
            className="w-full bg-primary cursor-pointer text-white"
          >
            Confirm Location
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Workable Code for LocationPopup.jsx
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { LocateFixed } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { useUser } from "@/app/(home)/_context/UserContext";

// export default function LocationPopup({
//   status = false,
//   onClose,
//   user,
//   initialLocation,
// }) {
//   const [open, setOpen] = useState(status);
//   const { getUser } = useUser();
//   const [query, setQuery] = useState("");
//   const [manualInput, setManualInput] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [isSearching, setIsSearching] = useState(false);
//   const [isGettingLocation, setIsGettingLocation] = useState(false);
//   const [locationError, setLocationError] = useState("");

//   const mapRef = useRef(null);
//   const leafletMap = useRef(null);
//   const markerRef = useRef(null);

//   // Initialize popup with initialLocation or fallback
//   // useEffect(() => {
//   //   const popStatus = localStorage.getItem("popStatus");

//   //   if (initialLocation) {
//   //     setSelectedLocation(initialLocation);
//   //     setQuery(initialLocation.name);

//   //     if (!popStatus) setOpen(true);
//   //     return;
//   //   }

//   //   // fallback
//   //   setSelectedLocation(defaultLocation);
//   //   setQuery(defaultLocation.name);

//   //   if (!popStatus) setOpen(true);
//   // }, [initialLocation]);

//   useEffect(() => {
//     const popStatus = localStorage.getItem("popStatus");

//     // wait until initialLocation resolves
//     if (initialLocation) {
//       setSelectedLocation(initialLocation);
//       setQuery(initialLocation.name);

//       if (!popStatus) setOpen(true);
//     }
//   }, [initialLocation]);

//   // Initialize Leaflet map
//   useEffect(() => {
//     if (!open || !selectedLocation || leafletMap.current) return;

//     const initializeMap = async () => {
//       const L = await import("leaflet");
//       delete L.Icon.Default.prototype._getIconUrl;
//       L.Icon.Default.mergeOptions({
//         iconRetinaUrl:
//           "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//         iconUrl:
//           "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//         shadowUrl:
//           "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//       });

//       const mapInstance = L.map(mapRef.current).setView(
//         [selectedLocation.lat, selectedLocation.lon],
//         13,
//       );

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors",
//       }).addTo(mapInstance);

//       markerRef.current = L.marker([
//         selectedLocation.lat,
//         selectedLocation.lon,
//       ]).addTo(mapInstance);
//       mapInstance.invalidateSize();

//       mapInstance.on("click", async (e) => {
//         setManualInput(false);
//         setShowSuggestions(false);
//         const { lat, lng } = e.latlng;

//         if (markerRef.current) mapInstance.removeLayer(markerRef.current);
//         markerRef.current = L.marker([lat, lng]).addTo(mapInstance);

//         try {
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
//           );
//           const data = await response.json();
//           const name =
//             data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//           setSelectedLocation({ lat, lon: lng, name });
//           setQuery(name);
//         } catch {
//           setSelectedLocation({
//             lat,
//             lon: lng,
//             name: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
//           });
//         }
//       });

//       leafletMap.current = mapInstance;
//     };

//     setTimeout(initializeMap, 100);
//   }, [open, selectedLocation]);

//   // Search suggestions
//   useEffect(() => {
//     if (!query.trim() || !manualInput) {
//       setSuggestions([]);
//       setShowSuggestions(false);
//       return;
//     }

//     const timeout = setTimeout(async () => {
//       setIsSearching(true);
//       try {
//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//             query,
//           )}&limit=5&addressdetails=1`,
//         );
//         const data = await response.json();
//         const results = data.map((item) => ({
//           name: item.display_name,
//           lat: Number(item.lat),
//           lon: Number(item.lon),
//         }));
//         setSuggestions(results);
//         setShowSuggestions(true);
//       } catch {
//         setSuggestions([]);
//         setShowSuggestions(false);
//       } finally {
//         setIsSearching(false);
//       }
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [query, manualInput]);

//   const handleInputChange = (e) => {
//     setQuery(e.target.value);
//     setManualInput(true);
//     if (e.target.value.trim() === "") {
//       setSuggestions([]);
//       setShowSuggestions(false);
//     }
//   };

//   const handleSelect = (loc) => {
//     setSelectedLocation(loc);
//     setQuery(loc.name);
//     setSuggestions([]);
//     setShowSuggestions(false);
//     setManualInput(false);

//     if (leafletMap.current && markerRef.current) {
//       import("leaflet").then((L) => {
//         leafletMap.current.setView([loc.lat, loc.lon], 15);
//         leafletMap.current.removeLayer(markerRef.current);
//         markerRef.current = L.marker([loc.lat, loc.lon]).addTo(
//           leafletMap.current,
//         );
//       });
//     }
//   };

//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       setLocationError("Geolocation not supported.");
//       return;
//     }
//     setIsGettingLocation(true);
//     setLocationError("");

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;
//         try {
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
//           );
//           const data = await response.json();
//           const name =
//             data.display_name ||
//             `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
//           handleSelect({ lat: latitude, lon: longitude, name });
//         } catch {
//           handleSelect({
//             lat: latitude,
//             lon: longitude,
//             name: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
//           });
//         } finally {
//           setIsGettingLocation(false);
//         }
//       },
//       () => {
//         setIsGettingLocation(false);
//         setLocationError("Unable to retrieve your location");
//       },
//     );
//   };

//   const confirmSelection = async () => {
//     if (!selectedLocation) return;

//     localStorage.setItem("popStatus", "true");

//     const payload = user?.user_login_name
//       ? {
//           delivery_location: `${selectedLocation.lat},${selectedLocation.lon}`,
//         }
//       : {
//           location: `${selectedLocation.lat},${selectedLocation.lon}`,
//         };

//     try {
//       const response = await fetch(
//         user?.user_login_name
//           ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/updateuserdetails`
//           : `${process.env.NEXT_PUBLIC_API_BASE_URL}/updatelocation`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(payload),
//         },
//       );

//       if (!response.ok) throw new Error("Failed to update location");

//       const result = await response.json();
//       await getUser();
//       toast.success("Location updated successfully");
//     } catch (error) {
//       console.error("Error updating location:", error);
//     }

//     setOpen(false);
//     onClose?.();
//   };

//   const handleClose = () => {
//     localStorage.setItem("popStatus", "true");
//     setOpen(false);
//     onClose?.();
//   };

//   return (
//     <>
//       {open && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
//       )}
//       <Dialog open={open} onOpenChange={handleClose}>
//         <DialogContent
//           className="max-w-lg z-50 bg-white text-gray-900 border border-gray-200 shadow-xl "
//           onInteractOutside={(event) => event.preventDefault()}
//         >
//           <DialogHeader className="pb-4">
//             <DialogTitle className="text-gray-900 text-xl font-semibold">
//               Select Your Location
//             </DialogTitle>
//           </DialogHeader>

//           <div className="relative mb-3 z-[1000]">
//             <Input
//               value={query}
//               onChange={handleInputChange}
//               placeholder="Search for your location"
//             />
//             {isSearching && (
//               <div className="absolute top-full left-0 right-0 bg-white border p-2 text-sm text-gray-600 z-50 shadow-md rounded-b">
//                 Searching...
//               </div>
//             )}
//             {!isSearching && showSuggestions && suggestions.length > 0 && (
//               <ul className="absolute top-full left-0 right-0 bg-white border z-50 max-h-60 overflow-y-auto shadow-md rounded-b">
//                 {suggestions.map((loc, idx) => (
//                   <li
//                     key={idx}
//                     className="p-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => handleSelect(loc)}
//                   >
//                     {loc.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <div
//             ref={mapRef}
//             className="w-full h-[250px] border rounded-xl mb-3 z-0"
//           />
//           <link
//             rel="stylesheet"
//             href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
//           />

//           <Button
//             onClick={getCurrentLocation}
//             disabled={isGettingLocation}
//             variant="outline"
//             className="w-full mb-3 flex cursor-pointer items-center justify-center gap-2"
//           >
//             <LocateFixed className="w-5 h-5" />
//             {isGettingLocation ? "Getting Location..." : "Use My Location"}
//           </Button>

//           <Button
//             onClick={confirmSelection}
//             className="w-full bg-primary cursor-pointer text-white"
//           >
//             Confirm Location
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
