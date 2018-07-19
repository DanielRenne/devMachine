/**
 * Created by Dan on 12/5/16.
 */
import React from 'react';
import Store from "./store"
import Globals from "../globals"
import PropTypes from 'prop-types';
import Loader from "./loader";
import MaterialTextField from '@material-ui/core/TextField';


class TextField extends React.Component {
  constructor(props) {
    super(props);
    this.validate = this.props.validate;
    this.formattedValue = this.props.formattedValue;
    this.state = {
      valueHidden: undefined,
      value: undefined,
      errorText:"",
      path: this.props.path,
      collection: this.props.collection,
      defaultValue: this.props.defaultValue,
      id: this.props.id,
      validateErrorMessage: this.props.validateErrorMessage,
      isNumber: this.props.isNumber,
    };

    this.changing = false;
    this.unmounted = false;
    this.errorTimeout;
    this.changingTimeout;
    this.originalValue;
  }

  componentWillReceiveProps(nextProps) {
    let updates = {};
    let resubscribe = false;
    this.validate = nextProps.validate;
    this.formattedValue = nextProps.formattedValue;
    if (this.state.id !== nextProps.id) {
      updates.id = nextProps.id;
      resubscribe = true;
    }
    if (this.state.defaultValue !== nextProps.defaultValue) {
      updates.defaultValue = nextProps.defaultValue;
    }
    if (this.state.path !== nextProps.path) {
      updates.path = nextProps.path;
      resubscribe = true;
    }
    if (this.state.collection !== nextProps.collection) {
      updates.collection = nextProps.collection;
      resubscribe = true;
    }
    if (this.state.validateErrorMessage !== nextProps.validateErrorMessage) {
      updates.validateErrorMessage = nextProps.validateErrorMessage;
    }
    if (this.state.isNumber !== nextProps.isNumber) {
      updates.isNumber = nextProps.isNumber;
    }
    if (Object.keys(updates).length > 0) {
      this.setState(updates, () => {
        if (resubscribe) {
          this.unsubscribe();
          this.subscribe();
        }
      });
    }
  }

  set(value) {
    Store.set(this.state.collection, this.state.id, this.state.path, value, () => {
      this.handleValueChange(value);
    });
  }

  unsubscribe() {
    Store.unsubscribe(this.subscriptionId);
    if (this.state.validateErrorMessage) {
      Store.unsubscribe(this.subscriptionErrorId);
    }
  }

  subscribe() {

    if (this.props.type !== undefined && this.props.type == "password") {  //Don't fetch Passwords.
      this.setState((state) => {
        state.value = "";
        return state;
      })
      return;
    }

    this.subscriptionId = Store.subscribe(this.state.collection, this.state.id, this.state.path,(data) => {this.handleValueChange(data)}, true)
    if (this.state.validateErrorMessage) {
      this.subscriptionErrorId = Store.subscribe(this.state.collection, this.state.id, "Errors." + this.state.path, (data) => {this.handleErrorValueChange(data)}, false);
    }
  }

  onStateChange() {
    let isZeroAndNumericWithDefault = this.state.defaultValue != undefined && this.state.defaultValue !== 0 && this.state.isNumber && this.state.value === 0;
    let isBlankAndStringWithDefault = this.state.defaultValue != undefined && this.state.defaultValue !== "" && !this.state.isNumber && this.state.value === "";
    if (isZeroAndNumericWithDefault || isBlankAndStringWithDefault) {
      this.state.value = this.state.defaultValue;
      Store.set(this.state.collection, this.state.id, this.state.path, this.state.value);
      this.base.setState((s) => {
        s.value = this.state.value;
        return s;
      })
    }
  }

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.unsubscribe();
  }

  handleValueChange(data) {

    if (this.props.type !== undefined && this.props.type == "password") {
      return;
    }

    if (this.unmounted) {
      return;
    }
    if (!this.unmounted) {
      this.props.onValue(data, this.state.collection, this.state.id,this.state.path);
    }
    if (data == null) {
      return;
    }
    if (this.changing) {
      return;
    }

    if (data != this.state.value) {
      this.originalValue = data;
      this.setState((state) => {
        if (Globals.typeof(this.formattedValue) == "Function") {
          let responseFormat = this.formattedValue(data);
          state.value = responseFormat.value;
          state.valueHidden = responseFormat.valueHidden;
        } else {
          state.value = data;
        }
        return state;
      }, () => this.onStateChange());
      window.setTimeout(() => {
        this.setState((state) => {
          state.errorText = "";
          return state;
        });
      }, 10000);
    }
  }

  handleErrorValueChange(data) {
    this.setState((state) => {
      state.errorText = data;
      return state;
    });
  }

  render() {
    let props = {};
    Object.keys(this.props).forEach((k) => {
      if (k !== "onBlur" && k !== "value" && k !== "errorText" && k !== "path" && k !== "collection" && k !== "id"  && k !== "validate" && k !== "validateErrorMessage" && k !== "changeOnBlur" && k !== "isNumber") {
        props[k] = this.props[k];
      }
    });


      return (
        <span>
            {this.state.value == undefined? <Loader/>: null}
            <span style={{display: this.state.value == undefined ? "none" : "block"}}>
              <MaterialTextField
                {...props}
                value={this.state.value != undefined ? this.state.value.toString(): this.state.value}
                onChange={(event) => {
                  clearTimeout(this.changingTimeout);

                  let value = event.target.value;
                  if (Globals.typeof(this.validate) == "Function") {
                    let response = this.validate(value);
                    if (!response.ok) {
                      if (response.hasOwnProperty("setState") && response.setState) {
                        this.setState({value:response.value});
                      }
                      this.handleErrorValueChange(response.errorMessage);
                      return
                    } else {
                      if (response.hasOwnProperty("value")) {
                        value = response.value;
                      }
                    }
                  }
                  if (this.state.isNumber === true) {
                    value = Number(event.target.value)
                    if (isNaN(value)) {
                      this.changing = false;
                      return;
                    }
                  }

                  if (Globals.typeof(this.formattedValue) == "Function") {
                    let responseFormat = this.formattedValue(value);
                    this.setState({value:responseFormat.value, errorText: "", valueHidden: responseFormat.valueHidden});
                    value = responseFormat.valueHidden;
                  } else {
                    this.setState({value:value, errorText: ""});
                  }
                  if (this.props.changeOnBlur === false) {
                    this.changing = true;
                    Store.set(this.state.collection, this.state.id, this.state.path, value);
                    this.changingTimeout = window.setTimeout(() => {
                      this.changing = false;
                    }, 1500);
                  }
                }}
                onBlur={(event) => {
                  if (this.props.changeOnBlur === false) {
                    this.onStateChange();
                    this.props.onBlur(value);
                    return;
                  }

                  let value = event.target.value;
                  if (Globals.typeof(this.validate) == "Function") {
                    let response = this.validate(value);
                    if (!response.ok) {
                      if (response.hasOwnProperty("setState") && response.setState) {
                        this.setState({value:response.value}, this.onStateChange);
                      }
                      this.handleErrorValueChange(response.errorMessage);
                      return
                    } else {
                      if (response.hasOwnProperty("value")) {
                        value = response.value;
                      }                      }
                  }
                  if (this.state.isNumber === true) {
                    value = Number(event.target.value)
                    if (isNaN(value)) {
                      return;
                    }
                  }

                  if (this.originalValue === value){
                    return;
                  } else {
                    this.originalValue = value;
                  }

                  if (Globals.typeof(this.formattedValue) == "Function") {
                    let responseFormat = this.formattedValue(value);
                    this.setState({value:responseFormat.value, errorText: "", valueHidden: responseFormat.valueHidden}, this.onStateChange);
                    value = responseFormat.valueHidden;
                  } else {
                    this.setState({value:value, errorText: ""}, this.onStateChange);
                  }

                  Store.set(this.state.collection, this.state.id, this.state.path, value, (data) => {
                    this.props.onBlur(value);
                    if (this.props.callback !== undefined) {
                      this.props.callback(data);
                    }
                  });
                }

                }
                errorText={this.state.errorText}
            />
          </span>
        </span>
      );
  }
}

TextField.propTypes = {
  collection:PropTypes.string,
  id:PropTypes.string,
  path:PropTypes.string,
  changeOnBlur:PropTypes.bool,
  onBlur:PropTypes.func,
  validate:PropTypes.func,
  defaultValue:PropTypes.string,
  formattedValue:PropTypes.func, // func will return {value: "visibleValue", valueHidden: "storedValue"}
  onValue:PropTypes.func,
  isNumber:PropTypes.bool,
  callback:PropTypes.func
};

TextField.defaultProps = {
  changeOnBlur: true,
  defaultValue: "",
  formattedValue: undefined,
  onValue: function() {},
  onBlur: function() {},
};

export default TextField;
