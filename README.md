# AI-Powered Twitter Bot for Vercel

This is a Node.js-based Twitter bot that automatically generates and posts tweets with AI-created images. It is designed to be deployed on Vercel and uses its Cron Jobs feature for scheduling. The bot leverages Exa.ai for text generation and OpenAI's DALL-E 3 for image creation.

## Features

- **Serverless Deployment:** Runs as a Vercel serverless function, eliminating the need for a dedicated server.
- **Scheduled Tweeting:** Vercel Cron Jobs trigger the bot to post at **9:00 AM, 2:00 PM, and 7:00 PM PHT** (1:00, 6:00, and 11:00 UTC).
- **AI-Generated Content:** Uses Exa.ai to generate relevant and professional tweets based on a specified topic, tone, and keywords.
- **AI-Generated Images:** Creates unique, high-quality images with OpenAI's DALL-E 3 to accompany each tweet.
- **Dynamic Workflow:**
  1.  A Vercel Cron Job triggers the `/api/tweet` endpoint.
  2.  The serverless function generates a tweet about "AI and Blockchain."
  3.  It uses the tweet's text as a prompt to generate a visually relevant image.
  4.  The image is temporarily stored in the `/tmp` directory.
  5.  The function posts the tweet with the image to Twitter.
  6.  The temporary image file is deleted.
- **Resilient:** If image generation fails, the bot will post the text-only tweet as a fallback.

## How It Works

The project is structured for Vercel deployment:

1.  **`vercel.json`:** This file configures Vercel Cron Jobs to send requests to the `/api/tweet` endpoint at specific times.
2.  **`api/tweet.js`:** This is the serverless function that contains all the bot's logic. When triggered, it performs the tweet and image generation, posts to Twitter, and handles cleanup.
3.  **Environment Variables:** All API keys and tokens are stored as environment variables in your Vercel project settings for security.

## Vercel Deployment Guide

### Prerequisites

- A Vercel account (a free Hobby account is sufficient).
- A GitHub, GitLab, or Bitbucket account.
- A Twitter Developer account with API v2 access.
- API keys from Exa.ai and OpenAI.

### Deployment Steps

1.  **Push to a Git Repository:**
    Make sure your project, including the `api/tweet.js` file and `vercel.json`, is pushed to a repository on GitHub, GitLab, or Bitbucket.

2.  **Create a New Vercel Project:**
    - Log in to your Vercel account.
    - Click "Add New..." and select "Project."
    - Import the Git repository you just created.

3.  **Configure the Project:**
    - Vercel should automatically detect that it is a Node.js project. No special build settings are required.
    - Go to the "Settings" tab of your new Vercel project.
    - Click on "Environment Variables."
    - Add the following environment variables with your API keys and tokens:
      - `EXA_A`
      - `TWITTER_API_KEY`
      - `TWITTER_API_SECRET_KEY`
      - `TWITTER_ACCESS_TOKEN`
      - `TWITTER_ACCESS_TOKEN_SECRET`
      - `TWITTER_BEARER_TOKEN`
      - `OPENAI_API_KEY`

4.  **Deploy:**
    - Go to the "Deployments" tab and trigger a new deployment.
    - Vercel will build and deploy your serverless function.

5.  **Verify:**
    Once deployed, Vercel's Cron Jobs will automatically trigger your bot at the scheduled times. You can check the function logs in the Vercel dashboard to monitor its activity.