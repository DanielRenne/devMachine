import React from 'react';
import APIRouter from "../../components/APIRouter"
import Button from '@material-ui/core/Button';
import WSocket from '../../tools/webSocket'
import Switch from '../../tools/store/switch'
import Checkbox from '../../tools/store/checkbox'
import Label from '../../tools/store/label'
import Select from '../../tools/store/select'
import TextField from '../../tools/store/textfield'
import MenuItem from '@material-ui/core/MenuItem';

class DynamicPage extends APIRouter {

    render() {
        if (this.state.hasOwnProperty("payload")) {

            let items = [];
            items.push(<MenuItem value={true}>True</MenuItem>);
            items.push(<MenuItem value={false}>False</MenuItem>);

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
                    <Checkbox collection="Users" id="57d9b383dcba0f51172f1f57" path="EnforcePasswordChange"/>
                    <Label collection="Users" id="57d9b383dcba0f51172f1f57" path="EnforcePasswordChange"/>
                    <Select collection="Users" id="57d9b383dcba0f51172f1f57" path="EnforcePasswordChange">
                        {items}
                    </Select>
                    <TextField collection="Users" id="57d9b383dcba0f51172f1f57" path="First" changeOnBlur={false}/>
                </div>
            );
        } else {
            return null;
        }
    }

}

export default DynamicPage