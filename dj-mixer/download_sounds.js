const https = require('https');
const fs = require('fs');
const path = require('path');

const soundEffects = {
    'scratch': 'https://cdn.freesound.org/previews/573/573649_11861866-lq.mp3',
    'airhorn': 'https://cdn.freesound.org/previews/493/493696_10982655-lq.mp3',
    'drum': 'https://cdn.freesound.org/previews/648/648853_13874539-lq.mp3',
    'transition': 'https://cdn.freesound.org/previews/648/648882_13874539-lq.mp3',
    'bass': 'https://cdn.freesound.org/previews/648/648881_13874539-lq.mp3',
    'cymbal': 'https://cdn.freesound.org/previews/648/648879_13874539-lq.mp3'
};

const downloadFile = (url, destination) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destination);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(destination, () => {});
            reject(err);
        });
    });
};

async function downloadSoundEffects() {
    const soundsDir = path.join(__dirname, 'sounds');
    
    // Create sounds directory if it doesn't exist
    if (!fs.existsSync(soundsDir)) {
        fs.mkdirSync(soundsDir);
    }

    for (const [name, url] of Object.entries(soundEffects)) {
        const destination = path.join(soundsDir, `${name}.mp3`);
        console.log(`Downloading ${name}.mp3...`);
        try {
            await downloadFile(url, destination);
            console.log(`Successfully downloaded ${name}.mp3`);
        } catch (error) {
            console.error(`Error downloading ${name}.mp3:`, error);
        }
    }
}

downloadSoundEffects();
