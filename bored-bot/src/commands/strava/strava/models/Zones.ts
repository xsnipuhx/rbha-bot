export default class Zones {
  /** Strava ID */
  zones: HRZone[];

  constructor(res: any) {
    this.zones = res.heart_rate.zones;
  }

  /**
   * Get which zone the heart rate falls into
   * 
   * @param hr Heart Rate
   */

  getZone(hr: number) {
    for (let i = 0; i < this.zones.length; i++) {
      const zone = this.zones[i]
      if (zone.min < hr && hr <= zone.max) return i
    }
    return this.zones.length - 1
  }

  /**
   * Assign the heart rate to an intensity level based off zones
   * 
   * @param hr Heart Rate
   */
  
  getIntensity(hr: number) {
    const zone = this.getZone(hr)
    if (zone === 0) return Intensity.none
    if (zone < 3) return Intensity.active
    return Intensity.hard
  }
}

export enum Intensity {
  none = 'none',
  active = 'active',
  hard = 'hard'
}

interface HRZone {
  min: number;
  max: number;
}