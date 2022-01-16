import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { playerList, regions, divisions } from "./data";
import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { List, WindowScroller, AutoSizer } from "react-virtualized";
import _ from "lodash";
import PlayerRow from "./PlayerRow";
import { bin } from "d3-array";
import { range } from "d3-array";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@mui/material/styles";
import "react-virtualized/styles.css";
import ReactGA from "react-ga4";

const ratingQueryPattern = /^(\d{3,4})(?:-(\d{3,4}))?$/;

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

  const filterByRegion = (regions, players) =>
    regions.length === 0
      ? players
      : players.filter((p) =>
          selectedRegions.some((r) =>
            [p.municipalityCode, p.countyCode].includes(r)
          )
        );

  const filterByTerms = (terms, players) => {
    return terms.length === 0
      ? players
      : players.filter((p) =>
          terms.some((t) => {
            const match = t.match(ratingQueryPattern);
            if (match) {
              const b1 = parseInt(match[1], 10);
              const b2 = parseInt(match[2], 10);
              const currentRating = p.stats[0].rating;
              if (isNaN(b2)) {
                return currentRating === b1;
              } else if (b2 < b1) {
                return true;
              } else {
                return currentRating >= b1 && currentRating <= b2;
              }
            } else {
              return p.name.toLowerCase().includes(t.toLowerCase());
            }
          })
        );
  };

  useEffect(() => {
    ReactGA.event("search", { selectedRegions, selectedTerms });
    const sortedPlayers = _.orderBy(
      filterByTerms(selectedTerms, filterByRegion(selectedRegions, playerList)),
      ["stats[0].rating", "pdgaNumber"],
      ["desc", "desc"]
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
        label: `${bin.x0}-${bin.x1 - 1}`,
        x0: bin.x0,
        x1: bin.x1 - 1,
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

    sortedPlayers.forEach((player, idx) => {
      const prevPlayer = sortedPlayers[idx - 1];
      if (idx > 0 && player.stats[0].rating === prevPlayer.stats[0].rating) {
        prevPlayer._tie = true;
        player._tie = true;
        player._position = prevPlayer._position;
      } else {
        player._position = idx + 1;
        player._tie = false;
      }
    });

    setSelectedPlayers({
      players: sortedPlayers,
      stats: { hist, momHist },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function renderRow(props) {
    const { index, style, key } = props;
    const player = selectedPlayers.players[index];
    const { name, pdgaNumber, stats, county, countyCode, municipality } =
      player;
    const rating = stats[0].rating;
    const mom = stats[0].mom;

    const ranking = stats[0].ranking;
    const rankingTie = stats[0].tie;
    const rankingMom = mom ? mom.ranking : "";

    return (
      <PlayerRow
        key={key}
        index={index + 1}
        position={player._position}
        tie={player._tie}
        style={style}
        name={name}
        pdgaNumber={pdgaNumber}
        rating={rating}
        mom={mom}
        ranking={ranking}
        rankingTie={rankingTie}
        rankingMom={rankingMom}
        county={county}
        countyCode={countyCode}
        municipality={municipality}
      />
    );
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
            label="Sök efter Län, Kommuner, Spelare &amp;  Rating"
            placeholder="Kommun, Län, Spelare, Rating"
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
                <Tooltip />
                {Object.keys(divisions).map((d, idx) => (
                  <XAxis
                    key={idx}
                    dataKey={(r) => `Rating ${r.label}`}
                    xAxisId={idx}
                    hide
                  />
                ))}
                {Object.keys(divisions).map((d, idx) => (
                  <Bar
                    cursor="pointer"
                    key={idx}
                    dataKey={d}
                    fill={divisions[d].color}
                    xAxisId={idx}
                    fillOpacity={1}
                    onClick={(data, idx) => {
                      searchParams.append("terms", data.label);
                      setSearchParams(searchParams);
                    }}
                  />
                ))}
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
              key={idx}
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
                  {div.prefix && div.cond}
                  {div.limit}
                  {!div.prefix && div.cond}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box>
        <AutoSizer disableHeight>
          {({ width }) => (
            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  rowCount={selectedPlayers.players.length}
                  rowHeight={50}
                  rowRenderer={renderRow}
                  scrollTop={scrollTop}
                  width={width}
                />
              )}
            </WindowScroller>
          )}
        </AutoSizer>
      </Box>
    </Stack>
  );
}
