import dotenv from "dotenv";
dotenv.config();
import { TwitterClient } from "twitter-api-client";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Jimp from "jimp";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const numberOfFollowers = 4;
const widthHeightFollowerImage = 96;

async function uploadBanner() {
  console.info(`Base64 encoding finalized banner...`);
  const base64 = await fs.readFileSync(`${__dirname}/tmp/1500x500_final.png`, {
    encoding: "base64",
  });
  console.info(`Uploading to twitter...`);
  await twitterClient.accountsAndUsers.accountUpdateProfileBanner({
    banner: base64,
  });
}

async function createBanner() {
  const banner = await Jimp.read(`${__dirname}/1500x500.jpg`);
  // build banner
  console.info(`Adding followers...`);
  await Promise.all(
    [...Array(numberOfFollowers)].map((_, i) => {
      return new Promise(async (resolve) => {
        const image = await Jimp.read(`${__dirname}/tmp/${i}.png`);
        const x = 942 + i * (widthHeightFollowerImage + 24);
        console.info(`Appending image ${i} with x=${x}`);
        banner.composite(image, x, 202);
        resolve();
      });
    })
  );
  await banner.writeAsync(`${__dirname}/tmp/1500x500_final.png`);
}

async function saveAvatar(user, path) {
  const roundedCorners = Buffer.from(
    '<svg><rect x="0" y="0" width="96" height="96" rx="48" ry="48"/></svg>'
  );

  console.info(`Retrieving avatar...`);
  const response = await axios({
    url: user.profile_image_url_https,
    responseType: "arraybuffer",
  });

  await sharp(response.data)
    .resize(widthHeightFollowerImage, widthHeightFollowerImage)
    .composite([
      {
        input: roundedCorners,
        blend: "dest-in",
      },
    ])
    .toFile(path);
}

async function getImagesOfLatestFollowers() {
  console.info(`Retrieving followers...`);
  try {
    const data = await twitterClient.accountsAndUsers.followersList({
      screen_name: process.env.TWITTER_HANDLE,
      count: numberOfFollowers,
    });
    console.info(`Retrieving follower avatars...`);
    await Promise.all(
      data.users.map((user, index) =>
        saveAvatar(user, `${__dirname}/tmp/${index}.png`)
      )
    );
  } catch (err) {
    console.error(err);
  }
}

const twitterClient = new TwitterClient({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_SECRET,
});

async function getLatestFollowers() {
  console.info(
    "Starting getLatest follower script at",
    Date(Date.now()).toString()
  );
  await getImagesOfLatestFollowers();
  await createBanner();
  await uploadBanner();
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "ok" }),
  };
}

getLatestFollowers();
setInterval(() => {
  getLatestFollowers();
}, 60000);
