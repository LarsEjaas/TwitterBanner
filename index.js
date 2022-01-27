import dotenv from "dotenv";
dotenv.config();
import { TwitterClient } from "twitter-api-client";
import axios from "axios";
import fs from "fs";
import Jimp from "jimp";
import sharp from "sharp";

const numberOfFollowers = 3;
const widthHeightFollowerImage = 96;

async function uploadBanner() {
  console.log(`Uploading to twitter...`);
  const base64 = await fs.readFileSync("./tmp/1500x500_final.png", {
    encoding: "base64",
  });
  await twitterClient.accountsAndUsers.accountUpdateProfileBanner({
    banner: base64,
  });
}

async function createBanner() {
  const banner = await Jimp.read(`1500x500.jpg`);
  // build banner
  console.log(`Adding followers...`);
  await Promise.all(
    [...Array(numberOfFollowers)].map((_, i) => {
      return new Promise(async (resolve) => {
        const image = await Jimp.read(`./tmp/${i}.png`);
        const x = 942 + i * (widthHeightFollowerImage + 24);
        console.log(`Appending image ${i} with x=${x}`);
        banner.composite(image, x, 62);
        resolve();
      });
    })
  );
  await banner.writeAsync("./tmp/1500x500_final.png");
}

async function saveAvatar(user, path) {
  const roundedCorners = Buffer.from(
    '<svg><rect x="0" y="0" width="96" height="96" rx="48" ry="48"/></svg>'
  );

  console.log(`Retrieving avatar...`);
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
  console.log(`Retrieving followers...`);
  try {
    const data = await twitterClient.accountsAndUsers.followersList({
      screen_name: process.env.TWITTER_HANDLE,
      count: numberOfFollowers,
    });
    await Promise.all(
      data.users.map((user, index) => saveAvatar(user, `./tmp/${index}.png`))
    );
  } catch (err) {
    console.log(err);
  }
}

const twitterClient = new TwitterClient({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_SECRET,
});

async function getLatestFollowers() {
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
