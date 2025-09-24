"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, LocateFixed } from "lucide-react";
import { toast } from "react-toastify";

export function LocationPicker({ onLocationSelect, initialLocation }) {
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState(null);

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !map) {
      import("leaflet").then((L) => {
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
          [40.7128, -74.006],
          10
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstance);

        // Click handler
        mapInstance.on("click", async (e) => {
          const { lat, lng } = e.latlng;
          setMarkerOnMap(lat, lng, mapInstance);
        });

        setMap(mapInstance);
      });
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [map]);

  // Helper to set marker & reverse geocode
  const setMarkerOnMap = async (lat, lng, mapInstance) => {
    if (!mapInstance) return;

    if (markerRef.current) {
      mapInstance.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    const L = await import("leaflet");
    const newMarker = L.marker([lat, lng]).addTo(mapInstance);
    markerRef.current = newMarker;
    mapInstance.setView([lat, lng], 15);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      const addressString =
        data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      setCoordinates({ lat, lng, address: addressString });
      setAddress(addressString);
      onLocationSelect?.(lat, lng, addressString);
    } catch {
      setCoordinates({ lat, lng });
      onLocationSelect?.(lat, lng);
    }
  };

  // Handle initialLocation
  useEffect(() => {
    if (initialLocation) {
      const match = initialLocation.match(/\(([^,]+),([^,]+)\)/);
      if (match) {
        const lng = parseFloat(match[1].trim());
        const lat = parseFloat(match[2].trim());
        setCoordinates({ lat, lng });
        if (map) setMarkerOnMap(lat, lng, map);
      }
    }
  }, [initialLocation, map]);

  // Address search
  const handleAddressSearch = async () => {
    if (!address.trim()) {
      toast.error("Please enter an address");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1&addressdetails=1`
      );
      const data = await response.json();

      if (data.length === 0) {
        toast.error("Address not found, try another one");
        return;
      }

      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      setMarkerOnMap(lat, lng, map);

      // toast.success(`Address Found: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } catch {
      toast.error("Failed to geocode address, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddressSearch();
    }
  };

  // ✅ Use My Location button
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await setMarkerOnMap(latitude, longitude, map);
        // toast.success("Current location set!");
        setIsLoading(false);
      },
      () => {
        toast.error("Unable to retrieve your location");
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Address Input */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="address" className="pb-4">
                Enter Address
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="e.g., 1600 Amphitheatre Parkway, Mountain View, CA"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={handleAddressSearch}
                disabled={isLoading}
                className="px-6 hover:opacity-90"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
              <Button
                onClick={handleUseMyLocation}
                disabled={isLoading}
                variant="secondary"
                className="px-4 text-white"
              >
                <LocateFixed className="w-4 h-4 mr-1" />
                Use My Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Select on Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click anywhere on the map to get coordinates
              </p>
              <div
                ref={mapRef}
                className="w-full  rounded-lg border border-border"
                style={{ minHeight: "300px" }}
              />
              <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
              />
            </div>
          </CardContent>
        </Card>

        {coordinates && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="pb-2">Latitude</Label>
                  <Input
                    value={coordinates.lat.toFixed(6)}
                    readOnly
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label className="pb-2">Longitude</Label>
                  <Input
                    value={coordinates.lng.toFixed(6)}
                    readOnly
                    className="font-mono"
                  />
                </div>
              </div>
              {coordinates.address && (
                <div className="pb-2">
                  <Label className="pb-2">Address</Label>
                  <Input
                    value={coordinates.address}
                    readOnly
                    className="text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default LocationPicker;
