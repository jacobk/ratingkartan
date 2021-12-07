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

const Item = styled(Box)({
  height: 50,
  display: "flex",
  paddingBottom: "8px",
});

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
    <Item component="li" display="flex" justifyContent="stretch" style={style}>
      <Box
        display="flex"
        flex="0 1 0"
        // flex="0 0 100px"
        // sx={{ bgcolor: "red" }}
        alignItems="center"
      >
        <Box
          display="flex"
          //   alignContent="center"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 30,
            height: 30,
            bgcolor: "primary.main",
            color: (theme) => theme.palette.primary.contrastText,
            mx: 1,
            // px: 1,
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
              //   display: "flex",
              //   flex: 1,
              //   // bgcolor: "pink",
              //   alignItems: "flex-end",
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
          flex="1 0 0"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            pr: 1,
            minWidth: 0,
            color: "text.secondary",
          }}
          height={23}
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          fontSize="12px"
        >
          <Link href={`/stats/${countyCode}`}>
            {municipality}, {county}
          </Link>
        </Box>
      </Box>
      <Divider variant="middle" orientation="vertical" flexItem />
      <Box
        sx={{
          display: "flex",
          justifyContent: {
            xs: "initial",
            md: "space-between",
          },
          flex: {
            xs: "0 0 110px",
            md: "1 0 0",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            fontSize: "18px",
            ml: 1,
            height: 27,
          }}
        >
          <Box
            sx={{
              flex: 1,
              height: 18,
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              verticalAlign: "middle",
              px: 0.5,
              mb: "2px",
              borderRadius: 0.5,
              fontFamily: "monospace",
              fontWeight: "bold",
              borderWidth: 1,
              borderColor: "grey.500",
              borderStyle: "solid",
            }}
          >
            {rating} <Diff value={ratingMom} />
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: "grey",
            display: "flex",
            ml: 1,
            height: 23,
          }}
        >
          <Box
            sx={{
              flex: 1,
              height: 18,
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              verticalAlign: "middle",
              bgcolor: seYellow,
              color: seBlue,
              px: 0.5,
              borderRadius: 0.5,
              fontFamily: "monospace",
              fontWeight: "bold",
              borderWidth: 1,
              borderColor: seBlue,
              borderStyle: "solid",
            }}
          >
            S-{ranking} <Diff value={rankingMom} />
            {/* S-<span>{player}</span> */}
          </Box>
        </Box>
      </Box>
    </Item>
  );
}

export default React.memo(PlayerRow);
