import Control from "../../models/ControlModel";
import BaseRepository from "../baseRepository";

class ControlRepository extends BaseRepository<Control> {
    constructor(){
        super(Control);
    }
}

export default ControlRepository;