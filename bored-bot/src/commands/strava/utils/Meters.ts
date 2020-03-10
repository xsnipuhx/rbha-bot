export default class Meters {
  constructor(private meters: number) {}

  toMiles() {
    return this.meters * 0.00062137;
  }

  valueOf() {
    return this.meters
  }

  toString() {
    return this.meters.toString()
  }
}