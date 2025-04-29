
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
  
  // Estações de trabalho para o Andar 1 (26 estações)
  {
    id: "est-1-01",
    name: "Estação 1-01",
    type: "estacao",
    identifier: "1-01",
    available: true
  },
  {
    id: "est-1-02",
    name: "Estação 1-02",
    type: "estacao",
    identifier: "1-02",
    available: true
  },
  {
    id: "est-1-03",
    name: "Estação 1-03",
    type: "estacao",
    identifier: "1-03",
    available: true
  },
  {
    id: "est-1-04",
    name: "Estação 1-04",
    type: "estacao",
    identifier: "1-04",
    available: true
  },
  {
    id: "est-1-05",
    name: "Estação 1-05",
    type: "estacao",
    identifier: "1-05",
    available: true
  },
  {
    id: "est-1-06",
    name: "Estação 1-06",
    type: "estacao",
    identifier: "1-06",
    available: true
  },
  {
    id: "est-1-07",
    name: "Estação 1-07",
    type: "estacao",
    identifier: "1-07",
    available: true
  },
  {
    id: "est-1-08",
    name: "Estação 1-08",
    type: "estacao",
    identifier: "1-08",
    available: true
  },
  {
    id: "est-1-09",
    name: "Estação 1-09",
    type: "estacao",
    identifier: "1-09",
    available: true
  },
  {
    id: "est-1-10",
    name: "Estação 1-10",
    type: "estacao",
    identifier: "1-10",
    available: true
  },
  {
    id: "est-1-11",
    name: "Estação 1-11",
    type: "estacao",
    identifier: "1-11",
    available: true
  },
  {
    id: "est-1-12",
    name: "Estação 1-12",
    type: "estacao",
    identifier: "1-12",
    available: true
  },
  {
    id: "est-1-13",
    name: "Estação 1-13",
    type: "estacao",
    identifier: "1-13",
    available: true
  },
  {
    id: "est-1-14",
    name: "Estação 1-14",
    type: "estacao",
    identifier: "1-14",
    available: true
  },
  {
    id: "est-1-15",
    name: "Estação 1-15",
    type: "estacao",
    identifier: "1-15",
    available: true
  },
  {
    id: "est-1-16",
    name: "Estação 1-16",
    type: "estacao",
    identifier: "1-16",
    available: true
  },
  {
    id: "est-1-17",
    name: "Estação 1-17",
    type: "estacao",
    identifier: "1-17",
    available: true
  },
  {
    id: "est-1-18",
    name: "Estação 1-18",
    type: "estacao",
    identifier: "1-18",
    available: true
  },
  {
    id: "est-1-19",
    name: "Estação 1-19",
    type: "estacao",
    identifier: "1-19",
    available: true
  },
  {
    id: "est-1-20",
    name: "Estação 1-20",
    type: "estacao",
    identifier: "1-20",
    available: true
  },
  {
    id: "est-1-21",
    name: "Estação 1-21",
    type: "estacao",
    identifier: "1-21",
    available: true
  },
  {
    id: "est-1-22",
    name: "Estação 1-22",
    type: "estacao",
    identifier: "1-22",
    available: true
  },
  {
    id: "est-1-23",
    name: "Estação 1-23",
    type: "estacao",
    identifier: "1-23",
    available: true
  },
  {
    id: "est-1-24",
    name: "Estação 1-24",
    type: "estacao",
    identifier: "1-24",
    available: true
  },
  {
    id: "est-1-25",
    name: "Estação 1-25",
    type: "estacao",
    identifier: "1-25",
    available: true
  },
  {
    id: "est-1-26",
    name: "Estação 1-26",
    type: "estacao",
    identifier: "1-26",
    available: true
  },
  
  // Estações de trabalho para o Andar 2 (38 estações)
  {
    id: "est-2-01",
    name: "Estação 2-01",
    type: "estacao",
    identifier: "2-01",
    available: true
  },
  {
    id: "est-2-02",
    name: "Estação 2-02",
    type: "estacao",
    identifier: "2-02",
    available: true
  },
  {
    id: "est-2-03",
    name: "Estação 2-03",
    type: "estacao",
    identifier: "2-03",
    available: true
  },
  {
    id: "est-2-04",
    name: "Estação 2-04",
    type: "estacao",
    identifier: "2-04",
    available: true
  },
  {
    id: "est-2-05",
    name: "Estação 2-05",
    type: "estacao",
    identifier: "2-05",
    available: true
  },
  {
    id: "est-2-06",
    name: "Estação 2-06",
    type: "estacao",
    identifier: "2-06",
    available: true
  },
  {
    id: "est-2-07",
    name: "Estação 2-07",
    type: "estacao",
    identifier: "2-07",
    available: true
  },
  {
    id: "est-2-08",
    name: "Estação 2-08",
    type: "estacao",
    identifier: "2-08",
    available: true
  },
  {
    id: "est-2-09",
    name: "Estação 2-09",
    type: "estacao",
    identifier: "2-09",
    available: true
  },
  {
    id: "est-2-10",
    name: "Estação 2-10",
    type: "estacao",
    identifier: "2-10",
    available: true
  },
  {
    id: "est-2-11",
    name: "Estação 2-11",
    type: "estacao",
    identifier: "2-11",
    available: true
  },
  {
    id: "est-2-12",
    name: "Estação 2-12",
    type: "estacao",
    identifier: "2-12",
    available: true
  },
  {
    id: "est-2-13",
    name: "Estação 2-13",
    type: "estacao",
    identifier: "2-13",
    available: true
  },
  {
    id: "est-2-14",
    name: "Estação 2-14",
    type: "estacao",
    identifier: "2-14",
    available: true
  },
  {
    id: "est-2-15",
    name: "Estação 2-15",
    type: "estacao",
    identifier: "2-15",
    available: true
  },
  {
    id: "est-2-16",
    name: "Estação 2-16",
    type: "estacao",
    identifier: "2-16",
    available: true
  },
  {
    id: "est-2-17",
    name: "Estação 2-17",
    type: "estacao",
    identifier: "2-17",
    available: true
  },
  {
    id: "est-2-18",
    name: "Estação 2-18",
    type: "estacao",
    identifier: "2-18",
    available: true
  },
  {
    id: "est-2-19",
    name: "Estação 2-19",
    type: "estacao",
    identifier: "2-19",
    available: true
  },
  {
    id: "est-2-20",
    name: "Estação 2-20",
    type: "estacao",
    identifier: "2-20",
    available: true
  },
  {
    id: "est-2-21",
    name: "Estação 2-21",
    type: "estacao",
    identifier: "2-21",
    available: true
  },
  {
    id: "est-2-22",
    name: "Estação 2-22",
    type: "estacao",
    identifier: "2-22",
    available: true
  },
  {
    id: "est-2-23",
    name: "Estação 2-23",
    type: "estacao",
    identifier: "2-23",
    available: true
  },
  {
    id: "est-2-24",
    name: "Estação 2-24",
    type: "estacao",
    identifier: "2-24",
    available: true
  },
  {
    id: "est-2-25",
    name: "Estação 2-25",
    type: "estacao",
    identifier: "2-25",
    available: true
  },
  {
    id: "est-2-26",
    name: "Estação 2-26",
    type: "estacao",
    identifier: "2-26",
    available: true
  },
  {
    id: "est-2-27",
    name: "Estação 2-27",
    type: "estacao",
    identifier: "2-27",
    available: true
  },
  {
    id: "est-2-28",
    name: "Estação 2-28",
    type: "estacao",
    identifier: "2-28",
    available: true
  },
  {
    id: "est-2-29",
    name: "Estação 2-29",
    type: "estacao",
    identifier: "2-29",
    available: true
  },
  {
    id: "est-2-30",
    name: "Estação 2-30",
    type: "estacao",
    identifier: "2-30",
    available: true
  },
  {
    id: "est-2-31",
    name: "Estação 2-31",
    type: "estacao",
    identifier: "2-31",
    available: true
  },
  {
    id: "est-2-32",
    name: "Estação 2-32",
    type: "estacao",
    identifier: "2-32",
    available: true
  },
  {
    id: "est-2-33",
    name: "Estação 2-33",
    type: "estacao",
    identifier: "2-33",
    available: true
  },
  {
    id: "est-2-34",
    name: "Estação 2-34",
    type: "estacao",
    identifier: "2-34",
    available: true
  },
  {
    id: "est-2-35",
    name: "Estação 2-35",
    type: "estacao",
    identifier: "2-35",
    available: true
  },
  {
    id: "est-2-36",
    name: "Estação 2-36",
    type: "estacao",
    identifier: "2-36",
    available: true
  },
  {
    id: "est-2-37",
    name: "Estação 2-37",
    type: "estacao",
    identifier: "2-37",
    available: true
  },
  {
    id: "est-2-38",
    name: "Estação 2-38",
    type: "estacao",
    identifier: "2-38",
    available: true
  },
  
  // Mantendo as estações originais
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

