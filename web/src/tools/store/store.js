import WSocket from '../webSocket'
import Globals from '../globals'

const Store = {
  subscriptions:[],
  appName:"demo",
  retryInterval:3000,
  setValues:{},
  respondedValues:{},

  init() {
    WSocket.registerSocketCallback((data, collection) => {
      this.processServerChanges(data);
    }, "Store");
  },

  processServerChanges (data) {

    if (data.Id === undefined) {
      return;
    }

    delete this.setValues[data.Collection + data.Id + data.Path];

    for (var i = 0; i < this.subscriptions.length; i++) {
      var entry = this.subscriptions[i];
      if (entry.collection === data.Collection) {
        //if the data.Path is not set that means that the collection was updated.
        if ((entry.id === "" && entry.path === "") && (data.Path === undefined || data.Path === "")) {
          let update = {
            changeType: "Add",
            value: data.Value
          };
          if (data.Value === null) {
            update.changeType = "Delete";
            update.value = data.Id;
          }
          entry.callback(update);
          continue;
        }

        if (entry.id === data.Id && entry.path === data.Path || (entry.id === data.Id && entry.path === "*")) {
          if (entry.path === "*") {
            entry.callback({changeType: "Modify", path: data.Path, value: data.Value});
          } else {
            entry.callback(data.Value);
          }
          continue;
        }
      }
    }
  },

  registerAll(obj) {

    let registrations = [];
    if (this.typeof(obj) !== "Array") {
      let keys = Object.keys(obj);
      if (keys.length > 0) {
        keys.forEach((kk) => {
          registrations.push(obj[kk]);
        });
      }
    } else {
      registrations = obj;
    }

    registrations.forEach((r) => {
      let run = true;
      if (!r.hasOwnProperty("sub")) {
        r.sub = null;
      }
      if (!r.hasOwnProperty("path")) {
        window.alert("You are missing the path in on subscription in your component");
        run = false;
      }
      if (run) {
        let params = {};

        if (!r.hasOwnProperty("collection")) {
          params.collection = this.appName;
        } else {
          params.collection = r.collection;
        }
        if (!r.hasOwnProperty("id")) {
          params.id = "";
        } else {
          params.id = r.id;
        }
        if (!r.hasOwnProperty("fetch")) {
          params.fetch = false;
        } else {
          params.fetch = r.fetch;
        }
        params.path = r.path;
        params.callback = r.callback;
        r.sub = this.subscribe(params.collection, params.id, params.path, params.callback, params.fetch);
      }
    });
  },


  unsubscribeAll(obj) {
    if (this.typeof(obj) === "Array") {
      if (obj.length > 0) {
        obj.forEach((r) => {
          this.unsubscribe(r.sub);
        });
      }
    } else {
      let keys = Object.keys(obj);
      if (keys.length > 0) {
        keys.forEach((kk) => {
          this.unsubscribe(obj[kk].sub);
        });
      }
    }
  },

  typeof(o) {
    let typeInfo = "";
    if (o !== null && o !== undefined) {
      typeInfo = o.constructor.name; // returns Array, Boolean, Object, String, etc...
    } else if (o === null) {
      typeInfo = "Null";
    } else if (o === undefined) {
      typeInfo = "Undefined";
    }
    return typeInfo;
  },



  // collection - mongo db collection name
  // id - bson id of the collection row
  // path - fieldname.fieldname.fieldname....
  // callback - callback after the register is complete, passes (data)
  // fetch - boolean to just pull the registration once
  dbRegister(collection, id, path, callback, fetch) {
    return {
      collection: collection,
      id: id,
      path: path,
      callback: callback,
      fetch: fetch
    };
  },

  // path - fieldname.fieldname.fieldname....
  // callback - callback after the register is complete, passes (data)
  // fetch - boolean to just pull the registration once
  appRegister(path, callback, fetch) {
    return {
      path: path,
      callback: callback,
      fetch: fetch
    };
  },

  appSubscribe(path, callback, fetch) {
    return this.subscribe(this.appName, "", path, callback, fetch);
  },

  appGet(path, callback) {
    this.getByPath({collection:this.appName, id: "", path:  path}, callback);
  },

  appCall(path, object, callback) {
    this.set(this.appName, "", path, object, callback);
  },

  appSet(path, object, callback) {
    this.set(this.appName, "", path, object, callback);
  },

  get(payload, callback, retryInterval = this.retryInterval, retryMax = 10) {

    var timeout;
    let cb = (data) => {
      callback(data);
      clearInterval(timeout);
    };

    let call = () => {
      WSocket.apiRequest({controller:"StoreController",
                              action:"Get",
                              state:{ Collection:payload.collection,
                                      Id:payload.id,
                                      Joins:(payload.joins) ? payload.joins :[]},
                              callback:cb});
    };

    call();

    if (callback !== undefined) {
      let count = 0;
      timeout = setInterval(() => {
        count++;
        if (count > retryMax) {
          clearInterval(timeout);
          return;
        }
        call();
      }, retryInterval);
    }
  },

  getByFilter(payload, callback, retryInterval = this.retryInterval, retryMax = 10) {

    var timeout;
    let cb = (data) => {
      callback(data);
      clearInterval(timeout);
    };

    let call = () => {
    WSocket.apiRequest({controller:"StoreController",
                            action:"GetByFilter",
                            state:{ Collection:payload.collection,
                                    Joins:(payload.joins !== undefined) ? payload.joins :[],
                                    Filter:(payload.filter !== undefined) ? payload.filter : {},
                                    InFilter:(payload.inFilter !== undefined) ? payload.inFilter : {},
                                    ExcludeFilter:(payload.excludeFilter !== undefined) ? payload.excludeFilter : {}},
                            callback:cb});
    };

    call();

    if (callback !== undefined) {
      let count = 0;
      timeout = setInterval(() => {
        count++;
        if (count > retryMax) {
          clearInterval(timeout);
          return;
        }
        call();
      }, retryInterval);
    }
  },

  getByPath(payload, callback, retryInterval = this.retryInterval, retryMax = 10) {

    var timeout;
    let cb = (data) => {
      callback(data);
      clearInterval(timeout);
    };

    let call = () => {

    WSocket.apiRequest({controller:"StoreController",
                            action:"GetByPath",
                            state:{ Collection:payload.collection,
                                    Id:payload.id,
                                    Joins:(payload.joins) ? payload.joins :[],
                                    Path:payload.path},
                            callback:cb});
    };

    call();

    if (callback !== undefined) {
      let count = 0;
      timeout = setInterval(() => {
        count++;
        if (count > retryMax) {
          clearInterval(timeout);
          return;
        }
        call();
      }, retryInterval);
    }
  },

  getByAction(action, payload, callback, retryInterval = this.retryInterval, retryMax = 10) {

    var timeout;
    let cb = (data) => {
      callback(data);
      clearInterval(timeout);
    };

    let call = () => {

    WSocket.apiRequest({controller:"StoreController",
                            action:action,
                            state:{Collection:payload.collection,
                                   Id:payload.id,
                                   Joins:(payload.joins) ? payload.joins :[]},
                            callback:cb});
    };

    call();

    if (callback !== undefined) {
      let count = 0;
      timeout = setInterval(() => {
        count++;
        if (count > retryMax) {
          clearInterval(timeout);
          return;
        }
        call();
      }, retryInterval);
    }
  },

  set(collection, id, path, value, callback){

    let fullKey = collection + id + path;

    if (id != "") {
      this.setValues[fullKey] = value;
    }

    WSocket.apiRequest({controller:"StoreController", action:"Set", state:{Collection:collection, Id:id, Path:path, Value:value}, callback:(data) => {
      if (data != "" || data != null) {
        delete this.setValues[collection + id + path];
      }
      if (callback !== undefined) {
        callback(data);  
      }
    }});

    if (id != "") {
      var intervalId = this.setIntervalX((ending) => {

        if (ending) {
          delete this.setValues[fullKey]
        }

        if (this.setValues.hasOwnProperty(fullKey)) {
          this.publish(collection, id, path);
          console.log("Store set did not respond with results.  Republishing. . .", {collection:collection, id:id, path:path});
        } else {
          clearInterval(intervalId);
        }
      }, 300, 5);
    }
  },

  add(collection, value, callback) {
    WSocket.apiRequest({controller:"StoreController", action:"Add", state:{Collection:collection, Value:value}, callback:callback});
  },

  append(collection, id, path, value) {
    WSocket.apiRequest({controller:"StoreController", action:"Append", state:{Collection:collection, Id:id, Path:path, Value:value}});
  },

  remove(collection, id) {
    WSocket.apiRequest({controller:"StoreController", action:"Remove", state:{Collection:collection, Id:id}});
  },

  publish(collection, id, path, callback){
    WSocket.apiRequest({controller:"StoreController", action:"Publish", state:{Collection:collection, Id:id, Path:path}, callback:callback});
  },

  subscribe(collection, id, path, callback, fetch) {

      var uuid = Globals.guid();

      var entry = {collection:collection, id:id, path:path, callback:callback, uuid:uuid};
      if (Array.isArray(this.subscriptions)) {
          this.subscriptions.push(entry);
      }

      if (fetch === true) {
          this.getByPath({collection:collection, id:id, path:path}, callback);
      }

      return uuid;
  },

  unsubscribe(uuid) {
      for (var i = 0; i < this.subscriptions.length; i++) {
          var entry = this.subscriptions[i];
          if (entry.uuid === uuid) {
              this.subscriptions.splice(i, 1);
              return;
          }
      }
  },

  setIntervalX(callback, delay, repititions){
    var x = 0;
    var cb = callback;
    var reps = repititions;
    var intervalID = setInterval(function () {

       cb(false);

       if (++x === reps) {
           clearInterval(intervalID);
           cb(true);
       }
    }, delay);
    return intervalID;
  }

}

export default Store;