// routes/agora.js
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import pkg from 'agora-access-token'; // ✅ use default import
const { RtcTokenBuilder, RtcRole } = pkg;

const router = express.Router();

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

// Generate token for a given channel name (roomId) and user ID
router.post('/token', (req, res) => {
  const { channelName, uid } = req.body;

  if (!channelName || !uid) {
    return res.status(400).json({ error: 'channelName and uid are required' });
  }

  const role = RtcRole.PUBLISHER;
  const expireTimeInSeconds = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTs = currentTimestamp + expireTimeInSeconds;
  console.log("App ID:", APP_ID);
  console.log("App Certificate:", APP_CERTIFICATE);

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTs
  );

  return res.json({ token });
});

export default router;
