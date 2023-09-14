export type Location3rd = {
  name: string;
  code: string;
};

export type LocationResolve = {
  [k in keyof LocationSearchQuery]: Location3rd;
};

export type LocationSearchQuery = {
  country?: string;
  province?: string;
  district?: string;
  ward?: string;

  all?: unknown;
};
