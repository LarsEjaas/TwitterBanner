import dotenv from "dotenv";
dotenv.config();
import { Handler } from "@netlify/functions";
import { TwitterClient } from "twitter-api-client";
import User from "twitter-api-client/dist/interfaces/types/ListsMembersShowTypes";
import axios from "axios";
import fs from "fs";
import path from "path";
import Jimp from "jimp";
import sharp from "sharp";

const twitterClient = new TwitterClient({
  apiKey: process.env.API_KEY || "",
  apiSecret: process.env.API_SECRET || "",
  accessToken: process.env.ACCESS_TOKEN || "",
  accessTokenSecret: process.env.ACCESS_SECRET || "",
});

const numberOfFollowers = 4;
const widthHeightFollowerImage = 96;

const uploadBanner = async () => {
  console.info(`Base64 encoding finalized banner...`);
  const base64 = fs.readFileSync(
    path.resolve(__dirname, "./tmp/1500x500_final.png"),
    {
      encoding: "base64",
    }
  );
  console.info(`Uploading to twitter...`);
  try {
    await twitterClient.accountsAndUsers.accountUpdateProfileBanner({
      banner: base64,
    });
  } catch (err) {
    console.error(err);
  }
};

const createBanner = async () => {
  const banner = await Jimp.read(path.resolve(__dirname, "./1500x500.jpg"));
  // build banner
  console.info(`Adding followers...`);
  try {
    await Promise.all(
      [...Array(numberOfFollowers)].map((_, i) => {
        return new Promise(async (resolve) => {
          const image = await Jimp.read(
            path.resolve(__dirname, `./tmp/${i}.png`)
          );
          const x = 942 + i * (widthHeightFollowerImage + 24);
          console.info(`Appending image ${i} with x=${x}`);
          banner.composite(image, x, 202);
          resolve(() => {});
        });
      })
    );
    await banner.writeAsync(
      path.resolve(__dirname, "./tmp/1500x500_final.png")
    );
  } catch (err) {
    console.error(err);
  }
};

const saveAvatar = async (user: User, path: string) => {
  const roundedCorners = Buffer.from(
    '<svg><rect x="0" y="0" width="96" height="96" rx="48" ry="48"/></svg>'
  );

  console.info(`Retrieving avatar...`);
  const response = await axios({
    url: user.profile_image_url_https,
    responseType: "arraybuffer",
  });

  try {
    await sharp(response.data)
      .resize(widthHeightFollowerImage, widthHeightFollowerImage)
      .composite([
        {
          input: roundedCorners,
          blend: "dest-in",
        },
      ])
      .toFile(path);
  } catch (err) {
    console.error(err);
  }
};

const getImagesOfLatestFollowers = async () => {
  console.info(`Retrieving followers...`);
  try {
    const data = await twitterClient.accountsAndUsers.followersList({
      screen_name: process.env.TWITTER_HANDLE,
      count: numberOfFollowers,
    });
    console.info(`Retrieving follower avatars...`);
    await Promise.all(
      data.users.map((user, index) =>
        saveAvatar(user, path.resolve(__dirname, `./tmp/${index}.png`))
      )
    );
  } catch (err) {
    console.error(err);
  }
};

export const handler: Handler = async () => {
  await getImagesOfLatestFollowers();
  await createBanner();
  await uploadBanner();

  return {
    statusCode: 200,
  };
};
