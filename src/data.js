import byMunicpipality from "./data/stats_by_municipality";
import byCounty from "./data/stats_by_county";

function flatten(obj) {
  return Object.keys(obj).map((code) => ({
    code,
    ...obj[code],
  }));
}

export const statsByMunicpipality = byMunicpipality;
export const statsByCounty = byCounty;
export const counties = flatten(statsByCounty);
export const municipalities = flatten(statsByMunicpipality);
