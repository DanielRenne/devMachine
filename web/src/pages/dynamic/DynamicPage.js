import React from 'react';
import APIRouter from "../../components/APIRouter"
import Button from '@material-ui/core/Button';
import WSocket from '../../tools/webSocket'
import Switch from '../../tools/store/switch'

class DynamicPage extends APIRouter {

    render() {
        if (this.state.hasOwnProperty("payload")) {
            return (
                <div>
                    {this.state.payload}
                    <Button 
                        color="primary"
                        onClick={() => {
                            WSocket.apiRequest({controller:"Dynamic", action:"PostSomething", state:1, callback:(data) => {
                                console.log(data);
                            }})
                        }}
                    >
                        Test
                    </Button>
                    <Switch collection="Users" id="57d9b383dcba0f51172f1f57" path="EnforcePasswordChange"/>
                </div>
            );
        } else {
            return null;
        }
    }

}

export default DynamicPage