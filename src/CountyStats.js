import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import geoData from "./data/Kommun-KnKod-KnNamn_20191230.json";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { fitSize, geoTransverseMercator, geoBounds, geoCentroid } from "d3-geo";
import { scaleQuantile, scaleThreshold } from "d3-scale";
import { feature } from "topojson-client";
import RegionList from "./RegionList";
import { municipalities, getStats, getName } from "./data";
import { statsByCounty, statsByMunicipality } from "./data.js";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const projectionConfig = {
  scale: 1000,
  center: [2.3, 63.3],
  rotate: [-12, 1, 0],
};
const greenColorScale = [
  "#f7fcfd",
  "#e5f5f9",
  "#ccece6",
  "#99d8c9",
  "#66c2a4",
  "#41ae76",
  "#238b45",
  "#006d2c",
  "#00441b",
];

const redColorScale = [
  "#ffedea",
  "#ffcec5",
  "#ffad9f",
  "#ff8a75",
  "#ff5533",
  "#e2492d",
  "#be3d26",
  "#9a311f",
  "#782618",
];

const colorScale3 = [
  "#f0f9e8",
  "#b6e3bb",
  "#75c8c5",
  "#4ba8c9",
  "#2989bd",
  "#0a6aad",
  "#254b8c",
];

const projection = geoTransverseMercator();

function calcHue(value, min, max) {
  // [min-bin*1, (min+bin*2)-bin*2, ]
  const binSize = (max - min) / greenColorScale.length;
  const bin = Math.floor((value - min) / binSize);
  console.log("value", value, "-", binSize, bin, (value - min) / binSize);
  return greenColorScale[bin];
}

const colorScale2 = (stat, statsByMunicpipality) => {
  const defaultScale = scaleQuantile()
    .domain(_.map(statsByMunicpipality, `stats[0].stats.${stat}`))
    .range(colorScale3);
  const ratingScale = scaleThreshold()
    .domain([700, 800, 900, 1000, 1010, 1020, 1030])
    .range(colorScale3);
  const scales = {
    mean: defaultScale,
    max: ratingScale,
    min: scaleThreshold()
      .domain([50, 200, 400, 500, 600, 700, 800])
      .range(colorScale3),
    count: scaleThreshold()
      .domain([10, 50, 100, 200, 300, 500])
      .range(colorScale3),
  };
  return scales[stat] || defaultScale;
};

const feats = feature(
  geoData,
  geoData.objects[Object.keys(geoData.objects)[0]]
);

const countyZoom = {
  "01": 6,
  "03": 6,
  "04": 5,
  "05": 4,
  "06": 4,
  "07": 4,
  "08": 6,
  "09": 9,
  10: 6,
  12: 4,
  13: 5,
  14: 3,
  17: 4,
  18: 7,
  19: 7,
  20: 2,
  21: 3,
  22: 2,
  23: 2,
  24: 1.5,
  25: 1.5,
};

function selectCountyFeatures(countyCode) {
  const geo = {
    ...feats,
    features: feats.features.filter((feat) =>
      feat.properties.KnKod.startsWith(countyCode)
    ),
  };
  const bounds = geoBounds(geo);
  const center = geoCentroid(geo);
  const dx = bounds[1][0] - bounds[0][0];
  const dy = bounds[1][1] - bounds[0][1];
  console.log("dx, dy", dx, dy);
  const zoom = 0.9 / Math.max(dx / 530, dy / 410);
  return {
    geo,
    bounds,
    center,
    zoom: countyZoom[countyCode],
  };
}

export default function CountyStats() {
  const { countyCode } = useParams();
  const [selectedStat, setSelectedStat] = useState("mean");
  const [countyMunicipalities, setCountyMunicipalities] = useState([]);
  const [municipalitiesWithoutPlayers, setMunicipalitiesWithoutPlayers] =
    useState([]);
  const [countyGeo, setCountyGeo] = useState();
  if (!statsByCounty[countyCode]) {
    console.error("Unknown county code, should reirect");
  }

  console.log("munips", countyMunicipalities);

  useEffect(() => {
    console.log("COUNTY CHANGE");

    setCountyGeo(selectCountyFeatures(countyCode));
    setCountyMunicipalities(
      municipalities.filter(
        (m) => m.code.startsWith(countyCode) && m.stats[0].stats
      )
    );
    setMunicipalitiesWithoutPlayers(
      municipalities.filter(
        (m) => m.code.startsWith(countyCode) && !m.stats[0].stats
      )
    );
  }, [countyCode]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          {countyGeo && (
            <ComposableMap
              projection="geoTransverseMercator"
              projectionConfig={projectionConfig}
              style={{ width: "100%", height: 400 }}
              width={100}
              height={250}
            >
              <ZoomableGroup
                zoom={countyGeo.zoom}
                center={countyGeo.center}
                disableZooming
                disablePanning
              >
                <Geographies
                  geography={countyGeo.geo}
                  stroke="#FFFFFF"
                  strokeWidth={0}
                >
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const code = geo.properties.KnKod;
                      const data = statsByMunicipality[code];
                      console.log("data", data, geo);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          // fill={colorScale2(data.stats.mean)}

                          style={{
                            default: {
                              outline: "none",
                              fill: data
                                ? data.stats
                                  ? colorScale2(
                                      selectedStat,
                                      countyMunicipalities
                                    )(getStats(data)[selectedStat])
                                  : "#CCC"
                                : "#FFF",
                            },
                            // default: {
                            //   fill:
                            //     geography.properties.CONTINENT ===
                            //     this.state.highlighted
                            //       ? "#DD4132"
                            //       : "#F0EAD6",
                            //   stroke:
                            //     geography.properties.CONTINENT ===
                            //     this.state.highlighted
                            //       ? "#9E1030"
                            //       : "#B2A27D",
                            //   strokeWidth: 0.75,
                            //   outline: "none",
                            //   transition: "all 250ms"
                            // },
                            hover: {
                              fill: "#FF6F61",
                              stroke: "#9E1030",
                              // strokeWidth: 0.75,
                              outline: "none",
                              transition: "all 250ms",
                            },
                            pressed: {
                              fill: "#DD4132",
                              stroke: "#9E1030",
                              // strokeWidth: 0.75,
                              outline: "none",
                              transition: "all 250ms",
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          )}
        </Grid>
        <Grid item xs={12} sm={9}>
          <RegionList
            title={getName(countyCode)}
            regionData={countyMunicipalities}
            regionsWithoutPlayers={municipalitiesWithoutPlayers}
            sortModel={selectedStat}
            onSortModelChanged={setSelectedStat}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
