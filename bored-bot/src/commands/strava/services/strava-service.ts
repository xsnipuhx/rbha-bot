import StravaClient from '../strava/StravaClient'
import User from '../db/User'

/**
 * Returns an activity
 * 
 * @param stravaId Strava ID
 * @param activityId ID of activity
 */

export async function getActivityDetails(user: User, activityId: string) {
  const client = new StravaClient(user)
  return client.getActivity(activityId)
}

/**
 * Get strava profile details
 * 
 * @param stravaId Strava ID
 * @param activityId ID of activity
 */

export async function getProfile(user: User) {
  const client = new StravaClient(user)
  return client.getProfile()
}