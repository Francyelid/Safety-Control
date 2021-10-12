import User from "../../models/UserModel";
import BaseRepository from "../baseRepository";

class UserRepository extends BaseRepository<User> {
    constructor(){
        super(User);
    }
}

export default UserRepository;