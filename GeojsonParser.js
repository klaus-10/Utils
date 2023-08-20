const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the path to the GeoJSON file: ", (geojsonFilePath) => {
  rl.question(
    'Enter additional info as a comma-separated array (e.g., "value1,value2,value3"): ',
    (additionalInfo) => {
      const additionalInfoArray = additionalInfo.split(",");

      // Read the GeoJSON file
      fs.readFile(geojsonFilePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading the file:", err);
          rl.close();
          return;
        }

        // Parse the GeoJSON data
        const parsedData = JSON.parse(data);

        // Filter out features based on additional info array
        const clonedData = {
          ...parsedData,
          features: parsedData.features.filter((feature) => {
            return !additionalInfoArray.includes(feature.geometry.type);
          }),
        };

        // Generate a unique output file name based on timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const outputFileName = `output_${timestamp}.geojson`;

        // Write out the new GeoJSON file
        const outputFilePath = outputFileName;
        fs.writeFileSync(outputFilePath, JSON.stringify(clonedData, null, 2));

        console.log(`New GeoJSON file written to ${outputFilePath}`);

        rl.close();
      });
    }
  );
});
