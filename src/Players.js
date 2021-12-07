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
  const selectedOptions = regions.filter((region) =>
    selectedRegions.includes(region.code)
  );

  useEffect(() => {
    console.log("do");
    setSelectedPlayers(
      _.orderBy(
        selectedRegions.length == 0
          ? playerList
          : playerList.filter((p) =>
              selectedRegions.some((r) =>
                [p.municipalityCode, p.countyCode].includes(r)
              )
            ),
        "stats[0].rating",
        ["desc"]
      )
    );
  }, [searchParams]);

  // return <div>Spelare: {searchParams.get("region")}</div>;

  function renderRow(props) {
    const { index, style } = props;
    const player = selectedPlayers[index];

    return <PlayerRow player={player} index={index + 1} style={style} />;
  }

  function renderRowOld(props) {
    const { index, style } = props;
    const player = selectedPlayers[index];

    return (
      <React.Fragment>
        <ListItem style={style} key={index} component="div" disablePadding>
          <Grid container spacing={1} height={38}>
            <Grid item xs={2}>
              <Box display="flex" justifyContent="center">
                <Typography variant="h6" style={{ fontFamily: "monospace" }}>
                  {index + 1}.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box display="flex" justifyContent="center">
                <Typography variant="body">{player.rating}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box style={{ paddingTop: 1 }}>{player.name}</Box>
              <Box style={{ fontSize: "0.7rem", color: "#AAA" }}>
                {player.municipality}, {player.county}
              </Box>
            </Grid>
            <Grid item xs={2}>
              <a href={`https://www.pdga.com/player/${player.pdgaNumber}`}>
                #{player.pdgaNumber}
              </a>
            </Grid>
          </Grid>
        </ListItem>
      </React.Fragment>
    );
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
            value={selectedOptions}
            onChange={(evt, newValue) => {
              setSearchParams({ region: newValue.map((v) => v.code) });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Län &amp; Kommuner"
                placeholder="Kommun eller Län"
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
