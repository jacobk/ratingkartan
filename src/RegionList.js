import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import coatOfArms from "./CoatOfArms";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { useEffect } from "react";
import { Chip, Typography } from "@mui/material";
import SupervisedUserCircleRoundedIcon from "@mui/icons-material/SupervisedUserCircleRounded";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import AdjustIcon from "@mui/icons-material/Adjust";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import { grey } from "@mui/material/colors";
import { Link as RouterLink } from "react-router-dom";
import { getStats, getName } from "./data";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: "center",
  color: theme.palette.text.secondary,
}));

function StatsChip({ field, sortModel, icon, value, onClick }) {
  const active = field === sortModel;
  return (
    <Grid item xs={12} md={6}>
      <Grid
        container
        spacing={0}
        sx={{
          bgcolor: active ? grey[200] : "default",
          px: 1,
        }}
        onClick={onClick}
      >
        <Grid item xs={6}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: "bold",
              // color: active ? "primary.contrastText" : "default",
            }}
          >
            {sortModels[field]}:
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="body"
            sx={{
              fontWeight: active ? "bold" : "",
              // color: active ? "primary.contrastText" : "default",
            }}
          >
            {value}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

const sortModels = {
  mean: "Medel",
  median: "Median",
  max: "Max",
  min: "Min",
  stddev: "Std Dev",
  count: "Antal",
};

const sortData = (regionData, sortModel) => {
  const copy = regionData.concat();
  return copy.sort((a, b) => {
    return getStats(b)[sortModel] - getStats(a)[sortModel];
  });
};

export default function RegionTable({
  title,
  regionData,
  regionsWithoutPlayers,
  sortModel,
  onSortModelChanged,
  regionLink,
}) {
  const [sortedCounties, setSortedCounties] = useState([]);
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  const handleClick = (field) => {
    onSortModelChanged(field);
    popupState.close();
  };

  useEffect(() => {
    console.log("Sorting");

    setSortedCounties(sortData(regionData, sortModel));
  }, [sortModel, regionData]);

  return (
    <div style={{ height: 800, width: "100%" }}>
      <List sx={{ width: "100%", bgcolor: "background.paper" }} dense>
        <ListItem alignItems="flex-start">
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Item elevation={0}>
                <Typography variant="button">{title}</Typography>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                disableElevation
                {...bindTrigger(popupState)}
                endIcon={<KeyboardArrowDownIcon />}
                fullWidth
              >
                {sortModels[sortModel]}
              </Button>
              <Menu {...bindMenu(popupState)}>
                {Object.keys(sortModels).map((field) => (
                  <MenuItem onClick={() => handleClick(field)} disableRipple>
                    {sortModels[field]}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </ListItem>
        {sortedCounties.map((region) => {
          return (
            <React.Fragment>
              <ListItem alignItems="flex-start" key={region.code}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <Item elevation={0}>
                      <img
                        alt={getName(region.code)}
                        src={coatOfArms(region.code)}
                        style={{ width: 40 }}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={4}>
                    <Item elevation={0}>
                      {regionLink ? (
                        <RouterLink to={regionLink(region.code)}>
                          {getName(region.code)}
                        </RouterLink>
                      ) : (
                        getName(region.code)
                      )}
                    </Item>
                  </Grid>
                  <Grid item xs={6}>
                    <Item elevation={0}>
                      <Grid container spacing={1}>
                        <StatsChip
                          icon={<TimelapseIcon />}
                          value={getStats(region).mean.toFixed(2)}
                          sortModel={sortModel}
                          field="mean"
                          onClick={() => onSortModelChanged("mean")}
                        />
                        <StatsChip
                          icon={<TimelapseIcon />}
                          value={getStats(region).stddev.toFixed()}
                          sortModel={sortModel}
                          icon={<SwapHorizontalCircleIcon />}
                          field="stddev"
                          onClick={() => onSortModelChanged("stddev")}
                        />

                        <StatsChip
                          value={getStats(region).median}
                          sortModel={sortModel}
                          icon={<AdjustIcon />}
                          field="median"
                          onClick={() => onSortModelChanged("median")}
                        />

                        <StatsChip
                          field="count"
                          value={getStats(region).count}
                          icon={<SupervisedUserCircleRoundedIcon />}
                          sortModel={sortModel}
                          onClick={() => onSortModelChanged("count")}
                        />

                        <StatsChip
                          field="max"
                          value={getStats(region).max}
                          icon={<ArrowCircleUpIcon />}
                          sortModel={sortModel}
                          onClick={() => onSortModelChanged("max")}
                        />

                        <StatsChip
                          field="min"
                          value={getStats(region).min}
                          icon={<ArrowCircleDownIcon />}
                          sortModel={sortModel}
                          onClick={() => onSortModelChanged("min")}
                        />
                      </Grid>
                    </Item>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider variant="fullWidth" component="li" />
            </React.Fragment>
          );
        })}
        <ListItem alignItems="flex-start">
          Inga spelare:{" "}
          {regionsWithoutPlayers.map((r) => getName(r.code)).join(", ")}
        </ListItem>
      </List>
    </div>
  );
}
