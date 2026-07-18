const https = require('https');
const fs = require('fs');
const path = require('path');

const downloads = [
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Mango_Lassi.jpg/800px-Mango_Lassi.jpg', dest: 'mango_lassi_real.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Vegetable_biryani.jpg/800px-Vegetable_biryani.jpg', dest: 'veg_biryani_real.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Egg_Curry.jpg/800px-Egg_Curry.jpg', dest: 'egg_curry_real.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Bengali_Mutton_Curry.JPG/800px-Bengali_Mutton_Curry.JPG', dest: 'mutton_curry_real.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Kadai_Paneer-Delhi-12.jpg', dest: 'kadai_paneer_real.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vada_Pav-Indian_street_food.JPG/800px-Vada_Pav-Indian_street_food.JPG', dest: 'vada_pav_real.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Gulab-jamun-wallpaper-1.jpg', dest: 'gulab_jamun_real.jpg' }
];

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(__dirname, 'apps', 'web', 'public', 'images', dest));
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        console.error('Failed to download', url, res.statusCode);
        resolve(); // Don't reject, just resolve to continue
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  for (const dl of downloads) {
    await download(dl.url, dl.dest);
    console.log(`Downloaded ${dl.dest}`);
  }
}

run();
