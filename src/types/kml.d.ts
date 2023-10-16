type Placemark = {
  name: string;
  visibility: number;
  styleUrl: string;
  Point: {
    extrude: number;
    tessellate: number;
    coordinates: string;
  };
};
