import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { playerList, regions } from "./data";
import React from "react";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import _ from "lodash";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import PlayerRow from "./PlayerRow";
import { bin } from "d3-array";
import { range } from "d3-array";
import { scaleBand } from "d3-scale";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  ComposedChart,
} from "recharts";
import { useTheme } from "@mui/material/styles";

export default function Players() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPlayers, setSelectedPlayers] = useState({
    stats: null,
    players: playerList,
  });
  const selectedRegions = searchParams.getAll("region");
  const selectedTerms = searchParams.getAll("terms");
  const selectedOptions = regions.filter((region) =>
    selectedRegions.includes(region.code)
  );
  const value = [
    ...selectedOptions,
    ...selectedTerms.map((t) => ({ term: true, name: t })),
  ];

  // https://davidmathlogic.com/colorblind/#%23648FFF-%23785EF0-%23DC267F-%23FE6100-%23FFB000
  const divisions = {
    novice: {
      name: "Novice",
      code: "MA4",
      color: "#648FFF",
      cond: "<",
      limit: 850,
    },
    recreational: {
      name: "Recreational",
      code: "MA3",
      color: "#785EF0",
      cond: "<",
      limit: 900,
    },
    intermediate: {
      name: "Intermediate",
      code: "MA2",
      color: "#DC267F",
      cond: "<",
      limit: 935,
    },
    advanced: {
      name: "Advanced",
      code: "MA1",
      color: "#FE6100",
      cond: "<",
      limit: 970,
    },
    pro: {
      name: "Pro",
      code: "MPO",
      color: "#FFB000",
      cond: ">",
      limit: 970,
    },
  };

  const filterByRegion = (regions, players) =>
    regions.length == 0
      ? players
      : players.filter((p) =>
          selectedRegions.some((r) =>
            [p.municipalityCode, p.countyCode].includes(r)
          )
        );

  const filterByTerms = (terms, players) => {
    return terms.length == 0
      ? players
      : players.filter((p) =>
          terms.some((t) => p.name.toLowerCase().includes(t.toLowerCase()))
        );
  };

  useEffect(() => {
    const sortedPlayers = _.orderBy(
      filterByTerms(selectedTerms, filterByRegion(selectedRegions, playerList)),
      "stats[0].rating",
      ["desc"]
    );

    const binner = bin().domain([0, 1060]).thresholds(range(550, 1060, 5));
    const getDivision = (rating) => {
      if (rating < 850) {
        return "novice";
      }
      if (rating < 900) {
        return "recreational";
      }
      if (rating < 935) {
        return "intermediate";
      }
      if (rating < 970) {
        return "advanced";
      }
      return "pro";
    };
    const hist = binner(sortedPlayers.map((p) => p.stats[0].rating)).map(
      (bin) => ({
        [getDivision(bin.x0)]: bin.length,
        label: `${bin.x0}-${bin.x1}`,
        x0: bin.x0,
        x1: bin.x1,
      })
    );

    const momHist = binner(
      sortedPlayers.filter((p) => p.stats[1]).map((p) => p.stats[1].rating)
    ).map((bin) => ({
      count: bin.length,
      label: `${bin.x0}-${bin.x1}`,
      x0: bin.x0,
      x1: bin.x1,
    }));

    // momHist.forEach((bin, idx) => (hist[idx].momCount = bin.length));

    // console.log(hist, momHist);
    setSelectedPlayers({
      players: sortedPlayers,
      stats: { hist, momHist },
    });
  }, [searchParams]);

  function renderRow(props) {
    const { index, style } = props;
    const player = selectedPlayers.players[index];

    return <PlayerRow player={player} index={index + 1} style={style} />;
  }

  function matchRegion(term) {
    return regions.find((r) => r.name.toLowerCase() === term.toLowerCase());
  }

  return (
    <Stack sx={{ mx: 1 }} spacing={isXs ? 1 : 2}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={regions}
        getOptionLabel={(option) => option.name}
        value={value}
        freeSolo
        onChange={(evt, newValue) => {
          const query = {
            region: [],
            terms: [],
          };
          newValue.forEach((v) => {
            if (_.isObject(v)) {
              if (v.term) {
                query.terms.push(v.name);
              } else {
                query.region.push(v.code);
              }
            } else {
              const regionMatch = matchRegion(v);
              if (regionMatch) {
                query.region.push(regionMatch.code);
              } else {
                query.terms.push(v);
              }
            }
          });

          return setSearchParams(query);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Län, Kommuner &amp; Spelare"
            placeholder="Kommun, Län, Spelare"
            variant="standard"
          />
        )}
      />
      {selectedPlayers.stats && selectedPlayers.stats.hist && (
        <React.Fragment>
          <Box
            elevation={2}
            sx={{
              mt: 2,
              height: {
                xs: 100,
                sm: 200,
              },
              mb: 1,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                barCategoryGap={isXs ? 0 : 1}
                data={selectedPlayers.stats.hist}
              >
                {Object.keys(divisions).map((d, idx) => (
                  <XAxis
                    dataKey={(r) => `Rating ${r.label}`}
                    xAxisId={idx}
                    hide
                  />
                ))}
                {Object.keys(divisions).map((d, idx) => (
                  <Bar
                    dataKey={d}
                    fill={divisions[d].color}
                    xAxisId={idx}
                    fillOpacity={1}
                  />
                ))}
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </React.Fragment>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(divisions).map((d, idx) => {
          const div = divisions[d];
          return (
            <Box
              sx={{
                m: 0.2,
                display: "flex",
                alignItems: "center",
                fontSize: {
                  xs: "0.6rem",
                  sm: "0.7rem",
                },
                mr: 1,
              }}
            >
              <Box
                sx={{
                  borderRadius: "5px",
                  display: "inline-flex",
                  m: 0.3,
                  height: "10px",
                  width: "10px",
                  bgcolor: div.color,
                  mr: {
                    xs: 0.5,
                    sm: 1,
                  },
                }}
              ></Box>
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "column",
                  alignItems: "center",
                }}
              >
                <Box>{div.name}</Box>
                <Box
                  sx={{
                    color: "text.disabled",
                  }}
                >
                  {div.cond}
                  {div.limit}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box height={1000}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={50}
              itemCount={selectedPlayers.players.length}
              overscanCount={20}
            >
              {renderRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    </Stack>
  );
}
