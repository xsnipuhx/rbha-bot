export default class Seconds {
  constructor(private seconds: number) {}

  valueOf() {
    return this.seconds
  }

  toPace() {
    return this.toTime() + '/mi'
  }

  toString() {
    return this.toTime()
  }

  toTime() {
    let secs = this.seconds
    let minutes = Math.floor(secs / 60);
    secs = Math.floor(secs%60);
    let hours = Math.floor(minutes/60)
    minutes = minutes%60;
    let result = "";
    if (hours > 0) {
      result += hours+":"+minutes.toString().padStart(2, '0');
    } else {
      result += minutes
    }
    result += ":"+secs.toString().padStart(2, '0')
    return result;
  }
}