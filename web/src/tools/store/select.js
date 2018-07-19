/**
 * Created by Dan on 12/5/16.
 */
import React from 'react';
import Globals from "../globals"
import Store from "./store"
import Loader from "./loader"
import PropTypes from 'prop-types';
import MaterialSelect from '@material-ui/core/Select';

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.unmounted = false;
    this.validate = this.props.validate;
    this.state = {
      value: undefined,
      errorText:"",
      path: this.props.path,
      collection: this.props.collection,
      id: this.props.id,
      emptyValue: this.props.emptyValue,
      defaultValue: this.props.defaultValue,
      validateErrorMessage: this.props.validateErrorMessage,
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
    if (this.state.emptyValue !== nextProps.emptyValue) {
      updates.emptyValue = nextProps.emptyValue;
    }
    if (this.state.validateErrorMessage !== nextProps.validateErrorMessage) {
      updates.validateErrorMessage = nextProps.validateErrorMessage;
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

  subscribe() {
    this.subscriptionId = Store.subscribe(this.state.collection,
      this.state.id,
      this.state.path,
      (data) => {this.handleValueChange(data)},
      true);
    if (this.state.validateErrorMessage) {
      this.subscriptionErrorId = Store.subscribe(this.state.collection, this.state.id, "Errors." + this.state.path, (data) => {this.handleErrorValueChange(data)}, false);
    }
  }

  unsubscribe() {
    Store.unsubscribe(this.subscriptionId);
    if (this.state.validateErrorMessage) {
      Store.unsubscribe(this.subscriptionErrorId);
    }
  }

  componentDidMount() {
    this.subscribe();

    if (this.state.emptyValue != undefined && this.state.defaultValue != undefined) {
      if (this.state.value && this.state.value == this.state.emptyValue) {
        Store.set(this.state.collection, this.state.id, this.state.path, this.state.defaultValue);
      } else {
        Store.getByPath({collection:this.state.collection, id:this.state.id, path:this.state.path}, (data) => {
          if (data == this.state.emptyValue) {
            Store.set(this.state.collection, this.state.id, this.state.path, this.state.defaultValue);
          }
        });
      }
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.unsubscribe();
  }

  set(value) {
    Store.set(this.state.collection, this.state.id, this.state.path, value, () => {
      this.handleValueChange(value);
    });
  }

  handleValueChange(data) {
    if (this.unmounted) {
      return;
    }
    if (!this.unmounted) {
      if (this.props.onValue !== undefined) {
        this.props.onValue(data, this.state.collection, this.state.id,this.state.path);
      }
    }
    if (data == null) {
      return;
    }
    if (data != this.state.value) {
      this.setState({errorText:"", value:data});
    }
  }

  handleErrorValueChange(data) {
    this.setState({errorText:data});
  }

  render() {

      let props = {};
      Object.keys(this.props).forEach((k) => {
        if (k !== "onChange" && k !== "value" && k !== "emptyValue" && k !== "path" && k !== "collection" && k !== "id" && k !== "validate" ) {
          props[k] = this.props[k];
        }
      });

      return (
        <span>
          {this.state.value == undefined? <Loader/>: null}
          <span style={{display: this.state.value == undefined ? "none" : "block"}}>

            <MaterialSelect
              {...props}
              value={(this.state.emptyValue) ? (this.state.value) ? this.state.value : this.state.emptyValue : this.state.value}
              onChange={(event) => {

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
                    value = response.value;
                  }
                }

                Store.set(this.state.collection, this.state.id, this.state.path, value, this.props.callback);
                if (this.props.onChange !== undefined) {
                  this.props.onChange(event, index, value);
                }
              }}
              errorText={this.state.errorText}
            >
              {this.props.children}
            </MaterialSelect>
          </span>
        </span>
      );
  }
}


Select.propTypes = {
  collection:PropTypes.string,
  id:PropTypes.string,
  path:PropTypes.string,
  emptyValue:PropTypes.any,
  defaultValue:PropTypes.any,
  onValue:PropTypes.func,
  onChange:PropTypes.func,
  callback:PropTypes.func
};

export default Select;
