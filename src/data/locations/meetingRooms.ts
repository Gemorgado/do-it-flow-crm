
import { Location } from "@/types";

// Salas de reunião
export const meetingRooms: Location[] = [
  {
    id: "meet-1",
    name: "Meet 1",
    type: "sala_reuniao",
    identifier: "101",
    available: true,
    capacity: 11,
    area: 16
  },
  {
    id: "meet-2",
    name: "Meet 2",
    type: "sala_reuniao",
    identifier: "102",
    available: true,
    capacity: 8,
    area: 12
  },
  {
    id: "meet-3",
    name: "Meet 3",
    type: "sala_reuniao",
    identifier: "103",
    available: true,
    capacity: 4,
    area: 8
  },
  {
    id: "meet-4",
    name: "Meet 4",
    type: "sala_reuniao",
    identifier: "201",
    available: true,
    capacity: 13,
    area: 18
  },
  {
    id: "auditorio",
    name: "Auditório",
    type: "sala_reuniao",
    identifier: "301",
    available: true,
    capacity: 80,
    area: 120
  }
];
