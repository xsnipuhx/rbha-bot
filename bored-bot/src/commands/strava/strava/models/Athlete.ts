import applyJson from '../../utils/applyJson'

export default class Athlete {
  /** Strava ID */
  id: string;

  /** Display username */
  username: string;

  /** Avatar image URL */
  profile: string;

  constructor(res: object) {
    applyJson(this, res)
  }
}