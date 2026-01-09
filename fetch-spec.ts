import fs from 'fs';
import { get } from 'http';

const file = fs.createWriteStream('src/lib/api/openapi-spec.json');
const request = get('http://localhost:3000/api-json', function (response) {
    response.pipe(file);
    file.on('finish', () => {
        file.close(() => {
            console.log('Spec downloaded successfully');
        });
    });
});

request.on('error', function (err) {
    fs.unlink('src/lib/api/openapi-spec.json', () => { });
    console.error(err);
});
