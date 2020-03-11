import wretch, { Wretcher } from 'wretch';

import Activity from './models/Activity';
import Athlete from './models/Athlete';
import Debug from 'debug';
import User from "../db/User";
import Zones from './models/Zones';
import {authTokenMiddleware} from './api/authTokenMiddleware';

const debug = Debug(`strava:client`)

/**
 * Interaction with the strava Rest API
 */
export default class StravaClient {
  /** Wretch instance ready with auth */
  private api: Wretcher;

  constructor(user: User) {
    this.api = wretch()
      .middlewares([ authTokenMiddleware({ user }) ])
      .url('https://www.strava.com/api/v3/')
  }

  /** 
   * Get basic Athlete information 
   **/

  getProfile() {
    debug('getProfile()')
    
    return this.api
      .url('/athlete')
      .get()
      .json(res => new Athlete(res))
  }

  /**
   * Get a breakdown of HR zones for a user
   */

  getHRZones() {
    debug('getAthleteHRZones()')
    
    return this.api
      .url('/athlete/zones')
      .get()
      .json(res => new Zones(res))
  }

  /**
   * Get a specific activity by ID
   * 
   * @param activityId 
   */

  getActivity(activityId: string) {
    debug('getActivity()')
    
    return this.api
      .url(`/activities/${activityId}`)
      .get()
      .json(res => new Activity(res))    
  } 

  /** 
   * Get heartrate data from an activity
   * 
   * @param activityId
  */
 
  getActivityHeartrate(activityId: string) {
    debug('getActivityHeartrate()')
    
    return this.api
      .url(`/activities/${activityId}/streams`)
      .query({
        keys: "heartrate,time",
        key_by_type: true
      })
      .get()
      .json() 
  }
}