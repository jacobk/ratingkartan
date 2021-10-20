import "./App.css";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { fitSize, geoTransverseMercator } from "d3-geo";
import { randomColor } from "randomcolor";
import { scaleQuantile, scaleQuantize, scaleThreshold } from "d3-scale";
import { extent } from "d3-array";
import _ from "lodash";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { DataGrid } from "@mui/x-data-grid";
import RegionTable from "./RegionTable";
import RegionList from "./RegionList";
import { statsByCounty, counties, statsByMunicpipality } from "./data.js";
import { useState } from "react";

// import municipalityStats from "./data/stats_by_municipality";
// import countyStats from "./data/stats_by_county";

// "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/sweden/sweden-municipalities.json";
// const geoUrlCounties =
//   "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/sweden/sweden-counties.json";

// https://www.dataman.se/data/shape-maps-topojson/
const geoUrlMunicipalities =
  "https://raw.githubusercontent.com/Axelsson2000/data/master/TopoJSON/Kommun-KnKod-KnNamn_20191230.json";
const geoUrlCounties =
  "https://raw.githubusercontent.com/Axelsson2000/data/master/TopoJSON/Lan_LnBokstav_LnKod_LnNamn_20191229.json";

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
console.log(projection);

function calcHue(value, min, max) {
  // [min-bin*1, (min+bin*2)-bin*2, ]
  const binSize = (max - min) / greenColorScale.length;
  const bin = Math.floor((value - min) / binSize);
  console.log("value", value, "-", binSize, bin, (value - min) / binSize);
  return greenColorScale[bin];
}

const colorScale2 = (stat) => {
  const defaultScale = scaleQuantile()
    .domain(_.map(statsByMunicpipality, `stats.${stat}`))
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

// scaleQuantize()
//   .domain(extent(_.map(statsByMunicpipality, `stats.${stat}`)))
//   .range(colorScale3);

// const colorScale2 = (stat) =>
//   scaleQuantize()
//     .nice()
//     // scaleQuantile()
//     .domain(_.map(statsByMunicpipality, `stats.${stat}`))
//     .range(colorScale3);

function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Yeeeeeet
          </Typography>
          <Button color="inherit" component={RouterLink} to="/toplistan">
            Topplistan
          </Button>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/errata">
            Errata
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}

function App() {
  return (
    <Router>
      <div>
        <ButtonAppBar />
        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/toplistan">
            <Toplistan />
          </Route>
          <Route path="/errata">
            <Errata />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  const [hovered, setHovered] = useState(false);
  const [selectedCountyCode, setSelectedCountyCode] = useState(null);
  const [selectedStat, setSelectedStat] = useState("mean");

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <ComposableMap
            // projection="geoMercator"
            projection="geoTransverseMercator"
            projectionConfig={projectionConfig}
            style={{ width: "100%", height: 400 }}
            width={100}
            height={250}
          >
            {/* <Geographies geography={geoUrlMunicipalities}> */}
            <Geographies
              geography={geoUrlCounties}
              stroke="#FFFFFF"
              strokeWidth={0.5}
            >
              {({ geographies }) =>
                geographies.map((geo) => {
                  // const data = municipalityStats[geo.properties.KnKod];
                  const data = statsByCounty[geo.properties.LnKod];
                  const countyCode = geo.properties.LnKod;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      // fill={colorScale2(data.stats.mean)}
                      onMouseEnter={() => {
                        if (hovered) {
                          return;
                        }
                        setHovered(true);
                        console.log(geo);
                      }}
                      onMouseLeave={() => {
                        setHovered(false);
                      }}
                      onMouseDown={() => {
                        if (
                          selectedCountyCode &&
                          selectedCountyCode === countyCode
                        ) {
                          setSelectedCountyCode(null);
                        } else {
                          setSelectedCountyCode(countyCode);
                        }
                      }}
                      style={{
                        default: {
                          outline: "none",
                          fill:
                            geo.properties.LnKod === selectedCountyCode
                              ? "#DD4132"
                              : colorScale2(selectedStat)(
                                  data.stats[selectedStat]
                                ),
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
                          strokeWidth: 0.75,
                          outline: "none",
                          transition: "all 250ms",
                        },
                        pressed: {
                          fill: "#DD4132",
                          stroke: "#9E1030",
                          strokeWidth: 0.75,
                          outline: "none",
                          transition: "all 250ms",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </Grid>
        <Grid item xs={12} sm={9}>
          {selectedCountyCode}
          <RegionList
            regionData={counties}
            sortModel={selectedStat}
            onSortModelChanged={setSelectedStat}
          />
          {/* <RegionTable
            regionData={Object.values(countyStats).map(
              ({ name, stats }, idx) => {
                console.log("Mapping data");
                return {
                  id: idx,
                  name,
                  ...stats,
                };
              }
            )}
          /> */}
        </Grid>
      </Grid>
    </Box>
  );
}

function Toplistan() {
  return <div>Hej</div>;
}

function Errata() {
  return <div>Hej</div>;
}
export default App;
