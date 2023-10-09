const babel = require('@babel/core');
const fs = require('fs');

const inputFilePath = 'src/app.js'; // Caminho do seu arquivo de entrada
const outputFilePath = 'dist/app.js'; // Caminho e nome do arquivo de saída

const options = {
  presets: ['@babel/preset-env'],
};

fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  babel
    .transformAsync(data, options)
    .then((result) => {
      fs.writeFile(outputFilePath, result.code, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log('Build concluído com sucesso!');
      });
    })
    .catch((err) => {
      console.error(err);
    });
});