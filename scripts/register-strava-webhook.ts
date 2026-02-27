import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const CALLBACK_URL = process.env.DEV_STRAVA_WEBHOOK_CALLBACK_URL

async function register() {
  if (!CALLBACK_URL) {
    console.error(`❌ Missing [DEV_]STRAVA_WEBHOOK_CALLBACK_URL in .env`)
    process.exit(1)
  }

  console.log(`Registering Strava webhook...`)
  console.log(`Callback URL: ${CALLBACK_URL}`)

  try {
    const { data } = await axios.post(
      `https://www.strava.com/api/v3/push_subscriptions`,
      {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        verify_token: process.env.STRAVA_WEBHOOK_VERIFY_TOKEN,
        callback_url: CALLBACK_URL
      }
    )

    console.log('✅ Webhook registered successfully!')
    console.log(`Subscription ID: ${data.id}`)
    // Ne sert pas pour l'instant. le subscription_id sert à gérer la subscription (consulter, supprimer). 
    console.log(`[Helper]: Save this ID in .env as [DEV_]STRAVA_WEBHOOK_SUBSCRIPTION_ID=${data.id}`)
  
  } catch (e) {
    console.error(`❌ Registration failed:`, e?.response?.data ?? e.message)
    console.error(`[Helper]: Common causes: server not reachable at the callback URL, a subscription already exists for this Strava app, invalid client_id or client_secret`)
  }
}

register()