const projectionConfig = {
  scale: 1000,
  center: [2.3, 63.3],
  rotate: [-12, 1, 0],
};
const greenColorScale = [
  "#f7fcfd",
  "#e5f5f9",
  "#ccece6",
  "#99d8c9",
  "#66c2a4",
  "#41ae76",
  "#238b45",
  "#006d2c",
  "#00441b",
];

const redColorScale = [
  "#ffedea",
  "#ffcec5",
  "#ffad9f",
  "#ff8a75",
  "#ff5533",
  "#e2492d",
  "#be3d26",
  "#9a311f",
  "#782618",
];

const colorScale3 = [
  "#f0f9e8",
  "#b6e3bb",
  "#75c8c5",
  "#4ba8c9",
  "#2989bd",
  "#0a6aad",
  "#254b8c",
];

const projection = geoTransverseMercator();
console.log(projection);

function calcHue(value, min, max) {
  // [min-bin*1, (min+bin*2)-bin*2, ]
  const binSize = (max - min) / greenColorScale.length;
  const bin = Math.floor((value - min) / binSize);
  console.log("value", value, "-", binSize, bin, (value - min) / binSize);
  return greenColorScale[bin];
}

const colorScale2 = (stat) => {
  const defaultScale = scaleQuantile()
    .domain(_.map(statsByMunicpipality, `stats.${stat}`))
    .range(colorScale3);
  const ratingScale = scaleThreshold()
    .domain([700, 800, 900, 1000, 1010, 1020, 1030])
    .range(colorScale3);
  const scales = {
    mean: defaultScale,
    max: ratingScale,
    min: scaleThreshold()
      .domain([50, 200, 400, 500, 600, 700, 800])
      .range(colorScale3),
    count: scaleThreshold()
      .domain([10, 50, 100, 200, 300, 500])
      .range(colorScale3),
  };
  return scales[stat] || defaultScale;
};

export default function Map({ geoData, selectedStat }) {
  return (
    <ComposableMap
      projection="geoTransverseMercator"
      projectionConfig={projectionConfig}
      style={{ width: "100%", height: 400 }}
      width={100}
      height={250}
    >
      <Geographies geography={geoData} stroke="#FFFFFF" strokeWidth={0.5}>
        {({ geographies }) =>
          geographies.map((geo) => {
            // const data = municipalityStats[geo.properties.KnKod];
            const data = statsByCounty[geo.properties.LnKod];
            console.log("---", data);
            const countyCode = geo.properties.LnKod;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                // fill={colorScale2(data.stats.mean)}
                onMouseEnter={() => {
                  if (hovered) {
                    return;
                  }
                  setHovered(true);
                  console.log(geo);
                }}
                onMouseLeave={() => {
                  setHovered(false);
                }}
                onMouseDown={() => {
                  if (selectedCountyCode && selectedCountyCode === countyCode) {
                    setSelectedCountyCode(null);
                  } else {
                    setSelectedCountyCode(countyCode);
                  }
                }}
                style={{
                  default: {
                    outline: "none",
                    fill:
                      geo.properties.LnKod === selectedCountyCode
                        ? "#DD4132"
                        : colorScale2(selectedStat)(
                            data.stats[0].stats[selectedStat]
                          ),
                  },
                  // default: {
                  //   fill:
                  //     geography.properties.CONTINENT ===
                  //     this.state.highlighted
                  //       ? "#DD4132"
                  //       : "#F0EAD6",
                  //   stroke:
                  //     geography.properties.CONTINENT ===
                  //     this.state.highlighted
                  //       ? "#9E1030"
                  //       : "#B2A27D",
                  //   strokeWidth: 0.75,
                  //   outline: "none",
                  //   transition: "all 250ms"
                  // },
                  hover: {
                    fill: "#FF6F61",
                    stroke: "#9E1030",
                    // strokeWidth: 0.75,
                    outline: "none",
                    transition: "all 250ms",
                  },
                  pressed: {
                    fill: "#DD4132",
                    stroke: "#9E1030",
                    // strokeWidth: 0.75,
                    outline: "none",
                    transition: "all 250ms",
                  },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
