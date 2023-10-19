import parseKMZ from "./lib/parseKMZ";
import parseKML from "./lib/parseKML";

const args = Bun.argv;

if (args.length <= 2) {
  throw new Error("Use: bun dev path_to_file");
}

const path = args[2];
const file = Bun.file(path);
const file_exists = await file.exists();
const file_type = file.type;
const file_name = file.name?.split("/").pop()?.split(".")[0];

if (!file_exists) {
  throw Error("Arquivo não encontrado.");
} else if (!file_type.endsWith(".kml+xml") && !file_type.endsWith(".kmz")) {
  throw Error("Tipo de arquivo não suportado.");
}

if (file_type === "application/vnd.google-earth.kmz") {
  const data = await parseKMZ.toKML(path);

  const placemarks = await parseKML.toPlacemarks(data);

  let csv = "";

  for (let placemark of placemarks) {
    try {
      const coordinates = placemark.Point.coordinates.split(",");

      csv += `${placemark.name},${placemark.name},${coordinates[1]},${coordinates[0]}\n`;
    } catch {}
  }

  await Bun.write(`./out/${file_name}.csv`, csv);
} else if (file_type === "application/vnd.google-earth.kml+xml") {
  const reader = await file.stream().getReader().read();
  const text = new TextDecoder().decode(reader.value)
  const placemarks = await parseKML.toPlacemarks(text);

  let csv = "";

  for (let placemark of placemarks) {
    try {
      const coordinates = placemark.Point.coordinates.split(",");

      csv += `${placemark.name},${placemark.name},${coordinates[1]},${coordinates[0]}\n`;
    } catch {}
  }
  await Bun.write(`./out/${file_name}.csv`, csv);
}
