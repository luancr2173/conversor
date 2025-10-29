import { point } from "@turf/helpers";
import proj4 from "proj4";

// Converte coordenadas UTM → Decimais
export const UtmToDec = ({ easting, northing, zone, hemisphere }) => {
  const projUTM = hemisphere === "S"
    ? `+proj=utm +zone=${zone} +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs`
    : `+proj=utm +zone=${zone} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;

  const [lon, lat] = proj4(projUTM, "WGS84", [easting, northing]);

  return point([lon, lat]).geometry.coordinates
    ? { lon, lat }
    : { lon, lat };
};

// Converte coordenadas GMS → Decimais
export const GmsToDec = (deg, min, sec, dir) => {
  let dec = Math.abs(deg) + min / 60 + sec / 3600;
  if (dir === "S" || dir === "W") dec = -dec;
  return dec;
};
