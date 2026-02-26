export interface StravaTokenResponse {
  token_type: string
  expires_at: number
  expires_in: number
  refresh_token: string
  access_token: string
  athlete?: StravaAthleteProfile
}

export interface StravaAthleteProfile {
  id: number
  firstname: string
  lastname: string
  city: string
  country: string
  sex: string
  profile: string
  state: string
  summit: boolean
  created_at: string
}