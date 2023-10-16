import { XMLParser } from "fast-xml-parser";

async function toPlacemarks(data: string): Promise<Placemark[]> {
  const placemarks = data
    .replaceAll("\t", "")
    .split(/<Placemark>|<\/Placemark>/g)
    .filter((data) => data.includes("coordinates"))
    .map((data) => `<Placemark>${data.trim()}</Placemark>`);

  const parser = new XMLParser();

  const placemarksObj = placemarks.map(
    (data) => parser.parse(data).Placemark
  ) as Placemark[];

  return placemarksObj;
}

const parseKML = {
  toPlacemarks,
};

export default parseKML;
