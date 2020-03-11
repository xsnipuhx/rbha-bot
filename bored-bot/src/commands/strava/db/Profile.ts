import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export default class Profile {
  /** Strava OAuth refresh code, used to obtain an access code for API Authorization */
  @JsonProperty()
  points: number = 0;
}