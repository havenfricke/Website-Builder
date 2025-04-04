import { makeAutoObservable, action } from "mobx";
import { propValidator } from "./Utils/PropValidator.js";


class ObservableAppState 
{

  // If data has a model, import with @type {import('./models/modelName.js').modelName} above the variables.
  // If single object is expected from the api, set the value to null. If array, set equal to array.
    pageArray = [];

    // Used for selecting from above data to reference a single object
    activePage = null;

  
  constructor() 
  {
    makeAutoObservable(this)
  }
}

export const AppState = new Proxy(new ObservableAppState(), {
  get(target, prop) {
    propValidator(target, prop)
    return target[prop]
  },
  set(target, prop, value) {
    propValidator(target, prop)
    action(() => {
      target[prop] = value
    })()
    return true
  }
})