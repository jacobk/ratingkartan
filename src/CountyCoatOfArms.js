import CoA01 from "./images/vapen/01.svg";
import CoA04 from "./images/vapen/04.svg";
import CoA06 from "./images/vapen/06.svg";
import CoA08 from "./images/vapen/08.svg";
import CoA10 from "./images/vapen/10.svg";
import CoA13 from "./images/vapen/13.svg";
import CoA17 from "./images/vapen/17.svg";
import CoA19 from "./images/vapen/19.svg";
import CoA21 from "./images/vapen/21.svg";
import CoA23 from "./images/vapen/23.svg";
import CoA25 from "./images/vapen/25.svg";
import CoA03 from "./images/vapen/03.svg";
import CoA05 from "./images/vapen/05.svg";
import CoA07 from "./images/vapen/07.svg";
import CoA09 from "./images/vapen/09.svg";
import CoA12 from "./images/vapen/12.svg";
import CoA14 from "./images/vapen/14.svg";
import CoA18 from "./images/vapen/18.svg";
import CoA20 from "./images/vapen/20.svg";
import CoA22 from "./images/vapen/22.svg";
import CoA24 from "./images/vapen/24.svg";

const mapping = {
  "01": CoA01,
  "04": CoA04,
  "06": CoA06,
  "08": CoA08,
  10: CoA10,
  13: CoA13,
  17: CoA17,
  19: CoA19,
  21: CoA21,
  23: CoA23,
  25: CoA25,
  "03": CoA03,
  "05": CoA05,
  "07": CoA07,
  "09": CoA09,
  12: CoA12,
  14: CoA14,
  18: CoA18,
  20: CoA20,
  22: CoA22,
  24: CoA24,
};

export default (countyCode) => mapping[countyCode];
