export default class ActivityStream {
  /** Heartrate samples */
  heartrate: number[];

  /** Distance samples */
  distance: number[];

  /** Time samples, in seconds */
  time: number[];

  constructor(json) {
    this.heartrate = json.heartrate.data
    this.distance = json.distance.data
    this.time = json.time.data
  }

  get length() {
    return this.time.length;
  }

  getSample(idx: number) {
    return {
      heartrate: this.heartrate[idx],
      distance: this.distance[idx],
      time: this.time[idx]
    }
  }
}