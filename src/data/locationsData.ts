import { Location } from "@/types";

// Updated locations with all the requested rooms
export const locations: Location[] = [
  // Private rooms 101-107
  {
    id: "loc-101",
    name: "Sala 101",
    type: "sala_privativa",
    identifier: "101",
    available: true,
    area: 15
  },
  {
    id: "loc-102",
    name: "Sala 102",
    type: "sala_privativa",
    identifier: "102",
    available: true,
    area: 20
  },
  {
    id: "loc-103",
    name: "Sala 103",
    type: "sala_privativa",
    identifier: "103",
    available: true,
    area: 18
  },
  {
    id: "loc-104",
    name: "Sala 104",
    type: "sala_privativa",
    identifier: "104",
    available: true,
    area: 16
  },
  {
    id: "loc-105",
    name: "Sala 105",
    type: "sala_privativa",
    identifier: "105",
    available: true,
    area: 22
  },
  {
    id: "loc-106",
    name: "Sala 106",
    type: "sala_privativa",
    identifier: "106",
    available: true,
    area: 19
  },
  {
    id: "loc-107",
    name: "Sala 107",
    type: "sala_privativa",
    identifier: "107",
    available: true,
    area: 17
  },
  
  // Private rooms 201-219
  {
    id: "loc-201",
    name: "Sala 201",
    type: "sala_reuniao",
    identifier: "201",
    available: true,
    capacity: 8
  },
  {
    id: "loc-202",
    name: "Sala 202",
    type: "sala_privativa",
    identifier: "202",
    available: true,
    area: 18
  },
  {
    id: "loc-203",
    name: "Sala 203",
    type: "sala_privativa",
    identifier: "203",
    available: true,
    area: 20
  },
  {
    id: "loc-204",
    name: "Sala 204",
    type: "sala_privativa",
    identifier: "204",
    available: true,
    area: 22
  },
  {
    id: "loc-205",
    name: "Sala 205",
    type: "sala_privativa",
    identifier: "205",
    available: true,
    area: 15
  },
  {
    id: "loc-206",
    name: "Sala 206",
    type: "sala_privativa",
    identifier: "206",
    available: true,
    area: 17
  },
  {
    id: "loc-207",
    name: "Sala 207",
    type: "sala_privativa",
    identifier: "207",
    available: true,
    area: 19
  },
  {
    id: "loc-208",
    name: "Sala 208",
    type: "sala_privativa",
    identifier: "208",
    available: true,
    area: 21
  },
  {
    id: "loc-209",
    name: "Sala 209",
    type: "sala_privativa",
    identifier: "209",
    available: true,
    area: 16
  },
  {
    id: "loc-210",
    name: "Sala 210",
    type: "sala_privativa",
    identifier: "210",
    available: true,
    area: 18
  },
  {
    id: "loc-211",
    name: "Sala 211",
    type: "sala_privativa",
    identifier: "211",
    available: true,
    area: 20
  },
  {
    id: "loc-212",
    name: "Sala 212",
    type: "sala_privativa",
    identifier: "212",
    available: true,
    area: 22
  },
  {
    id: "loc-213",
    name: "Sala 213",
    type: "sala_privativa",
    identifier: "213",
    available: true,
    area: 17
  },
  {
    id: "loc-214",
    name: "Sala 214",
    type: "sala_privativa",
    identifier: "214",
    available: true,
    area: 19
  },
  {
    id: "loc-215",
    name: "Sala 215",
    type: "sala_privativa",
    identifier: "215",
    available: true,
    area: 21
  },
  {
    id: "loc-216",
    name: "Sala 216",
    type: "sala_privativa",
    identifier: "216",
    available: true,
    area: 16
  },
  {
    id: "loc-217",
    name: "Sala 217",
    type: "sala_privativa",
    identifier: "217",
    available: true,
    area: 18
  },
  {
    id: "loc-219",
    name: "Sala 219",
    type: "sala_privativa",
    identifier: "219",
    available: true,
    area: 20
  },
  
  // Private rooms 301-310
  {
    id: "loc-301",
    name: "Sala 301",
    type: "sala_privativa",
    identifier: "301",
    available: true,
    area: 22
  },
  {
    id: "loc-302",
    name: "Sala 302",
    type: "sala_privativa",
    identifier: "302",
    available: true,
    area: 18
  },
  {
    id: "loc-303",
    name: "Sala 303",
    type: "sala_privativa",
    identifier: "303",
    available: true,
    area: 20
  },
  {
    id: "loc-304",
    name: "Sala 304",
    type: "sala_privativa",
    identifier: "304",
    available: true,
    area: 16
  },
  {
    id: "loc-305",
    name: "Sala 305",
    type: "sala_privativa",
    identifier: "305",
    available: true,
    area: 18
  },
  {
    id: "loc-306",
    name: "Sala 306",
    type: "sala_privativa",
    identifier: "306",
    available: true,
    area: 22
  },
  {
    id: "loc-308",
    name: "Sala 308",
    type: "sala_privativa",
    identifier: "308",
    available: true,
    area: 20
  },
  {
    id: "loc-309",
    name: "Sala 309",
    type: "sala_privativa",
    identifier: "309",
    available: true,
    area: 18
  },
  {
    id: "loc-310",
    name: "Sala 310",
    type: "sala_privativa",
    identifier: "310",
    available: true,
    area: 16
  },
  
  // Keep existing stations
  {
    id: "est-01",
    name: "Estação 01",
    type: "estacao",
    identifier: "01",
    available: false
  },
  {
    id: "est-02",
    name: "Estação 02",
    type: "estacao",
    identifier: "02",
    available: false
  },
  {
    id: "est-03",
    name: "Estação 03",
    type: "estacao",
    identifier: "03",
    available: true
  },
  {
    id: "end-fiscal",
    name: "Endereço Fiscal",
    type: "endereco_fiscal",
    identifier: "EF-001",
    available: true
  }
];
