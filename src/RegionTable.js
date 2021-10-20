import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// "count": 106,
// "mean": 878.3301886792453,
// "median": 887.5,
// "stddev": 74.33297367545642,
// "max": 988,
// "min": 551,
// "hist": [

const oneDecimal = (params) => params.value.toFixed(2);

function buildColumns(county, isSmallScreen) {
  return [
    {
      field: "name",
      headerName: county ? "Län" : "Kommun",
      width: 160,
      // flex: 0.5,
    },
    {
      field: "mean",
      headerName: "Medel",
      width: 100,
      type: "number",
      valueFormatter: oneDecimal,
      // flex: 0.4,
    },
    {
      field: "stddev",
      headerName: "Medel",
      type: "number",
      width: 90,
      valueFormatter: oneDecimal,
      // flex: 0.3,
      hide: isSmallScreen ? true : false,
    },
    {
      field: "median",
      headerName: "Median",
      type: "number",
      // valueFormatter: (params) => params.value,
      // flex: 0.3,
      hide: isSmallScreen ? true : false,
    },
    {
      field: "max",
      headerName: "Max",
      type: "number",
      // flex: 0.2,
      hide: isSmallScreen ? true : false,
    },
    {
      field: "ratingDistribution",
      headerName: "Fördelning",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      // flex: 0.4,
    },
  ];
}

const foo = buildColumns(true, false);

export default function RegionTable({ regionData }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [sortModel, setSortModel] = useState([{ field: "mean", sort: "desc" }]);
  // const [rows] = useState(
  //   regionData.map(({ name, stats }, idx) => {
  //     console.log("Mapping data");
  //     return {
  //       id: idx,
  //       name,
  //       ...stats,
  //     };
  //   })
  // );
  // console.log(rows);

  return (
    <div style={{ height: 800, width: "100%" }}>
      <DataGrid
        sortModel={sortModel}
        onSortModelChange={(model) => {
          console.log("onSortModelChange", model);
          setSortModel(model);
        }}
        // onSortModelChange={(model) =>
        //   setTimeout(() => {
        //     console.log("onSortModelChange", model);
        //     setSortModel(model);
        //   }, 1000)
        // }
        sortingOrder={["desc", "asc", null]}
        rows={regionData}
        columns={foo}
        // columns={buildColumns(true, isSmallScreen)}
        pageSize={25}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        density="compact"
        disableColumnMenu
        // components={{
        //   Toolbar: GridToolbar,
        // }}
      />
    </div>
  );
}
