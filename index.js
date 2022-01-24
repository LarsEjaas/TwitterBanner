import dotenv from "dotenv";
dotenv.config();
import { TwitterClient } from "twitter-api-client";
import axios from "axios";
import fs from "fs";
import Jimp from "jimp";
import sharp from "sharp";

const twitterClient = new TwitterClient({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_SECRET,
});

async function getLatestFollowers() {
  const data = await twitterClient.accountsAndUsers.followersList({
    screen_name: process.env.TWITTER_HANDLE,
    count: 3,
  });

  let count = 0;
  const downloads = new Promise((resolve, reject) => {
    data.users.forEach((user, index, arr) => {
      downloadImage(user.profile_image_url_https, `${index}.png`).then(() => {
        count++;
        if (count === arr.length) resolve();
      });
    });
  });

  downloads.then(() => {
    drawBanner();
  });
}

async function downloadImage(url, image_path) {
  await axios({
    url,
    responseType: "arraybuffer",
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        const rect = Buffer.from(
          '<svg><rect x="0" y="0" width="96" height="96" rx="48" ry="48"/></svg>'
        );
        resolve(
          sharp(response.data)
            .resize(96, 96)
            .overlayWith(rect, { cutout: true })
            .toFile(image_path)
        );
      })
  );
}

async function drawBanner() {
  const images = ["1500x500.jpg", "0.png", "1.png", "2.png"];
  const promiseArray = [];
  images.forEach((image) => promiseArray.push(Jimp.read(image)));

  Promise.all(promiseArray).then(([banner, imageOne, imageTwo, imageThree]) => {
    banner.composite(imageOne, 942, 62);
    banner.composite(imageTwo, 1062, 62);
    banner.composite(imageThree, 1182, 62);
    banner.write("1500x500.png", function () {
      uploadBanner();
    });
  });
}

async function uploadBanner() {
  const base64 = await fs.readFileSync("1500x500.png", { encoding: "base64" });
  await twitterClient.accountsAndUsers
    .accountUpdateProfileBanner({
      banner: base64,
    })
    .then((d) => {
      console.log("Upload to Twitter done");
    });
}

getLatestFollowers();
setInterval(() => {
  getLatestFollowers();
}, 60000);
