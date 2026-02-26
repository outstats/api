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

export enum StravaActivityType {
  // Running & Walking
  Run = "Run",
  TrailRun = "TrailRun",
  Walk = "Walk",
  Hike = "Hike",
  Wheelchair = "Wheelchair",
  VirtualRun = "VirtualRun",
  // Cycling
  Ride = "Ride",
  EBikeRide = "EBikeRide",
  VirtualRide = "VirtualRide",
  MountainBikeRide = "MountainBikeRide",
  EMountainBikeRide = "EMountainBikeRide",
  GravelRide = "GravelRide",
  Velomobile = "Velomobile",
  Handcycle = "Handcycle",
  // Water Sports
  Swim = "Swim",
  Canoeing = "Canoeing",
  Kayaking = "Kayaking",
  Rowing = "Rowing",
  VirtualRow = "VirtualRow",
  Surfing = "Surfing",
  Kitesurf = "Kitesurf",
  Windsurf = "Windsurf",
  Sail = "Sail",
  StandUpPaddling = "StandUpPaddling",
  // Winter Sports
  AlpineSki = "AlpineSki",
  BackcountrySki = "BackcountrySki",
  NordicSki = "NordicSki",
  RollerSki = "RollerSki",
  Snowboard = "Snowboard",
  Snowshoe = "Snowshoe",
  IceSkate = "IceSkate",
  // Fitness & Gym
  Workout = "Workout",
  WeightTraining = "WeightTraining",
  HighIntensityIntervalTraining = "HighIntensityIntervalTraining",
  Crossfit = "Crossfit",
  Yoga = "Yoga",
  Pilates = "Pilates",
  Elliptical = "Elliptical",
  StairStepper = "StairStepper",
  // Ball & Racket Sports
  Soccer = "Soccer",
  Basketball = "Basketball",
  Volleyball = "Volleyball",
  Tennis = "Tennis",
  TableTennis = "TableTennis",
  Badminton = "Badminton",
  Squash = "Squash",
  Racquetball = "Racquetball",
  Pickleball = "Pickleball",
  Padel = "Padel",
  Cricket = "Cricket",
  // Outdoor / Other
  RockClimbing = "RockClimbing",
  InlineSkate = "InlineSkate",
  Skateboard = "Skateboard",
  Golf = "Golf",
  Dance = "Dance"
}

export enum StravaActivityCategory {
  Run = 'run',
  Walk = 'hike',
  Ride = 'ride',
  Other = 'other'
}