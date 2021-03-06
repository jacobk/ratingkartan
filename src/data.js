// import byMunicpipality from "./data/stats_by_municipality";
// import byCounty from "./data/stats_by_county";
import _ from "lodash";
import byCounty from "./data/full_stats_by_county-ci";
import byMunicipality from "./data/full_stats_by_municipality-ci";
import playerStats from "./data/full_stats_players-ci.json";
import names from "./data/kommner_lan_kod.json";
import meta from "./data/full_stats_metadata-ci.json";

export const metadata = meta;
const { currentMonth } = metadata;

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
  const stats = region.stats[0];
  if (stats && stats.month === currentMonth) {
    return stats.stats;
  }
  return noStats;
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
    playerClass: "mpo",
  },
  recreational: {
    name: "Recreational",
    code: "MA3",
    color: "#785EF0",
    cond: "+",
    limit: 850,
    playerClass: "mpo",
  },
  intermediate: {
    name: "Intermediate",
    code: "MA2",
    color: "#DC267F",
    cond: "+",
    limit: 900,
    playerClass: "mpo",
  },
  advanced: {
    name: "Advanced",
    code: "MA1",
    color: "#FE6100",
    cond: "+",
    limit: 935,
    playerClass: "mpo",
  },
  pro: {
    name: "Pro",
    code: "MPO",
    color: "#FFB000",
    cond: "+",
    limit: 970,
    playerClass: "mpo",
  },
  femaleNovice: {
    name: "Female Novice",
    code: "MA4",
    color: "#648FFF",
    cond: "<",
    limit: 725,
    prefix: true,
    playerClass: "fpo",
  },
  femaleRecreational: {
    name: "Female Recreational",
    code: "MA3",
    color: "#785EF0",
    cond: "+",
    limit: 725,
    playerClass: "fpo",
  },
  femaleIntermediate: {
    name: "Female Intermediate",
    code: "MA2",
    color: "#DC267F",
    cond: "+",
    limit: 775,
    playerClass: "fpo",
  },
  femaleAdvanced: {
    name: "Female Advanced",
    code: "MA1",
    color: "#FE6100",
    cond: "+",
    limit: 825,
    playerClass: "fpo",
  },
  femalePro: {
    name: "Female Pro",
    code: "MPO",
    color: "#FFB000",
    cond: "+",
    limit: 925,
    playerClass: "fpo",
  },
};

export function getDivision(rating, playerClass) {
  if (playerClass === "mpo") {
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

  if (playerClass === "fpo") {
    if (rating < 725) {
      return divisions.femaleNovice;
    }
    if (rating < 775) {
      return divisions.femaleRecreational;
    }
    if (rating < 825) {
      return divisions.femaleIntermediate;
    }
    if (rating < 925) {
      return divisions.femaleAdvanced;
    }
    return divisions.femalePro;
  }
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
export const playerList = Object.values(playerStats).filter(
  (player) => player.stats[0].month === currentMonth
);
export const counties = flatten(statsByCounty);
export const municipalities = flatten(statsByMunicipality);
