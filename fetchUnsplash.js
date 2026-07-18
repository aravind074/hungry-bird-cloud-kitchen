const https = require('https');

function getUnsplashIds(query) {
  return new Promise((resolve) => {
    https.get(`https://unsplash.com/s/photos/${query}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/photo-[a-zA-Z0-9\-]+/g);
        if (matches) {
          resolve([...new Set(matches)].slice(0, 5));
        } else {
          resolve([]);
        }
      });
    });
  });
}

async function run() {
  console.log('Mango Lassi:', await getUnsplashIds('mango-lassi'));
  console.log('Biryani:', await getUnsplashIds('biryani'));
  console.log('Curry:', await getUnsplashIds('egg-curry'));
}

run();
