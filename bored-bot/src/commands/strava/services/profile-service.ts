import * as ActivityService from '../services/activity-service'

import Activity from "../strava/models/Activity";
import StravaClient from '../strava/StravaClient'
import User from "../db/User";

/** Multiplier for hard activity minutes */
const HARD_BONUS = 2;

/**
 * Add an activity to a user's profile.
 * Calculate points and XP level
 * 
 * @param user 
 * @param activity 
 */

export async function addActivityEffort(user: User, activity: Activity) {
  const points = await getEffortPoints(user, activity);
  const prevLevel = user.profile.level

  user.profile.addActivity({
    name: activity.name,
    points: points.total,
    timestamp: new Date()
  })

  await user.save()

  const leveledUp = prevLevel < user.profile.level
  return { ...points, leveledUp }
}

/**
 * Calculate how many active and hard points to give for an activity
 * 
 * @param user 
 * @param activity 
 */

async function getEffortPoints(user: User, activity: Activity) {
  if (!activity.has_heartrate) {
    // If no heart rate, treat the entire activity as regular active
    return calcPoints(activity.moving_time.valueOf(), 0)
  } else {
    const {active, hard} = await ActivityService.fetchTimeInZones(user, activity)
    
    return calcPoints(active.valueOf(), hard.valueOf())
  }
}

/**
 * Calculate how many points based off heart rate zones
 * 
 * @param activeSeconds How long in the active zone
 * @param hardSeconds How long in the hard zone
 */

function calcPoints(activeSeconds: number, hardSeconds: number) {
  const active = secondsToPoints(activeSeconds)
  const hard = secondsToPoints(hardSeconds) * HARD_BONUS

  return {
    active, hard,
    total: active + hard
  }
}

/**
 * Converts seconds of intensity to a number of points
 * 
 * @param seconds How many seconds
 */
function secondsToPoints(seconds: number) {
  // 10 minutes = 1 point
  const points = seconds.valueOf() * (1/600)
  // Round to nearest tenth
  return Math.floor(points * 10) / 10
}