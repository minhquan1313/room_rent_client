import { Coords } from "google-map-react";

export function calculateDistance(user: Coords, target: Coords) {
  const earthRadius = 6371000; // Bán kính Trái Đất (đơn vị: mét)

  const radLat1 = (Math.PI * user.lat) / 180;
  const radLat2 = (Math.PI * target.lat) / 180;

  const deltaLat = (Math.PI * (target.lat - user.lat)) / 180;
  const deltaLng = (Math.PI * (target.lng - user.lng)) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}
