
import { put } from '@vercel/blob';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { config } from "dotenv";
config({ path: ".env" });

const songsDir = 'C:/metaverse/public/songs';
const outputJsonPath = './songs.json';

const uploadSongs = async () => {
  try {
    const files = await readdir(songsDir);
    const uploadedSongs = [];

    for (const filename of files) {
      if (filename.endsWith('.mp3')) {
        const filePath = join(songsDir, filename);
        const file = await readFile(filePath);

        console.log(`Uploading ${filename}...`);
        const { url } = await put(filename, file, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN, allowOverwrite: true });

        uploadedSongs.push({
          title: filename.replace('.mp3', ''),
          url,
        });

        console.log(`Uploaded ${filename}, URL: ${url}`);
      }
    }

    // Save the list of URLs to a JSON file
    await writeFile(outputJsonPath, JSON.stringify(uploadedSongs, null, 2));
    console.log(`\nSuccessfully uploaded all songs. URLs saved to ${outputJsonPath}`);

  } catch (error) {
    console.error('An error occurred during upload:', error);
  }
};

uploadSongs();