import { createReadStream } from "fs";
import unzipper from "unzipper";

async function toKML(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    createReadStream(path)
      .pipe(unzipper.Parse())
      .on("entry", function (entry) {
        if (entry.path.indexOf(".kml") === -1) {
          entry.autodrain();
          return;
        }
        let data = "";

        entry.on("error", reject);

        entry.on("data", function (chunk: BlobPart) {
          data += chunk;
        });

        entry.on("end", function () {
          resolve(data);
        });
      })
      .on("error", reject);
  });
}

const parseKMZ = {
  toKML,
};

export default parseKMZ;
