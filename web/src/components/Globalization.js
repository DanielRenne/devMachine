const Globalization = {
    
  keys:{},
  load(keys){
      this.keys = keys;
  },
  get(){
      return this.keys;
  },
  report(){
      console.log(this.keys);
  }
}

export default Globalization;
