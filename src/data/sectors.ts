export interface Sector {
  id: string;
  label: string;
  labelEn: string;
  color: string;
  depthRange: string;
  dataFile: string;
  order: number;
}

export const SECTORS: Sector[] = [
  {
    id: "Core",
    label: "Jádro",
    labelEn: "Core",
    color: "#E77222",
    depthRange: "6 371 – 2 900 km",
    dataFile: "core1",
    order: 0,
  },
  {
    id: "Crust",
    label: "Kůra",
    labelEn: "Crust",
    color: "#74E721",
    depthRange: "30 – 0 km",
    dataFile: "core1",
    order: 1,
  },
  {
    id: "Ocean",
    label: "Oceán",
    labelEn: "Ocean",
    color: "#73BDFA",
    depthRange: "Surface depths",
    dataFile: "core1",
    order: 2,
  },
  {
    id: "Atmosphere",
    label: "Atmosféra",
    labelEn: "Atmosphere",
    color: "#D422E7",
    depthRange: "0 – 10,000 km",
    dataFile: "core1",
    order: 3,
  },
  {
    id: "Space",
    label: "Vesmír",
    labelEn: "Space",
    color: "#73BDFA",
    depthRange: "above atmosphere",
    dataFile: "core1",
    order: 4,
  },
];

export const FUEL_PER_QUESTION = 10;
export const FUEL_BONUS = 25;
