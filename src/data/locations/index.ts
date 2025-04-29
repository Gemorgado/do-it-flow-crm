
import { Location } from "@/types";
import { privateRooms } from "./privateRooms";
import { meetingRooms } from "./meetingRooms";
import { workstations, firstFloorWorkstations, secondFloorWorkstations } from "./workstations";

// Combinação de todos os espaços
export const locations: Location[] = [
  ...privateRooms,
  ...meetingRooms,
  ...workstations
];

// Exportar todos os arrays individuais para uso em outros lugares do código
export {
  privateRooms,
  meetingRooms,
  workstations,
  firstFloorWorkstations,
  secondFloorWorkstations
};
