import {pipe} from "fp-ts/function";
import * as O from "fp-ts/Option";
import {HRData, Workout} from "../Workout";
import * as Units from "../Units";

const base: Workout = {
  id: 123,
  type: "Workout",
  title: "My Workout",
  description: "",
  private: false,
  started: "2021-02-12T19:46:33.319Z",
  elapsed: Units.seconds(0),
  gps: O.none,
  heartrate: O.none
};

export default function WorkoutBuilder(workout = base) {
  const extend = (partial: Partial<Workout>) => WorkoutBuilder({...workout, ...partial});

  return {
    setDuration(seconds: number) {
      return extend({
        elapsed: Units.seconds(seconds)
      })
    },

    withGPS(distance = 1000, elevation = 100, averageSpeed = 2.5) {
      return extend({
        gps: O.some({
          distance: Units.meters(distance),
          elevation: Units.meters(elevation),
          averageSpeed: Units.metersPerSecond(averageSpeed)
        })
      })
    },

    withHR(max = 190, average = 140) {
      return extend({
        heartrate: O.some({
          average,
          max,
          stream: []
        })
      });
    },

    addHRSample(bpm: number, seconds: number) {
      const heartrate = pipe(
        workout.heartrate,
        O.alt(() => O.some<HRData>({average: 0, max: 0, stream: []})),
        O.map(hr => ({
          ...hr,
          stream: hr.stream.concat({bpm, seconds})
        }))
      );

      return extend({heartrate});
    },

    build() {
      return workout;
    }
  }
}