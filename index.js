const fs = require('fs');
const path =  require('path');

// Sharp - https://sharp.pixelplumbing.com/
const sharp = require('sharp');
//SVGO - https://github.com/svg/svgo
const { optimize } = require('svgo');

let dir_name = 'images';

let filenames = fs.readdirSync(dir_name);

filenames.forEach(file => {
  const fileFormat = getExtension(file);
  let outputName = file.split('.')[0];

  if (fileFormat === 'svg') {
    outputName += '.svg';

    let svg = fs.readFileSync('./images/' + file, 'utf-8', function (err, data) {
      if (err) {
        console.log(err);
        throw err;
      }
      return data;
    });

    const result = optimize(svg, {
      // optional but recommended field
      path: file,
      // all config fields are also available here
      multipass: true,
      plugins: ['preset-default'],
    });
    fs.writeFileSync('output/' + outputName, result.data);
;
    return;
  }

  
  if (fileFormat !== 'svg') {
    let sh = sharp('./images/' + file);
    outputName += '.webp';
    if (fileFormat === 'png' || fileFormat === 'PNG') {       
        //sh = sh.png({quality:90});
    }
    if (fileFormat === 'jpg' || fileFormat === 'jpeg') {
        //sh = sh.jpeg({mozjpeg: true});
    }
    sh.toFormat('webp')
      .webp({ quality: 80})
      .toFile('output/' + outputName, function (err, info) {
        console.log(info);
        if (err) {
          console.log('error in img optim!');
          return;
        }
      });
  }
  
});

function getExtension(filename) {
    let ext = path.extname(filename || '').split('.');
    return ext[ext.length - 1];
}

