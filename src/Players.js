import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { playerList, regions } from "./data";
import React from "react";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import Grid from "@mui/material/Grid";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import _ from "lodash";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import PlayerRow from "./PlayerRow";

export default function Players() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPlayers, setSelectedPlayers] = useState(playerList);
  const selectedRegions = searchParams.getAll("region");
  const selectedTerms = searchParams.getAll("terms");
  const selectedOptions = regions.filter((region) =>
    selectedRegions.includes(region.code)
  );
  const value = [
    ...selectedOptions,
    ...selectedTerms.map((t) => ({ term: true, name: t })),
  ];

  console.log("selected terms", selectedTerms);
  console.log("selected regions", selectedRegions);

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
    console.log("do");
    setSelectedPlayers(
      _.orderBy(
        filterByTerms(
          selectedTerms,
          filterByRegion(selectedRegions, playerList)
        ),
        "stats[0].rating",
        ["desc"]
      )
    );
  }, [searchParams]);

  function renderRow(props) {
    const { index, style } = props;
    const player = selectedPlayers[index];

    return <PlayerRow player={player} index={index + 1} style={style} />;
  }

  function matchRegion(term) {
    return regions.find((r) => r.name.toLowerCase() === term.toLowerCase());
  }

  console.log("render");
  return (
    <Box sx={{ flexGrow: 1 }} sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
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

          <Box flex={1} height={1000}>
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  width={width}
                  itemSize={50}
                  itemCount={selectedPlayers.length}
                  overscanCount={20}
                >
                  {renderRow}
                </FixedSizeList>
              )}
            </AutoSizer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
