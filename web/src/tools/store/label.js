/**
 * Created by Dan on 12/5/16.
 */
import React from 'react';
import Globals from "../globals"
import Store from "./store"
import PropTypes from 'prop-types';

class Label extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: undefined,
      path: this.props.path,
      collection: this.props.collection,
      id: this.props.id,
      color: this.props.color
    }
    this.unmounted = false;
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

  handleValueChange = (data) => {
    if (this.unmounted) {
      return;
    }
    if (data == null) {
      return;
    }

    if (Globals.typeof(data) == "Boolean" || Globals.typeof(data) == "Number") {
      data = data.toString();
    }

    if (data != this.state.value) {
      this.setState({value:data});
      if (this.props.onValue !== undefined) {
        this.props.onValue(this, data);
      }
    }
  }

  render() {

      var style = {display: this.state.value === undefined ? "none" : "block", 
                  color:this.state.color === undefined ? "black" : this.state.color,
                  whiteSpace:this.props.noWrap === undefined ? "" : "nowrap"};

      if (this.props.maxWidth !== undefined) {
        style.maxWidth = this.props.maxWidth;
        style.overflow = "hidden";
      }

      return (
        <span style={style}>
          {this.state.value}
        </span>
      );

  }
}

Label.propTypes = {
  collection:PropTypes.string,
  id:PropTypes.string,
  path:PropTypes.string,
  onValue:PropTypes.func
};

export default Label;
