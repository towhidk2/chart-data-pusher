const fs = require('fs');
const path = require('path');

const output = [];

const files = fs.readdirSync(__dirname).filter(file => path.extname(file) === '.csv');

if (files.length === 1) {
  const inputFile = files[0];
  const outputFile = 'Data.js'; // Output JavaScript file name

  const readStream = fs.createReadStream(inputFile, { encoding: 'utf-8' });

  let isFirstRow = true;

  readStream.on('data', (data) => {
    const lines = data.split('\n');
    for (const line of lines) {
      if (isFirstRow) {
        isFirstRow = false;
        continue; // Skip the first row
      }

      const values = line.split(',');

      if (values.length >= 5) {
        const time = parseInt(values[0]);
        const open = parseFloat(values[1]);
        const high = parseFloat(values[2]);
        const low = parseFloat(values[3]);
        const close = parseFloat(values[4]);

        output.push({
          time,
          open,
          high,
          low,
          close
        });
      }
    }
  });

  readStream.on('end', () => {
    const outputString = `const data = ${formatOutput(output)};\n\nexport default data;\n`;

    fs.writeFileSync(outputFile, outputString, 'utf-8');

    console.log(`Data has been written to ${outputFile}`);
  });

  function formatOutput(data) {
    return '[' + data.map(entry => `{
      time: ${entry.time},
      open: ${entry.open},
      high: ${entry.high},
      low: ${entry.low},
      close: ${entry.close}
    }`).join(',\n') + ']';
  }
} else {
  console.log('Error: There should be only one CSV file in the current directory.');
}

























// const fs = require('fs');

// const inputFile = 'nvda_1d.csv'; // Replace with your CSV file name
// const outputFile = 'Data.js';  // Output JavaScript file name

// const output = [];

// const readStream = fs.createReadStream(inputFile, { encoding: 'utf-8' });

// let isFirstRow = true;

// readStream.on('data', (data) => {
//   const lines = data.split('\n');
//   for (const line of lines) {
//     if (isFirstRow) {
//       isFirstRow = false;
//       continue; // Skip the first row
//     }

//     const values = line.split(',');

//     if (values.length >= 5) {
//       const time = parseInt(values[0]);
//       const open = parseFloat(values[1]);
//       const high = parseFloat(values[2]);
//       const low = parseFloat(values[3]);
//       const close = parseFloat(values[4]);

//       output.push({
//         time,
//         open,
//         high,
//         low,
//         close
//       });
//     }
//   }
// });

// readStream.on('end', () => {
//   const outputString = `const chartData = ${formatOutput(output)};\n\nexport default chartData;\n`;

//   fs.writeFileSync(outputFile, outputString, 'utf-8');

//   console.log(`Data has been written to ${outputFile}`);
// });

// function formatOutput(data) {
//   return '[' + data.map(entry => `{
//     time: ${entry.time},
//     open: ${entry.open},
//     high: ${entry.high},
//     low: ${entry.low},
//     close: ${entry.close}
//   }`).join(',\n') + ']';
// }

