type CoordinateValue = string | number | null | undefined;

export interface MapPinSource {
  map_pin?: {
    latitude?: CoordinateValue;
    longitude?: CoordinateValue;
  } | null;
  latitude?: CoordinateValue;
  longitude?: CoordinateValue;
  mapPin?: string | null;
}

function parseCoordinate(value: CoordinateValue): number | null {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Formats map coordinates as "00.0000, 00.0000" (at most 4 decimal places).
 */
export function formatMapPin(source: MapPinSource): string | null {
  const lat =
    parseCoordinate(source.map_pin?.latitude) ??
    parseCoordinate(source.latitude);
  const lng =
    parseCoordinate(source.map_pin?.longitude) ??
    parseCoordinate(source.longitude);

  if (lat !== null && lng !== null) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  if (typeof source.mapPin === "string") {
    const parts = source.mapPin.split(",").map((part) => part.trim());
    if (parts.length === 2) {
      const fallbackLat = parseCoordinate(parts[0]);
      const fallbackLng = parseCoordinate(parts[1]);
      if (fallbackLat !== null && fallbackLng !== null) {
        return `${fallbackLat.toFixed(4)}, ${fallbackLng.toFixed(4)}`;
      }
    }
  }

  return null;
}

