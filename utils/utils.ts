export default class Utils {
  constructor() {}

  compareStringArrayElements(array1: Array<String>, array2: Array<String>) {
    for (let i = 0; i < array1.length; i++) {
      if (array2.includes(array1[i])) {
        return true; // If it finds a match, it returns true
      }
    }
    return false; // If no match is found, it returns false
  }
}
