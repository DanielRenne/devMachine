const Globals ={

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4();
  },

  typeof(o) {
    let typeInfo = "";
    if (o != null && o != undefined) {
      typeInfo = o.constructor.name; // returns Array, Boolean, Object, String, etc...
    } else if (o === null) {
      typeInfo = "Null";
    } else if (o === undefined) {
      typeInfo = "Undefined";
    }
    return typeInfo;
  }

}

export default Globals;