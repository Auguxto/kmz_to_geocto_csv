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

if (!file_exists) {
  throw Error("Arquivo não encontrado.");
} else if (!file_type.endsWith(".kml+xml") && !file_type.endsWith(".kmz")) {
  throw Error("Tipo de arquivo não suportado.");
}

if (file_type === "application/vnd.google-earth.kmz") {
  const data = await parseKMZ.toKML(path);

  const placemarks = await parseKML.toPlacemarks(data);

  console.log(placemarks);
} else if (file_type === "application/vnd.google-earth.kml+xml") {
  const placemarks = await parseKML.toPlacemarks(await file.text());

  console.log(placemarks);
}
