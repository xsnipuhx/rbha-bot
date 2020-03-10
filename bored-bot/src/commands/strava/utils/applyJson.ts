/**
 * Will set JSON to a class instance, filtering out props the class doesn't have
 * 
 * @param self Class to apply json to
 * @param json Json to set
 */
export default function applyJson(self: any, json: object) {
  for (let key in json) {
    if (self.hasOwnProperty[key]) {
      self[key] = json[key];
    }
  }
}