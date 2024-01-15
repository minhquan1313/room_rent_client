import logger from "@/utils/logger";

/* eslint-disable  */
const valueFromGeocoderDotGeocode = [
  {
    address_components: [
      {
        long_name: "64/5",
        short_name: "64/5",
        types: ["street_number"],
      },
      {
        long_name: "Tổ 18 KP1",
        short_name: "Tổ 18 KP1",
        types: ["route"],
      },
      {
        long_name: "Quận 12",
        short_name: "Quận 12",
        types: ["administrative_area_level_2", "political"],
      },
      {
        long_name: "Thành phố Hồ Chí Minh",
        short_name: "Thành phố Hồ Chí Minh",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address:
      "64/5 Tổ 18 KP1, Tân Thới Hiệp, Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
    geometry: {
      location: {
        lat: 10.862214,
        lng: 106.635082,
      },
      location_type: "ROOFTOP",
      viewport: {
        south: 10.8608650197085,
        west: 106.6337330197085,
        north: 10.8635629802915,
        east: 106.6364309802915,
      },
    },
    place_id: "ChIJU9ayivMpdTERbdGpDj5H_yM",
    plus_code: {
      compound_code: "VJ6P+V2 Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
      global_code: "7P28VJ6P+V2",
    },
    types: ["street_address"],
  },
  {
    address_components: [
      {
        long_name: "59",
        short_name: "59",
        types: ["street_number"],
      },
      {
        long_name: "Đường TTH21",
        short_name: "Đ. TTH21",
        types: ["route"],
      },
      {
        long_name: "Quận 12",
        short_name: "Quận 12",
        types: ["administrative_area_level_2", "political"],
      },
      {
        long_name: "Thành phố Hồ Chí Minh",
        short_name: "Thành phố Hồ Chí Minh",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address:
      "59 Đ. TTH21, Tân Thới Hiệp, Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
    geometry: {
      bounds: {
        south: 10.862014,
        west: 106.6350684,
        north: 10.8621466,
        east: 106.6351886,
      },
      location: {
        lat: 10.862075,
        lng: 106.6351286,
      },
      location_type: "ROOFTOP",
      viewport: {
        south: 10.8607313197085,
        west: 106.6337795197085,
        north: 10.8634292802915,
        east: 106.6364774802915,
      },
    },
    place_id: "ChIJkfLtivMpdTERr_FB3kyIjUE",
    types: ["premise"],
  },
  {
    address_components: [
      {
        long_name: "395",
        short_name: "395",
        types: ["subpremise"],
      },
      {
        long_name: "115",
        short_name: "115",
        types: ["street_number"],
      },
      {
        long_name: "Đường TTH21",
        short_name: "Đ. TTH21",
        types: ["route"],
      },
      {
        long_name: "Quận 12",
        short_name: "Quận 12",
        types: ["administrative_area_level_2", "political"],
      },
      {
        long_name: "Thành phố Hồ Chí Minh",
        short_name: "Thành phố Hồ Chí Minh",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address:
      "395, 115 Đ. TTH21, Tân Thới Hiệp, Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
    geometry: {
      location: {
        lat: 10.8619446,
        lng: 106.6350824,
      },
      location_type: "ROOFTOP",
      viewport: {
        south: 10.8605956197085,
        west: 106.6337334197085,
        north: 10.8632935802915,
        east: 106.6364313802915,
      },
    },
    place_id: "ChIJnyqqtSYpdTER1qM0EjDOqWg",
    plus_code: {
      compound_code: "VJ6P+Q2 Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
      global_code: "7P28VJ6P+Q2",
    },
    types: ["establishment", "point_of_interest"],
  },
  {
    address_components: [
      {
        long_name: "451",
        short_name: "451",
        types: ["street_number"],
      },
      {
        long_name: "Hẻm 395 Tân Thới Hiệp 21",
        short_name: "Hẻm 395 Tân Thới Hiệp 21",
        types: ["route"],
      },
      {
        long_name: "Quận 12",
        short_name: "Quận 12",
        types: ["administrative_area_level_2", "political"],
      },
      {
        long_name: "Thành phố Hồ Chí Minh",
        short_name: "Thành phố Hồ Chí Minh",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address:
      "451 Hẻm 395 Tân Thới Hiệp 21, Tân Thới Hiệp, Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
    geometry: {
      location: {
        lat: 10.8621574,
        lng: 106.6348763,
      },
      location_type: "RANGE_INTERPOLATED",
      viewport: {
        south: 10.8608084197085,
        west: 106.6335273197085,
        north: 10.8635063802915,
        east: 106.6362252802915,
      },
    },
    place_id:
      "Emg0NTEgSOG6u20gMzk1IFTDom4gVGjhu5tpIEhp4buHcCAyMSwgVMOibiBUaOG7m2kgSGnhu4dwLCBRdeG6rW4gMTIsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmlldG5hbSIbEhkKFAoSCbeT-nb0KXUxEQe18zy6wWMGEMMD",
    types: ["street_address"],
  },
  {
    address_components: [
      {
        long_name: "VJ6P+V2",
        short_name: "VJ6P+V2",
        types: ["plus_code"],
      },
      {
        long_name: "Quận 12",
        short_name: "Quận 12",
        types: ["administrative_area_level_2", "political"],
      },
      {
        long_name: "Thành phố Hồ Chí Minh",
        short_name: "Thành phố Hồ Chí Minh",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address: "VJ6P+V2 Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
    geometry: {
      bounds: {
        south: 10.862125,
        west: 106.635,
        north: 10.86225,
        east: 106.635125,
      },
      location: {
        lat: 10.8621677,
        lng: 106.635067,
      },
      location_type: "GEOMETRIC_CENTER",
      viewport: {
        south: 10.8608385197085,
        west: 106.6337135197085,
        north: 10.8635364802915,
        east: 106.6364114802915,
      },
    },
    place_id: "GhIJx1V2C265JUARNPEO8KSoWkA",
    plus_code: {
      compound_code: "VJ6P+V2 Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
      global_code: "7P28VJ6P+V2",
    },
    types: ["plus_code"],
  },
  {
    address_components: [
      {
        long_name: "62-84",
        short_name: "62-84",
        types: ["street_number"],
      },
      {
        long_name: "Hẻm 395 Tân Thới Hiệp 21",
        short_name: "Hẻm 395 Tân Thới Hiệp 21",
        types: ["route"],
      },
      {
        long_name: "Quận 12",
        short_name: "Quận 12",
        types: ["administrative_area_level_2", "political"],
      },
      {
        long_name: "Thành phố Hồ Chí Minh",
        short_name: "Thành phố Hồ Chí Minh",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address:
      "62-84 Hẻm 395 Tân Thới Hiệp 21, Tân Thới Hiệp, Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
    geometry: {
      bounds: {
        south: 10.8619254,
        west: 106.6348439,
        north: 10.8624832,
        east: 106.634879,
      },
      location: {
        lat: 10.8622059,
        lng: 106.6348774,
      },
      location_type: "GEOMETRIC_CENTER",
      viewport: {
        south: 10.8608553197085,
        west: 106.6335124697085,
        north: 10.8635532802915,
        east: 106.6362104302915,
      },
    },
    place_id: "ChIJt5P6dvQpdTERBrXzPLrBYwY",
    types: ["route"],
  },
  {
    address_components: [
      {
        long_name: "Tân Thới Hiệp",
        short_name: "Tân Thới Hiệp",
        types: ["administrative_area_level_3", "political"],
      },
      {
        long_name: "Quận 12",
        short_name: "Quận 12",
        types: ["administrative_area_level_2", "political"],
      },
      {
        long_name: "Thành phố Hồ Chí Minh",
        short_name: "Thành phố Hồ Chí Minh",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address:
      "Tân Thới Hiệp, Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
    geometry: {
      bounds: {
        south: 10.849688,
        west: 106.630673,
        north: 10.8688209,
        east: 106.65085,
      },
      location: {
        lat: 10.8606932,
        lng: 106.6379724,
      },
      location_type: "APPROXIMATE",
      viewport: {
        south: 10.849688,
        west: 106.630673,
        north: 10.8688209,
        east: 106.65085,
      },
    },
    place_id: "ChIJV8-Yn_IpdTERn8yGeLuyNSg",
    types: ["administrative_area_level_3", "political"],
  },
  {
    address_components: [
      {
        long_name: "Tân Thới Hiệp",
        short_name: "Tân Thới Hiệp",
        types: ["political", "sublocality", "sublocality_level_1"],
      },
      {
        long_name: "Quận 12",
        short_name: "Quận 12",
        types: ["administrative_area_level_2", "political"],
      },
      {
        long_name: "Thành phố Hồ Chí Minh",
        short_name: "Thành phố Hồ Chí Minh",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address:
      "Tân Thới Hiệp, Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
    geometry: {
      bounds: {
        south: 10.8521999,
        west: 106.6309202,
        north: 10.8718507,
        east: 106.6508285,
      },
      location: {
        lat: 10.8603672,
        lng: 106.6438673,
      },
      location_type: "APPROXIMATE",
      viewport: {
        south: 10.8521999,
        west: 106.6309202,
        north: 10.8718507,
        east: 106.6508285,
      },
    },
    place_id: "ChIJsZKJCvIpdTERKCq_ElhxGCw",
    types: ["political", "sublocality", "sublocality_level_1"],
  },
  {
    address_components: [
      {
        long_name: "Quận 12",
        short_name: "Quận 12",
        types: ["administrative_area_level_2", "political"],
      },
      {
        long_name: "Thành phố Hồ Chí Minh",
        short_name: "Thành phố Hồ Chí Minh",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address: "Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
    geometry: {
      bounds: {
        south: 10.818664,
        west: 106.6031231,
        north: 10.9041349,
        east: 106.7182729,
      },
      location: {
        lat: 10.8671531,
        lng: 106.6413322,
      },
      location_type: "APPROXIMATE",
      viewport: {
        south: 10.818664,
        west: 106.6031231,
        north: 10.9041349,
        east: 106.7182729,
      },
    },
    place_id: "ChIJbbK66tApdTERRS5Y8sCKD3I",
    types: ["administrative_area_level_2", "political"],
  },
  {
    address_components: [
      {
        long_name: "Thành phố Hồ Chí Minh",
        short_name: "Thành phố Hồ Chí Minh",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address: "Thành phố Hồ Chí Minh, Việt Nam",
    geometry: {
      bounds: {
        south: 10.3702489,
        west: 106.355765,
        north: 11.160486,
        east: 107.0115271,
      },
      location: {
        lat: 10.746903,
        lng: 106.676292,
      },
      location_type: "APPROXIMATE",
      viewport: {
        south: 10.3702489,
        west: 106.355765,
        north: 11.160486,
        east: 107.0115271,
      },
    },
    place_id: "ChIJI9kl2-8udTERFHIryt1Uz0s",
    types: ["administrative_area_level_1", "political"],
  },
  {
    address_components: [
      {
        long_name: "Hồ Chí Minh",
        short_name: "Hồ Chí Minh",
        types: ["locality", "political"],
      },
      {
        long_name: "Thành phố Hồ Chí Minh",
        short_name: "Thành phố Hồ Chí Minh",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address: "Hồ Chí Minh, Thành phố Hồ Chí Minh, Việt Nam",
    geometry: {
      bounds: {
        south: 10.3493704,
        west: 106.3638784,
        north: 11.1602136,
        east: 107.0265769,
      },
      location: {
        lat: 10.8230989,
        lng: 106.6296638,
      },
      location_type: "APPROXIMATE",
      viewport: {
        south: 10.3493704,
        west: 106.3638784,
        north: 11.1602136,
        east: 107.0265769,
      },
    },
    place_id: "ChIJ0T2NLikpdTERKxE8d61aX_E",
    types: ["locality", "political"],
  },
  {
    address_components: [
      {
        long_name: "Việt Nam",
        short_name: "VN",
        types: ["country", "political"],
      },
    ],
    formatted_address: "Việt Nam",
    geometry: {
      bounds: {
        south: 8.1952001,
        west: 102.1440178,
        north: 23.3926504,
        east: 109.6765,
      },
      location: {
        lat: 14.058324,
        lng: 108.277199,
      },
      location_type: "APPROXIMATE",
      viewport: {
        south: 8.1952001,
        west: 102.1440178,
        north: 23.3926504,
        east: 109.6765,
      },
    },
    place_id: "ChIJXx5qc016FTERvmL-4smwO7A",
    types: ["country", "political"],
  },
];

const t = (): {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
    location_type: string;
    viewport: { south: number; west: number; north: number; east: number };
  };
  place_id: string;
  plus_code: { compound_code: string; global_code: string };
  types: string[];
} => ({
  address_components: [
    {
      long_name: "64/5",
      short_name: "64/5",
      types: ["street_number"],
    },
    {
      long_name: "Tổ 18 KP1",
      short_name: "Tổ 18 KP1",
      types: ["route"],
    },
    {
      long_name: "Quận 12",
      short_name: "Quận 12",
      types: ["administrative_area_level_2", "political"],
    },
    {
      long_name: "Thành phố Hồ Chí Minh",
      short_name: "Thành phố Hồ Chí Minh",
      types: ["administrative_area_level_1", "political"],
    },
    {
      long_name: "Việt Nam",
      short_name: "VN",
      types: ["country", "political"],
    },
  ],
  formatted_address:
    "64/5 Tổ 18 KP1, Tân Thới Hiệp, Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
  geometry: {
    location: {
      lat: 10.862214,
      lng: 106.635082,
    },
    location_type: "ROOFTOP",
    viewport: {
      south: 10.8608650197085,
      west: 106.6337330197085,
      north: 10.8635629802915,
      east: 106.6364309802915,
    },
  },
  place_id: "ChIJU9ayivMpdTERbdGpDj5H_yM",
  plus_code: {
    compound_code: "VJ6P+V2 Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
    global_code: "7P28VJ6P+V2",
  },
  types: ["street_address"],
});

let z = [
  {
    long_name: "64/5",
    short_name: "64/5",
    types: ["street_number"],
  },
  {
    long_name: "Tổ 18 KP1",
    short_name: "Tổ 18 KP1",
    types: ["route"],
  },
  {
    long_name: "Quận 12",
    short_name: "Quận 12",
    types: ["administrative_area_level_2", "political"],
  },
  {
    long_name: "Thành phố Hồ Chí Minh",
    short_name: "Thành phố Hồ Chí Minh",
    types: ["administrative_area_level_1", "political"],
  },
  {
    long_name: "Việt Nam",
    short_name: "VN",
    types: ["country", "political"],
  },
].slice(-3);

let x =
  "64/5 Tổ 18 KP1, Tân Thới Hiệp, Quận 12, Thành phố Hồ Chí Minh, Việt Nam"
    .split(", ")
    .slice(0, -3);

logger({ z, x });
