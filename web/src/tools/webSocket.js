import Globals from './globals'

const WSocket = {
  path:"ws",
  port:Globals.serverPort(),
  domain:window.location.hostname,
  socket:null,
  socketCallBacks:[],
  webSocketCallbacks:[],
  currentCallBackId:0,
  hasConnected:false,
  closedExplicitly:false,
  pollingInterval:30000,
  pollTimeout:0,
  pollingIntervalId:0,
  onOpen:undefined,
  onClosed:undefined,

  setPollingInterval(interval) {
    this.pollingInterval = interval;
    clearInterval(this.pollingIntervalId);
    this.pollSocket();
  },

  pollSocket() {
    this.pollingIntervalId = setInterval(() => {
      this.sendPollMessage();
    }, this.pollingInterval);
  },

  registerSocketCallback(callback, subscription) {
    var id = Globals.guid();
    this.webSocketCallbacks.push({id:id, callback: callback, sub:subscription});
    return id;
  },

  unRegisterSocketCallback(id) {
    for (var i = 0; i < this.webSocketCallbacks.length; i++) {
      var s = this.webSocketCallbacks[i];
      if (s.id == id) {
        this.webSocketCallbacks.splice(i, 1);
        i--;
      }
    }
  },

  onMessage(jsonObj, pub) {
    this.webSocketCallbacks.forEach((item) => {
      if (item.sub == "" && pub == "*") {
        item.callback(jsonObj, pub);
        return;
      }
      if (item.sub == pub || item.sub == "*") {
        item.callback(jsonObj, pub);
        return;
      }
    });
  },

  connect() {
    try{

      if(this.hasConnected) {
        return;
      }

      var protocol = (window.location.protocol == "https:") ? "wss://" : "ws://";
      var host = protocol + this.domain + ":" + this.port + "/" + this.path;
      if ("WebSocket" in window) {
        this.socket = new WebSocket(host);
      }
      if ("MozWebSocket" in window) {
        this.socket = new MozWebSocket(host);
      }

      this.socket.onopen = () => {
        clearTimeout(this.pollTimeout);
        if (this.onOpen !== undefined) {
          this.onOpen.call();
        }
      };

      this.socket.onmessage = (msg) => {
        try {
          var jsonObj = JSON.parse(msg.data);
          if(jsonObj.callBackId != undefined){
            for(var i = 0; i < this.socketCallBacks.length; i++){
              var scb = this.socketCallBacks[i];
              if(scb.callBackId == jsonObj.callBackId){
                if(jsonObj.error != undefined){
                  if(scb.errorCallBack != undefined)
                    scb.errorCallBack(jsonObj.error);
                }
                else{
                  if(scb.messageCallBack != undefined)
                    scb.messageCallBack(jsonObj.data, jsonObj.pub);
                }
                if(!scb.multipleCallbacks)
                  this.socketCallBacks.splice(i, 1);
                if(jsonObj.endCallBacks != undefined)
                  this.socketCallBacks.splice(i, 1);
                return;
              }
            }
          }
          else {  //handle publications from server.
            if (jsonObj.Key != undefined) {
              this.onMessage(jsonObj.Content, jsonObj.Key);
            } else {
              this.onMessage(jsonObj, "*");
            }
          }
        } catch (e) {
          console.warn("Websocket error", e)
        }
      };

      this.socket.onclose = () => {
        try {
          clearTimeout(this.pollTimeout);
          if (this.onClose !== undefined) {
            this.onClose.call();
          }
        } catch (e) {
          console.warn("Websocket error", e)
        }
      }

      if(!this.hasConnected) {
        setInterval(() => {
          this.checkConnection();
        }, 3000);

        // this.pollSocket();

      }
      this.hasConnected = true;

    }
    catch(ex){
      console.error("Failed at WSocket connect:", ex);
    }
  },

  sendPollMessage() {
    if (this.socket.readyState == 1) { //Send a message for socket timeouts

      var timeout = 0;
      var responseSet = false;
      this.send({}, (data) => {
        responseSet = true;
        clearTimeout(this.pollTimeout);
        this.onOpen.call();
      });
      setTimeout(() => {
        if (responseSet === true) {
          return;
        }
        this.send({}, (data) => {
          responseSet = true;
          clearTimeout(this.pollTimeout);
          this.onOpen.call();
        });
      }, 1000);
      setTimeout(() => {
        if (responseSet === true) {
          return;
        }
        this.send({}, (data) => {
          
          clearTimeout(this.pollTimeout);
          this.onOpen.call();
        });
      }, 2000);
      this.pollTimeout = setTimeout(() => {
        this.socket.close();
        if (this.onClose !== undefined) {
          this.onClose.call();
        }
      }, 4000);
    }
  },

  checkConnection() {
    if (this.closedExplicitly == true) {
      return;
    }

    if (this.socket == null || this.socket == undefined) {
        this.connect();
        return;
    }
    if (this.socket.readyState == 1 || this.socket.readyState == 0) {  //Connecting or Open simply return.
      return;
    }
    this.connect();
  },

  close() {
    this.closedExplicitly = true;
    this.socket.close();

  },

  apiRequest(obj) {

    let response = (data) => {
      if (obj.callback != undefined) {
        obj.callback(data);
      }
    }

    this.send(obj, response, obj.error, obj.onTimeout, obj.timeout, obj.multiCallback);
  },

  send(data, onMessage, onError, onTimeout, timeoutSeconds, multipleCallbacks){
    try{

      if (this.socket.readyState == 2 || this.socket.readyState == 3) {
        return
      }

      this.currentCallBackId++;
      if(this.currentCallBackId == Number.MAX_VALUE) {
        this.currentCallBackId = 1;
      }
      var callBackId = this.currentCallBackId;
      var mcb = false;
      if(multipleCallbacks != undefined) {
        mcb = multipleCallbacks;
      }
      var obj = {callBackId : this.currentCallBackId, data : data};
      this.socketCallBacks.push({callBackId: callBackId, messageCallBack: onMessage, errorCallBack: onError, multipleCallbacks: mcb});
      this.socket.send(JSON.stringify(obj));
      if(onTimeout != undefined || onTimeout != null){
        setTimeout(() => {
          for(var i = 0; i < this.socketCallBacks.length; i++){
            var scb = this.socketCallBacks[i];
            if(scb.callBackId == callBackId){
              this.socketCallBacks.splice(i, 1);
              if(this.onTimeout != undefined)
                this.onTimeout.call();
              return;
            }
          }
        }, timeoutSeconds);
      }
    }
    catch(ex){
      if(onError != undefined)
        onError.call(ex);
    }
  }

}

export default WSocket;
