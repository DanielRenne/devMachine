import React from 'react';
import PropTypes from 'prop-types';

class APIRouter extends React.Component {

    state = {};

    componentDidMount(){
        console.log(this.props.match);
        fetch("/test").then((response) => {
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
};

export default APIRouter