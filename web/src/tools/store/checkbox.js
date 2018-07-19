/**
 * Created by Dan on 12/5/16.
 */
import React from 'react';
import Globals from "../globals"
import MaterialCheckbox from '@material-ui/core/Checkbox';
import Loader from "./loader";
import Store from "./store"
import PropTypes from 'prop-types';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.unmounted = false;
    this.validate = this.props.validate;
    this.integerBased = false;
    this.stringBased = false;
    this.booleanBased = false;
    this.state = {
      value: undefined,
      path: this.props.path,
      collection: this.props.collection,
      id: this.props.id,
    }
  }

  componentWillReceiveProps(nextProps) {
    let updates = {};
    let resubscribe = false;
    this.validate = nextProps.validate;
    if (this.state.id !== nextProps.id) {
      updates.id = nextProps.id;
      resubscribe = true;
    }
    if (this.state.path !== nextProps.path) {
      updates.path = nextProps.path;
      resubscribe = true;
    }
    if (this.state.collection !== nextProps.collection) {
      updates.collection = nextProps.collection;
      resubscribe = true;
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

  unsubscribe() {
    Store.unsubscribe(this.subscriptionId);
  }

  subscribe() {
    this.subscriptionId = Store.subscribe(this.state.collection,
      this.state.id,
      this.state.path,
      this.handleValueChange,
      true);
  }

  componentDidMount() {
    this.subscribe()
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unmounted = true;
  }

  set(value) {
    Store.set(this.state.collection, this.state.id, this.state.path, value, () => {
      this.handleValueChange(value);
    });
  }

  handleValueChange = (data) => {
    if (this.unmounted) {
      return;
    }
    if (!this.unmounted) {
      if (this.props.onValueUpdated !== undefined) {
        this.props.onValueUpdated(data, this.state.collection, this.state.id, this.state.path);
      }
    }
    if (data == null) {
      return;
    }
    if (data != this.state.value) {
      if (data == 0 || data == "0" || data == 1 || data == "1" || data === true || data === false) {
        if (Globals.typeof(data) == "String") {
          this.stringBased = true;
        } else if (Globals.typeof(data) == "Boolean") {
          this.booleanBased = true;
        } else {
          this.integerBased = true;
        }

        if (data === 0 || data === "0" || data === false) {
          this.setState((state) => {
            state.value = false;
            return state;
          });
        } else {
          this.setState((state) => {
            state.value = true;
            return state;
          });
        }
      } else {
        this.setState({value:data});
      }
    }
  }

  render() {

    if (this.state.value === undefined) {
      return null;
    }

    let props = {};
    Object.keys(this.props).forEach((k) => {
      if (k !== "value" && k !== "path" && k !== "collection" && k !== "id" && k !== "validate" ) {
        props[k] = this.props[k];
      }
    });

    // try {

      return (
        <span>
            {this.state.value == undefined? <Loader/>: null}
            <span style={{display: this.state.value == undefined ? "none" : "block"}}>

              <MaterialCheckbox
                  {...props}
                  checked = {this.props.invert ? !this.state.value : this.state.value}
                  onChange={(event) => {

                    let value = event.target.checked;
                    
                    if (typeof(value) !== "boolean" || value === undefined) {
                      return
                    }

                    let newValue = this.props.invert ? !value : value

                    if (this.integerBased === true) {
                      if (newValue === true) {
                        newValue = 1;
                      } else {
                        newValue = 0;
                      }
                    } else if(this.stringBased === true) {
                      if (newValue === true) {
                        newValue = "1";
                      } else {
                        newValue = "0";
                      }
                    }

                    if (Globals.typeof(this.validate) == "Function") {
                      let response = this.validate(newValue);
                      if (!response.ok) {
                        if (response.hasOwnProperty("setState") && response.setState) {
                          this.setState({value:response.value});
                        }
                        this.handleErrorValueChange(response.errorMessage);
                        return
                      } else {
                        newValue = response.value;
                      }
                    }
                    Store.set(this.state.collection, this.state.id, this.state.path, newValue, this.props.callback);
                  }}
              />
            </span>
        </span>
      );
    // } catch(e) {
    //   return this.globs.ComponentError("ToggleSwitchStore", e.message, e);
    // }
  }
}

Checkbox.propTypes = {
  collection:PropTypes.string,
  id:PropTypes.string,
  path:PropTypes.string,
  invert:PropTypes.bool,
  onValueUpdated:PropTypes.func,
  onToggle:PropTypes.func,
  callback:PropTypes.func
};

export default Checkbox;
