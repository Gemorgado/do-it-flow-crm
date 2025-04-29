
import { Location } from "@/types";
import { privateRooms } from "./privateRooms";
import { meetingRooms } from "./meetingRooms";
import { workstations, firstFloorWorkstations, secondFloorWorkstations, otherWorkstations } from "./workstations";
import { otherSpaces } from "./otherSpaces";

// Combinação de todos os espaços
export const locations: Location[] = [
  ...privateRooms,
  ...meetingRooms,
  ...workstations,
  ...otherSpaces
];

// Exportar todos os arrays individuais para uso em outros lugares do código
export {
  privateRooms,
  meetingRooms,
  workstations,
  firstFloorWorkstations,
  secondFloorWorkstations,
  otherWorkstations,
  otherSpaces
};
