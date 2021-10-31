import Epis from "../../models/EpisModel";
import BaseRepository from "../baseRepository";

class EpisRepository extends BaseRepository<Epis> {
    constructor(){
        super(Epis);
    }
}

export default EpisRepository;