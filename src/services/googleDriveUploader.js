const { google } = require('googleapis')
require('dotenv').config();

const oauth2Client = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.DRIVE_CLIENT_EMAIL,
        client_id: process.env.DRIVE_CLIENT_ID,
        private_key: process.env.DRIVE_PRIVATE_KEY,
    },
    scopes:[
        'https://www.googleapis.com/auth/drive.file'
    ]
}
);

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

/**
 * @param {Buffer} fileBuffer - Buffer de datos binarios de la imagen
 * @param {string} fileName - Nombre de la imagen
 * @param {string} mimeType - tipo de mime como image/png
 * @returns {Promise<string>} - Devolvera una url como string
 */
async function uploadToGoogleDrive(fileBuffer, fileName, mimeType) {
    try {
        const fileMetadata = {
            name: fileName,
            parents: ["Runique_folder"],
        };

        const media = {
            mimeType,
            body: fileBuffer,
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id",
        });

        const fileId = response.data.id;

        // Habilitamos permisos para que sea publico
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        // Construir la URL pública del archivo
        const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
        return fileUrl;

    } catch (error) {
        
        console.error("Error al subir a Google Drive:", error);
        throw error;
    }
}

module.exports = uploadToGoogleDrive;