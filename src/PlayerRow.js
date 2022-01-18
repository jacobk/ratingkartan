import React from "react";
import { Box } from "@mui/system";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { Divider } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getDivision } from "./data";
import { useSearchParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

function getDiffIcon(value) {
  if (value < 0) {
    return <ArrowDropDownIcon fontSize="small" />;
  }
  if (value > 0) {
    return <ArrowDropUpIcon fontSize="small" />;
  }
}

function Diff({ value, color }) {
  return value ? (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        fontWeight: "normal",
        color,
      }}
    >
      <Box
        sx={{
          display: "inline",
          mr: "-3px",
        }}
      >
        {value || 0}
      </Box>
      {getDiffIcon(value)}{" "}
    </Box>
  ) : (
    ""
  );
}

const StatBox = ({ stat, diff, variant, sx, onClick }) => {
  const isRating = variant === "rating";
  return (
    <Paper
      onClick={() => onClick && onClick(stat)}
      elevation={isRating ? 1 : 0}
      sx={{
        flex: {
          xs: "0 0 18",
          sm: "1",
        },
        height: {
          xs: 18,
          sm: 30,
        },
        fontSize: {
          xs: "12px",
          sm: "14px",
        },
        width: {
          xs: 100,
          sm: 100,
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        verticalAlign: "middle",
        px: {
          xs: 0.5,
          sm: 1,
        },
        mb: "2px",
        mr: {
          xs: 0.5,
          sm: 0,
        },
        borderRadius: 0.5,
        fontFamily: "monospace",
        fontWeight: "bold",
        color: { rating: "white", ranking: "initial" }[variant],
        bgcolor: isRating ? getDivision(stat).color : "initial",
        cursor: onClick ? "pointer" : "initial",
        ...sx,
      }}
    >
      <Box>{stat}</Box>{" "}
      <Diff value={diff} color={isRating ? "white" : "text.secondary"} />
    </Paper>
  );
};

function PlayerRow({
  index,
  style,

  position,
  tie,
  name,
  pdgaNumber,
  rating,
  mom,
  ranking,
  rankingTie,
  rankingMom,
  county,
  countyCode,
  municipality,
}) {
  const ratingMom = mom ? mom.rating : "";
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <Box
      component="li"
      sx={{
        display: "flex",
        height: 50,
        backgroundColor: {
          sm: index % 2 === 0 && "#f5f5f5",
        },
      }}
      style={style}
    >
      <Box
        sx={{
          display: "flex",
          flex: "0 1 0",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 30,
            height: 30,
            bgcolor: "primary.main",
            color: (theme) => theme.palette.primary.contrastText,
            mx: 1,
            fontSize: {
              1: "14px",
              2: "14px",
              3: "12px",
              4: "9px",
            }[index.toString().length],
            borderRadius: 1,
          }}
        >
          {tie ? "T" : ""}
          {position}
        </Box>
      </Box>
      <Divider variant="middle" orientation="vertical" flexItem />
      <Box flex="3 1 0" sx={{ minWidth: 0, ml: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            mr: 1,
            height: 27,
            alignItems: "flex-end",
            justifyContent: "space-between",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              fontSize: "18px",
              color: "text.primary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </Box>
          <Box
            sx={{
              fontSize: "",
            }}
          >
            <Link
              href={`https://www.pdga.com/player/${pdgaNumber}`}
              variant="body2"
            >
              #{pdgaNumber}
            </Link>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flex: "1 0 0",
            alignItems: "flex-start",
            pr: 1,
            minWidth: 0,
            color: "text.secondary",
            height: 23,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontSize: "12px",
          }}
        >
          <Link component={RouterLink} to={`/stats/${countyCode}`}>
            {municipality}, {county}
          </Link>
        </Box>
      </Box>
      <Divider
        variant="middle"
        orientation="vertical"
        flexItem
        sx={{
          mr: 1,
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: {
            sm: "center",
          },
          justifyContent: {
            xs: "center",
            sm: "center",
          },
          flex: {
            xs: "0 1 0",
            sm: "0 0 200px",
            md: "0 0 400px",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <StatBox
          stat={rating}
          diff={ratingMom}
          variant="rating"
          onClick={(rating) => {
            searchParams.append("terms", rating.toString());
            setSearchParams(searchParams);
          }}
        />
        <StatBox
          stat={`SE-${rankingTie ? "T" : ""}${ranking}`}
          diff={rankingMom}
          variant="ranking"
          sx={{
            mx: {
              sm: 1,
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default React.memo(PlayerRow);
