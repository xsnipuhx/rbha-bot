import { ResponseChain, Wretcher } from 'wretch';
import {StravaRequester, request} from './request';

import Activity from './models/Activity';
import Athlete from './models/Athlete';
import Debug from 'debug';
import User from "../db/User";
import Zones from './models/Zones';

const debug = Debug(`strava:client`)

export default class StravaClient {
  private user: User;
  private api: Wretcher;

  constructor(user: User) {
    this.user = user;
    this.api = request(user)
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
   * Get a breakdown of HR zones
   */
  getHRZones() {
    debug('getAthleteHRZones()')
    
    return this.api
      .url('/athlete/zones')
      .get()
      .json(res => new Zones(res))
  }

  getActivity(activityId: string) {
    debug('getActivity()')
    
    return this.api
      .url(`/activities/${activityId}`)
      .get()
      .json(res => new Activity(res))    
  }

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