const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

const output = [];

const outputFile = 'Data.js'; // Output JavaScript file name

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the stock symbol: ', (symbol) => {
    rl.close();

    const start_time = Math.floor(new Date('2022-12-01T23:59:00').getTime() / 1000);
    const end_time = Math.floor(new Date('2023-08-24T23:59:00').getTime() / 1000);
    const interval = '1d';

    const query_string = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${start_time}&period2=${end_time}&interval=${interval}&events=history&includeAdjustedClose=true`;

    axios.get(query_string)
        .then(response => {
            const csvData = response.data;

            const lines = csvData.split('\n');
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                if (values.length >= 6) {
                    const time = parseInt(new Date(values[0]).getTime() / 1000);
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

            const outputString = `const chartData = ${formatOutput(output)};\n\nexport default chartData;\n`;

            fs.writeFileSync(outputFile, outputString, 'utf-8');
            console.log(`Data has been written to ${outputFile}`);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
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





