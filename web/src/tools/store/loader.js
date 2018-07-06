/**
 * Created by Dan on 7/4/2018.
 */
import React from 'react';
import {deepOrange500} from "@material-ui/core/colors"
import CircularProgress from "@material-ui/core/CircularProgress";

class Loader extends React.Component {

  render() {
    return (
      <div><CircularProgress style={{width:15, height:15}} thickness={3.5} color={deepOrange500}/></div>
    );
  }
}

export default Loader;
