/**
 * Will set JSON to a class instance, filtering out props the class doesn't have
 * 
 * @param self Class to apply json to
 * @param json Json to set
 */
export default function applyJson(self: any, json: object) {
  for (let key in json) {
    console.log("self", self.hasOwnProperty[key])
    if (self.members.includes(key)) {
      self[key] = json[key];
    }
  }
}