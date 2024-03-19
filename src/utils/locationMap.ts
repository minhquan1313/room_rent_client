import locationMapData from "@/constants/locationMapData";

const locationMap = (value?: string) => {
  return (value && (locationMapData as any)[value]) || value;
};

export default locationMap;
