import APIRouter from "../../components/APIRouter"

class DynamicPage extends APIRouter {

    render() {
        if (this.state.hasOwnProperty("payload")) {
            return this.state.payload;
        } else {
            return null;
        }
    }

}

export default DynamicPage