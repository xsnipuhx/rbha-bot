export default class Athlete {
  /** Strava ID */
  id: string;

  /** Display username */
  username: string;

  /** Avatar image URL */
  profile: string;

  constructor(res: object) {
    Object.assign(this, res)
  }
}