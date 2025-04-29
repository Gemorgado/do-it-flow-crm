
import { Location } from "@/types";
import { firstFloorRooms } from "./privateRooms/firstFloorRooms";
import { secondFloorRooms } from "./privateRooms/secondFloorRooms";
import { thirdFloorRooms } from "./privateRooms/thirdFloorRooms";

// Salas privativas - Combined from all floors
export const privateRooms: Location[] = [
  ...firstFloorRooms,
  ...secondFloorRooms,
  ...thirdFloorRooms
];
