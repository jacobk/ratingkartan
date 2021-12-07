import PlayerRow from "./PlayerRow";
import { playerList } from "./data";
import { Stack } from "@mui/material";

export default function Dump() {
  return (
    <Stack>
      <PlayerRow player={playerList[0]} index={8888} />
      <PlayerRow player={playerList[13]} index={889} />
      <PlayerRow player={playerList[100]} index={88} />
      <PlayerRow player={playerList[1]} index={9} />
    </Stack>
  );
}
