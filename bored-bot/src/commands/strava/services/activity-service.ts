import Zones, {Intensity} from '../strava/models/Zones'

import Activity from '../strava/models/Activity';
import ActivityStream from '../strava/models/ActivityStream'
import Seconds from '../strava/units/Seconds';
import StravaClient from '../strava/StravaClient'
import User from '../db/User'

/**
 * Fetch heart rate data from activity and user, and calculate the heart rate zones
 * 
 * @param user 
 * @param activity 
 */

export async function fetchTimeInZones(user: User, activity: Activity) {
  const client = new StravaClient(user)

  const [zones, stream] = await Promise.all([
    client.getHRZones(),
    client.getActivityStreams(activity.id)
  ])

  return calculateTimeInZones(zones, stream)
}

/**
 * Get how long the user has spent in each intensity zone
 * 
 * @param zones
 * @param stream
 */

export function calculateTimeInZones(zones: Zones, stream: ActivityStream) {
  // How many seconds spent in active or hard time
  let activeTime = 0;
  let hardTime = 0;

  for (var i = 1; i < stream.length; i++) {
    // Get previous tick data
    const prevSample = stream.getSample(i - 1);
    // Current heartrate and time
    const { heartrate, time } = stream.getSample(i);
    // How long since last index
    const secondsDiff = time - prevSample.time;
    // Categorize the heartrate to an intensity level
    const intensity = zones.getIntensity(heartrate)

    if (intensity === Intensity.active) activeTime += secondsDiff
    else if (intensity === Intensity.hard) hardTime += secondsDiff
  }

  return {
    active: new Seconds(activeTime),
    hard: new Seconds(hardTime)
  }
}