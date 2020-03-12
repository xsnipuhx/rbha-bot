import { JsonProperty, Serializable } from 'typescript-json-serializer';

import {ArrayMaxSize} from 'class-validator'

const POINTS_PER_LEVEL = 30
const DEFAULT_WEEKLY_GOAL = 15

@Serializable()
export default class Profile {
  /** Strava OAuth refresh code, used to obtain an access code for API Authorization */
  @JsonProperty()
  points: number = 0;

  /** How many weeks in a row has the user hit the weekly goal */
  @JsonProperty()
  streak: number = 0;

  /** Log of activites recorded this week. Gets cleared out */
  @JsonProperty()
  activitiesThisWeek: ActivityMeta[] = [];

  /** Keeps track of how many points  */
  @JsonProperty()
  @ArrayMaxSize(8)
  weeklyPointHistory: number[] = [];

  @JsonProperty()
  weeklyPointGoal: number = DEFAULT_WEEKLY_GOAL;

  /** 
   * The user's current level 
   */
  get level() {
    return Math.floor(this.points / POINTS_PER_LEVEL);
  }

  /** 
   * How many points in the current level 
   */
  get pointsThisLevel() {
    return this.points % POINTS_PER_LEVEL;
  }

  /** 
   * Max amount of points per level 
   */
  get pointsPerLevel() {
    return POINTS_PER_LEVEL;
  }

  /** 
   * How many points this user has gotten this week 
   */
  get pointsThisWeek() {
    return this.activitiesThisWeek
      .reduce((count, activity) => (count + activity.points), 0)
  }

  addActivity(activity: ActivityMeta) {
    this.points += activity.points
    this.activitiesThisWeek.push(activity)
  }
}

interface ActivityMeta {
  name: string;
  points: number;
  timestamp: Date;
}