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

// https://davidmathlogic.com/colorblind/#%23648FFF-%23785EF0-%23DC267F-%23FE6100-%23FFB000
export const divisions = {
  novice: {
    name: "Novice",
    code: "MA4",
    color: "#648FFF",
    cond: "<",
    limit: 850,
    prefix: true,
  },
  recreational: {
    name: "Recreational",
    code: "MA3",
    color: "#785EF0",
    cond: "+",
    limit: 850,
  },
  intermediate: {
    name: "Intermediate",
    code: "MA2",
    color: "#DC267F",
    cond: "+",
    limit: 900,
  },
  advanced: {
    name: "Advanced",
    code: "MA1",
    color: "#FE6100",
    cond: "+",
    limit: 935,
  },
  pro: {
    name: "Pro",
    code: "MPO",
    color: "#FFB000",
    cond: "+",
    limit: 970,
  },
};

export function getDivision(rating) {
  if (rating < 850) {
    return divisions.novice;
  }
  if (rating < 900) {
    return divisions.recreational;
  }
  if (rating < 935) {
    return divisions.intermediate;
  }
  if (rating < 970) {
    return divisions.advanced;
  }
  return divisions.pro;
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
