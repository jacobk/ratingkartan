import React from "react";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/styles";
import { Box, fontSize } from "@mui/system";
import Link from "@mui/material/Link";
import { Divider } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const seBlue = "#00599c";
const seYellow = "#f2ce1b";

function getDiffIcon(value) {
  if (value < 0) {
    return <ArrowDropDownIcon color="error" fontSize="small" />;
  }
  if (value > 0) {
    return <ArrowDropUpIcon color="success" fontSize="small" />;
  }
}

function Diff({ value }) {
  return value ? (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        fontWeight: "normal",
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

const StatBox = ({ stat, diff, variant, sx }) => (
  <Box
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
        xs: 90,
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
      borderWidth: 1,
      borderColor: { rating: "grey.500", ranking: seBlue }[variant],
      borderStyle: "solid",
      color: { rating: "initial", ranking: seBlue }[variant],
      backgroundColor: { rating: "white", ranking: seYellow }[variant],
      ...sx,
    }}
  >
    {stat} <Diff value={diff} />
  </Box>
);

function PlayerRow({ index, player, style }) {
  const {
    name,
    pdgaNumber,
    stats,
    county,
    countyCode,
    municipality,
    municipalityCode,
  } = player;

  const rating = stats[0].rating;
  const mom = stats[0].mom;
  const ratingMom = mom ? mom.rating : "-";
  const ranking = stats[0].ranking;
  const rankingMom = mom ? mom.ranking : "-";

  return (
    <Box
      component="li"
      sx={{
        display: "flex",
        height: 50,
        // bgcolor: (theme) => index % 2 === 0 && theme.palette.grey["100"],
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
              1: "16px",
              2: "16px",
              3: "14px",
              4: "9px",
            }[index.toString().length],
            borderRadius: 1,
          }}
        >
          {index}
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
              minWidth: 0,
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
          <Link href={`/stats/${countyCode}`}>
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
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <StatBox stat={rating} diff={ratingMom} variant="rating" />
        <StatBox
          stat={`S-${ranking}`}
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
