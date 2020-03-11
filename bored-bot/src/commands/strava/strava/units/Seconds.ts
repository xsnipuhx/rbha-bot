export default class Seconds {
  constructor(private seconds: number) {}

  hhmmss() {
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

  valueOf() {
    return this.seconds
  }

  toString() {
    return this.seconds
  }
}