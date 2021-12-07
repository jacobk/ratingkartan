// import byMunicpipality from "./data/stats_by_municipality";
// import byCounty from "./data/stats_by_county";
import byMunicipality from "./data/full_stats_by_municipality-2021-11";
import byCounty from "./data/full_stats_by_county-2021-11";
import playerStats from "./data/full_stats_players-2021-11.json";
import names from "./data/kommner_lan_kod.json";
import _ from "lodash";

function flatten(obj) {
  return Object.keys(obj).map((code) => ({
    code,
    ...obj[code],
  }));
}

const noStats = {
  count: 0,
  mean: 0,
  median: 0,
  stddev: 0,
  max: 0,
  min: 0,
};

export function getStats(region) {
  return region.stats[0].stats || noStats;
}

export function getName(code) {
  return names[code];
}

export const statsByMunicipality = byMunicipality;
export const statsByCounty = byCounty;
export const regions = _.sortBy(
  Object.keys(names).map((code) => ({
    code,
    name: names[code],
  })),
  "name"
);
export const players = playerStats;
export const playerList = Object.values(playerStats);
export const counties = flatten(statsByCounty);
export const municipalities = flatten(statsByMunicipality);
