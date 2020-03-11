export default class Meters {
  constructor(private meters: number) {}

  toMiles() {
    return this.meters * 0.00062137;
  }

  toMilesString() {
    return this.toMiles().toFixed(2) + 'mi'
  }

  valueOf() {
    return this.meters
  }

  toString() {
    return this.toMilesString()
  }
}