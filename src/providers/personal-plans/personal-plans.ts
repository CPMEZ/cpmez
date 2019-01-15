// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import CryptoJS from 'crypto-js';

import { LocalStoreProvider } from '../local-store/local-store';

const STORAGE_KEY = 'plans';  
// user local data encrypted with shared key
const LOCAL_ENCRYPT_KEY = 'I smell the blood of a British man';  // King Lear, Act 3, scene 4, W. Shakespeare

@Injectable()
export class PersonalPlansProvider {
  plans: {}[] = [];
  listSelection: any;  // used by merge, add-plan pages

  constructor(
    public events: Events,
    private LSP: LocalStoreProvider) {
    console.log('Constructor PersonalPlansProvider Provider');
  }

  local: {};

  loadPlans() {
    // clear out plans before reading,
    //    in case new user has signed in
    this.initPlans();
    // get the local copy
    this.loadPlansLocal();
  }

  // add new plan
  addPlan(np: any, type: string) {
    // initialize the plan structure for a new one
    let newPlan: any;
    if (type === 'empty') {
      newPlan = { name: np.name, text: np.text, created: "", updated: "", problems: [] };
    } else { // type==='guided'
      newPlan = this.deepCopy(GUIDED_PLAN);
      newPlan.name = np.name;
      newPlan.text = np.text;
    }
    const d: Date = new Date();
    newPlan.created = d.toLocaleDateString();
    newPlan.updated = d.toLocaleDateString();
    // if (!this.plans) { this.initPlans(); }
    this.plans.push(newPlan);
    // console.log(this.plans);
    this.write();
  }

   mergePlans(targetPlan: any, sourcePlan: any): any {
    if (targetPlan["problems"]) {
      sourcePlan["problems"].forEach(p => {
        let found = false;
        for (var i = 0; i < targetPlan.problems.length; i++) {
          // is a problem from the newly-added content already in the plan?
          if (targetPlan.problems[i].text === p["text"]) {
            found = true;
            // these lines will cause problem to which we've added to be expanded
            p["icon"] = "arrow-dropdown";
            p["expanded"] = true;
            // add all the goals and interventions to the existing problem
            // console.log("goals");
            this.addUndupItems(p["goals"], "text", targetPlan.problems[i].goals);
            // console.log("interventions");
            this.addUndupItems(p["interventions"], "text", targetPlan.problems[i].interventions);
            break;  // no need to look further
          }
        }
        if (!found) {  // never found it, add the whole problem
          // console.log('not found, whole problem');
          p["icon"] = "arrow-dropdown";
          p["expanded"] = true;
          var t = this.deepCopy(p);
          // console.log(t);
          targetPlan.problems.push(t);
        }
      })
    } else {  // no problems in the target, add 'em
      sourcePlan["problems"].forEach(p => {
        p["icon"] = "arrow-dropdown";
        p["expanded"] = true;
      });
      targetPlan["problems"] = this.deepCopy(sourcePlan["problems"]);
      // console.log('after merge', targetPlan["problems"]);
    }
  }

  addUndupItems(source: Array<object>, element: string, target: Array<object>) {
    // console.log('addUndupItems');
    // only insert items not already found
    var work = source;
    var found;
    for (var i = 0; i < target.length; i++) {
      found = undefined;
      for (var j = 0; j < work.length; j++) {
        if (work[j][element] == target[i][element]) {
          found = j;
        }
      }
      if (found < work.length) {
        // remove from working array
        work.splice(found, 1);
      }
    };
    // now add the remaining, those not duplicate/removed
    if (work.length > 0) {
      for (var k = 0; k < work.length; k++) {
        target.push(this.deepCopy(work[k]));
      }
    }
  }

  deletePlan(plan) {
    // remove the designated plan from plans
    var index: number = this.plans.indexOf(plan, 0);
    if (index > -1) {
      this.plans.splice(index, 1);
    }
    // console.log(this.plans);
    this.write();
  };

  initPlans(): void {
    // create an empty plans array
    this.plans = [];
  }

  listPlans(): any {
    return this.plans;
  }

  // reading/writing plans section  ===================
  loadPlansLocal() {
    this.local = {};  // init/re-init first
    this.readFromLocal()
      .then((data: any) => {
        // console.log(data);
        this.local = JSON.parse(data);
        this.plans = this.local["plans"];
        if (typeof this.local !== "object") {
          this.local = { plans: [] };
          this.plans = this.local["plans"];
        }
        this.events.publish('loadComplete', Date.now());
      })
      .catch((error: any) => {
        console.log('loadPlansLocal error', error);
        this.local = { plans: [] };  // create an empty
        this.plans = this.local["plans"];
        this.events.publish('loadComplete', Date.now());
      });
  }


  write() {
    console.log('writing');
    this.saveToLocal();

  }

  saveToLocal(): void {
    // console.log("saveToLocal");
    let p = this.packagePlans();
    p = this.encrypt(p, LOCAL_ENCRYPT_KEY);
    const userStorageKey = STORAGE_KEY;
    this.LSP.set(userStorageKey, p)
      .then(result => console.log("saved local"))
      .catch(e => console.log("error: " + e));
  }

  readFromLocal(): Promise<object> {
    return new Promise(resolve => {
      const userStorageKey = STORAGE_KEY;
      this.LSP.get(userStorageKey)
        .then((data) => {
          // console.log('read local with', userStorageKey);
          // console.log(data);
          if (data) {
            resolve(this.decrypt(data, LOCAL_ENCRYPT_KEY))
          } else {
            console.log('read nothing local, resolving empty plans');
            resolve({ plans: [] });
          }
        });
      // .catch(e => reject => console.log("error: " + e));
    })
  }

  packagePlans(): string {
    let p: string;
    p = '{ "lastWrite": ' + Date.now().valueOf() + ',';
    p += ' "plans": '
    p += JSON.stringify(this.plans);
    p += '}';
    return p;
  }

  encrypt(data: {}, key: string): string {
    // console.log("encrypting");
    // console.log('key', key);
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  }

  decrypt(data: string, key: string): {} {
    // console.log('decrypting');
    // console.log('key', key);
    let bytes = CryptoJS.AES.decrypt(data, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  checkPlanName(name: string): boolean {
    // see if the name's already in use
    var canUseName: boolean = true;
    this.plans.forEach(p => {
      if (p["name"].trim() == name) {
        canUseName = false;
      }
    });
    return canUseName;
  }

  // helper
  deepCopy(obj) {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.deepCopy(obj[i]);
      }
      return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
      }
      return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }
}

// pre-defined outline/starter plan
const GUIDED_PLAN = {
  name: "",
  text: "Guided Starter Plan",
  created: "",
  updated: "",
  problems: [
    {
      text: "General Observation/Assessment",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Teaching, Training & Coaching",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Comfort Care/Symptom Control",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Safety & Mobility",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Emotional/Spiritual",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Skin Care",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Hydration/Nutrition/Elimination",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Therapeutic/Medication",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Care Coordination/Discharge",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Other Considerations",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    }
  ]
}
