const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = 'f:\\Meno\\El-bsata\\ElBsata.API\\wwwroot\\images';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const map = {
    "1544025162": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60",
    "1608897013": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&auto=format&fit=crop&q=60",
    "1546069901": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60",
    "1547592180": "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=60",
    "1541532713": "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=60",
    "1512058564": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=60",
    "1573080496": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=60",
    "1590301157": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=60",
    "1604908176": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=60",
    "1516685018": "https://images.unsplash.com/photo-1516685018646-549198525c1b?w=600&auto=format&fit=crop&q=60",
    "1504674900": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60"
};

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, function(response) {
      if (response.statusCode === 302 || response.statusCode === 301) {
          https.get(response.headers.location, function(res) {
             res.pipe(file);
             file.on('finish', function() {
                file.close(() => resolve());
             });
          }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', function() {
          file.close(() => resolve());
        });
      }
    }).on('error', reject);
  });
};

async function run() {
    for (const [key, url] of Object.entries(map)) {
        console.log('Downloading', key);
        await download(url, path.join(dir, key + '.jpg'));
    }
    console.log('Done');
}

run();
