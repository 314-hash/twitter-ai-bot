import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function App() {
  const [prompt, setPrompt] = useState("")
  const [tweet, setTweet] = useState("")
  const [status, setStatus] = useState("")

  const generateTweet = async () => {
    setStatus("🧠 Generating tweet...")
    try {
      const res = await axios.post("http://localhost:5000/generate", { prompt })
      setTweet(res.data.tweet)
      setStatus("✅ Generated successfully!")
    } catch {
      setStatus("❌ Error generating tweet.")
    }
  }

  const postTweet = async () => {
    setStatus("🚀 Posting to Twitter...")
    try {
      await axios.post("http://localhost:5000/tweet", { tweet })
      setStatus("✅ Posted successfully!")
    } catch {
      setStatus("❌ Error posting tweet.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Floating Twitter Birds Animation */}
      <motion.img
        src="https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg"
        className="absolute w-12 opacity-30 left-10 top-10 animate-float"
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.img
        src="https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg"
        className="absolute w-16 opacity-20 right-10 bottom-10 animate-float"
        animate={{ y: [0, 30, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Hero Text */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-6 text-center drop-shadow-xl"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🧠 AI Twitter Bot
      </motion.h1>

      {/* Prompt Input Box */}
      <motion.textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Write a topic or idea..."
        className="w-full max-w-xl p-4 rounded-md text-black shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition mb-4"
        rows={3}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />

      {/* Buttons */}
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <button
          onClick={generateTweet}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          ✨ Generate Tweet
        </button>
        <button
          onClick={postTweet}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          🚀 Post to Twitter
        </button>
      </motion.div>

      {/* Status Text */}
      <motion.p
        className="mt-4 text-sm text-pink-300"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {status}
      </motion.p>

      {/* Tweet Preview Box */}
      {tweet && (
        <motion.div
          className="mt-6 p-4 bg-white/10 border border-white/20 rounded-md shadow-lg backdrop-blur w-full max-w-xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-xl font-semibold mb-2">📝 Generated Tweet</h2>
          <p className="text-white/90">{tweet}</p>
        </motion.div>
      )}
    </div>
  )
}
