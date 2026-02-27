import { registerAs } from "@nestjs/config";

export default registerAs('strava', () => ({
  clientId: process.env.STRAVA_CLIENT_ID,
  clientSecret: process.env.STRAVA_CLIENT_SECRET,
  redirectUri: process.env.STRAVA_REDIRECT_URI,
  webhookVerifyToken: process.env.STRAVA_WEBHOOK_VERIFY_TOKEN,

  tokenUrl: 'https://www.strava.com/oauth/token',
  authorizeUrl: 'https://www.strava.com/oauth/authorize',
  deauthorizeUrl: 'https://www.strava.com/oauth/deauthorize',
  apiBaseUrl: 'https://www.strava.com/api/v3',
  webhookUrl: 'https://www.strava.com/api/v3/push_subscriptions'
}))