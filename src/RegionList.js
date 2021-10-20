import React, { useState } from "react";
import { useTheme, styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import coatOfArms from "./CountyCoatOfArms";
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
import { Avatar, Chip, Typography } from "@mui/material";
import SupervisedUserCircleRoundedIcon from "@mui/icons-material/SupervisedUserCircleRounded";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import AdjustIcon from "@mui/icons-material/Adjust";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import InsightsIcon from "@mui/icons-material/Insights";
import { grey } from "@mui/material/colors";

// "count": 106,
// "mean": 878.3301886792453,
// "median": 887.5,
// "stddev": 74.33297367545642,
// "max": 988,
// "min": 551,
// "hist": [

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StatChip = styled(Chip)(({ theme }) => ({
  margin: 1,
}));

function StatsChipOld({ field, sortModel, icon, value, onClick }) {
  const active = field === sortModel;
  return (
    <StatChip
      variant={!active && "outlined"}
      {...(active && { color: "primary" })}
      size="small"
      icon={icon}
      label={value}
      onClick={onClick}
    />
  );
}

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

    // <StatChip
    //   variant={!active && "outlined"}
    //   {...(active && { color: "primary" })}
    //   size="small"
    //   icon={icon}
    //   label={value}
    //   onClick={onClick}
    // />
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
  console.log("Sorting", sortModel);
  const copy = regionData.concat();
  return copy.sort((a, b) => b.stats[sortModel] - a.stats[sortModel]);
};

export default function RegionTable({
  regionData,
  sortModel,
  onSortModelChanged,
}) {
  const [sortedCounties, setSortedCounties] = useState([]);
  // const [sortModel, setSortModel] = useState("mean");
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  const handleClick = (field) => {
    onSortModelChanged(field);
    popupState.close();
  };

  useEffect(() => {
    console.log("Sorting", sortData(regionData, sortModel));

    setSortedCounties(sortData(regionData, sortModel));
  }, [sortModel]);

  return (
    <div style={{ height: 800, width: "100%" }}>
      <List sx={{ width: "100%", bgcolor: "background.paper" }} dense>
        <ListItem alignItems="flex-start">
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Item elevation={0}>Län </Item>
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
              <ListItem alignItems="flex-start">
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <img
                      alt="Remy Sharp"
                      src={coatOfArms(region.code)}
                      style={{ width: 40 }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Item elevation={0}>{region.name}</Item>
                  </Grid>
                  <Grid item xs={6}>
                    <Item elevation={0}>
                      <Grid container spacing={1}>
                        <StatsChip
                          icon={<TimelapseIcon />}
                          value={region.stats.mean.toFixed(2)}
                          sortModel={sortModel}
                          field="mean"
                          onClick={() => onSortModelChanged("mean")}
                        />
                        <StatsChip
                          icon={<TimelapseIcon />}
                          value={region.stats.stddev.toFixed()}
                          sortModel={sortModel}
                          icon={<SwapHorizontalCircleIcon />}
                          field="stddev"
                          onClick={() => onSortModelChanged("stddev")}
                        />

                        <StatsChip
                          value={region.stats.median}
                          sortModel={sortModel}
                          icon={<AdjustIcon />}
                          field="median"
                          onClick={() => onSortModelChanged("median")}
                        />

                        <StatsChip
                          field="count"
                          value={region.stats.count}
                          icon={<SupervisedUserCircleRoundedIcon />}
                          sortModel={sortModel}
                          onClick={() => onSortModelChanged("count")}
                        />

                        <StatsChip
                          field="max"
                          value={region.stats.max}
                          icon={<ArrowCircleUpIcon />}
                          sortModel={sortModel}
                          onClick={() => onSortModelChanged("max")}
                        />

                        <StatsChip
                          field="min"
                          value={region.stats.min}
                          icon={<ArrowCircleDownIcon />}
                          sortModel={sortModel}
                          onClick={() => onSortModelChanged("min")}
                        />
                      </Grid>
                    </Item>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
}
