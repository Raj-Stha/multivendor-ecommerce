"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";

import { toast } from "react-toastify";
export function LocationPicker({ onLocationSelect, initialLocation }) {
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !map) {
      // Dynamically import Leaflet to avoid SSR issues
      import("leaflet").then((L) => {
        // Fix for default markers in Leaflet
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
        ); // Default to NYC

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstance);

        // Add click handler for map
        mapInstance.on("click", async (e) => {
          const { lat, lng } = e.latlng;

          // Remove existing marker
          if (marker) {
            mapInstance.removeLayer(marker);
          }

          // Add new marker
          const newMarker = L.marker([lat, lng]).addTo(mapInstance);
          setMarker(newMarker);

          // Reverse geocode to get address
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

            toast({
              title: "Location Selected",
              description: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            });
          } catch (error) {
            setCoordinates({ lat, lng });
            onLocationSelect?.(lat, lng);
            toast({
              title: "Location Selected",
              description: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            });
          }
        });

        setMap(mapInstance);
      });
    }

    // Cleanup
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, []);

  useEffect(() => {
    if (initialLocation) {
      const match = initialLocation.match(/\(([^,]+),([^,]+)\)/);
      if (match) {
        const lng = parseFloat(match[1].trim());
        const lat = parseFloat(match[2].trim());

        setCoordinates({ lat, lng });

        // Center map if already initialized
        if (map) {
          import("leaflet").then((L) => {
            if (marker) map.removeLayer(marker);
            const newMarker = L.marker([lat, lng]).addTo(map);
            setMarker(newMarker);
            map.setView([lat, lng], 15);
          });
        }
      }
    }
  }, [initialLocation, map]);

  // Geocode address
  const handleAddressSearch = async () => {
    if (!address.trim()) {
      toast({
        title: "Error",
        description: "Please enter an address",
        variant: "destructive",
      });
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
        toast({
          title: "Address Not Found",
          description: "Please try a different address",
          variant: "destructive",
        });
        return;
      }

      const result = data[0];
      const lat = Number.parseFloat(result.lat);
      const lng = Number.parseFloat(result.lon);

      // Update coordinates
      setCoordinates({ lat, lng, address: result.display_name });

      onLocationSelect?.(lat, lng, result.display_name);

      // Update map if available
      if (map) {
        // Remove existing marker
        if (marker) {
          map.removeLayer(marker);
        }

        // Add new marker and center map
        const L = await import("leaflet");
        const newMarker = L.marker([lat, lng]).addTo(map);
        setMarker(newMarker);
        map.setView([lat, lng], 15);
      }

      toast({
        title: "Address Found",
        description: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to geocode address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddressSearch();
    }
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
            <div className="flex items-end">
              <Button
                onClick={handleAddressSearch}
                disabled={isLoading}
                className="px-6"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select on Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click anywhere on the map to get coordinates
            </p>
            <div
              ref={mapRef}
              className="w-full h-96 rounded-lg border border-border"
              style={{ minHeight: "400px" }}
            />
            {/* Load Leaflet CSS */}
            <link
              rel="stylesheet"
              href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
              integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
              crossOrigin=""
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
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
            {/* <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${coordinates.lat}, ${coordinates.lng}`
                  );
                  toast({
                    title: "Copied!",
                    description: "Coordinates copied to clipboard",
                  });
                }}
              >
                Copy Coordinates
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const data = {
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                    address: coordinates.address,
                  };
                  navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                  toast({
                    title: "Copied!",
                    description: "Location data copied as JSON",
                  });
                }}
              >
                Copy as JSON
              </Button>
            </div> */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default LocationPicker;
