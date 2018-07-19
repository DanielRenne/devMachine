const Globals ={

  serverPort() {
    return "8080";
  },

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
  },

  post(apiParams) {

    var url = new URL(window.location.protocol + "//" + window.location.hostname + ":" + this.serverPort() + "/apiPOST");
    var params = {controller:apiParams.controller, 
                  action:(apiParams.action === undefined) ? "" : apiParams.action};
    url.search = new URLSearchParams(params);

    fetch(url, {
      method:"post",
      body: JSON.stringify(apiParams.state)
    }).then((response) => {

        var contentType = response.headers.get("content-type");
        if(contentType && contentType.includes("application/json") && response.ok) {
            return response.json();
        }

        throw new TypeError("application/json was not returned in API POST");
    })
    .then((json) => {
      if (apiParams.callback !== undefined) {
        apiParams.callback(json);
      }
    })
    .catch((error) => { console.log(error); });
  }

}

export default Globals;