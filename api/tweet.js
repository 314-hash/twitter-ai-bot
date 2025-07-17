const { TwitterApi } = require("twitter-api-v2");
const axios = require("axios");
const { OpenAI } = require("openai");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const KEYWORDS = [
  "decentralized infrastructure",
  "intelligent agents",
  "automation workflows",
  "Web3 systems",
  "smart contracts",
  "dApps",
  "AI DevOps",
  "data sovereignty",
  "trustless execution"
];

const TOPIC = "AI and Blockchain";
const TONE = "professional";

// 📌 Step 1: Generate Tweet using Exa.ai
async function generateTweet(topic, tone, keywords) {
  try {
    const response = await axios.post(
      "https://api.exa.ai/generate",
      {
        topic,
        tone,
        keywords,
        length: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.EXA_A}`,
        },
      }
    );
    return response.data.text;
  } catch (err) {
    console.error("❌ Error generating content:", err);
    return "Exploring how AI and blockchain empower trustless, automated Web3 systems. #AI #Blockchain #Web3";
  }
}

// 📌 Step 2: Generate Image using DALL-E
async function generateImage(prompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a visually stunning image that captures the essence of: "${prompt}". The image should be professional, high-quality, and suitable for a tech-focused audience. Emphasize concepts like connectivity, data flow, and intelligence.`,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = response.data[0].url;
    console.log("✅ Image generated successfully!");

    // Download the image to a temporary directory
    const imageResponse = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
    });
    const tempImagePath = path.join("/tmp", "temp_image.png");
    await fs.writeFile(tempImagePath, imageResponse.data);
    console.log("✅ Image downloaded successfully!");
    return tempImagePath;
  } catch (err) {
    console.error("❌ Error generating or downloading image:", err);
    return null;
  }
}

// 📌 Step 3: Login and Post using Twitter API
async function postToTwitter(tweetText, imagePath) {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET_KEY,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  try {
    if (imagePath) {
      // Upload media and post tweet with image
      const mediaId = await client.v1.uploadMedia(imagePath);
      console.log("✅ Media uploaded successfully!");

      await client.v2.tweet({
        text: tweetText,
        media: { media_ids: [mediaId] },
      });
      console.log("✅ Tweet with image posted successfully!");
    } else {
      // Post text-only tweet
      await client.v2.tweet(tweetText);
      console.log("✅ Text-only tweet posted successfully!");
    }
  } catch (err) {
    console.error("❌ Tweeting failed:", err);
  } finally {
    // Clean up the temporary image file if it exists
    if (imagePath) {
      try {
        await fs.unlink(imagePath);
        console.log("🗑️ Temporary image file deleted.");
      } catch (unlinkErr) {
        console.error("❌ Error deleting temporary image file:", unlinkErr);
      }
    }
  }
}

// Vercel Serverless Function
module.exports = async (req, res) => {
  try {
    console.log("🕒 Generating tweet...");
    const tweet = await generateTweet(TOPIC, TONE, KEYWORDS);
    const imagePath = await generateImage(tweet);
    if (imagePath) {
      await postToTwitter(tweet, imagePath);
    } else {
      // Fallback to posting text-only tweet if image generation fails
      await postToTwitter(tweet, null);
    }
    res.status(200).send("Tweet posted successfully!");
  } catch (error) {
    console.error("Error in serverless function:", error);
    res.status(500).send("An error occurred while posting the tweet.");
  }
};