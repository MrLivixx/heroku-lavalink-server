
const fs = require('fs')
const http = require('http')
let application = fs.readFileSync('./application.yml', 'utf8')

if (process.env.PORT) {
    application = application.replace('DYNAMICPORT', process.env.PORT)
}

if (process.env.PASS) {
    application = application.replace('youshallnotpass', process.env.PASS)
}
fs.writeFileSync('./application.yml', application)

const download = function (url, dest, cb) { 
    const file = fs.createWriteStream(dest);
    http.get(url, function (response) {
        response.pipe(file);
        console.log('Downloading Lavalink.jar')
        file.on('finish', function () {
            console.log('Downloaded Lavalink.jar')
            file.close(cb);
        });
    }).on('error', function (err) {
        fs.unlinkSync(dest);
        console.error(err)
    });
};

function startLavalink() {
    const spawn = require('child_process').spawn;
    const child = spawn('java', ['-jar', 'Lavalink.jar'])

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')

    child.stdout.on('data', (data) => {
        console.log(data);
    });

    child.stderr.on('data', (data) => {
        console.error(data);
    });

    child.on('error', (error) => {
        console.error(error);
    });

    child.on('close', (code) => {
        console.log(`Lavalink exited with code ${code}`);
    });
}

const cdn = 'https://github.com/Frederikam/Lavalink/releases/download/3.3.1.1/Lavalink.jar'
download(cdn, './Lavalink.jar', startLavalink)
