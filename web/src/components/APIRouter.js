import React from 'react';
import PropTypes from 'prop-types';

class APIRouter extends React.Component {

    state = {};

    componentDidMount(){
        console.log(this.props.match);
        var url = new URL(window.location.origin + "/apiGET");
        var params = {controller:this.props.controller, 
                      action:(this.props.action === undefined) ? "" : this.props.action,
                      uriParams: btoa(JSON.stringify((this.props.uriParams === undefined) ? {} : this.props.uriParams))};
        url.search = new URLSearchParams(params);

        fetch(url).then((response) => {
            // perform setState here

            var contentType = response.headers.get("content-type");
            if(contentType && contentType.includes("application/json") && response.ok) {
                return response.json();
            }

            throw new TypeError("application/json was not returned in API Get");
        })
        .then((json) => {
            console.log(json);
            this.setState((state) => {
                state = json;
                return state;
            });
        })
        .catch((error) => { console.log(error); });
    }
}

APIRouter.propTypes = {
    match: PropTypes.object.isRequired,
    controller:PropTypes.string,
    action:PropTypes.string,
    uriParams:PropTypes.object
};

export default APIRouter