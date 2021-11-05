import Epis from "../../models/EpisModel";
import EpisRepository from "../../repositorio/Epis/episRepository";

class EpisService{

    _episRepository = new EpisRepository();
    _listErrors = new Object();

    async Get(Id:number): Promise<Epis>{

        var result = await this._episRepository.Get(Id);

        return result;
    }

    async GetAll(): Promise<Epis[]>{

        var result = await this._episRepository.GetAll();
        return result;
    }

    async Update(entity:Epis): Promise<Epis>{
        if(await this.IsValid(entity) && entity["id"] !=0){
            var result = await this._episRepository.Update(entity);
            return result;
        }else{
            return null;
        }
    }

    async Create(entity:Epis): Promise<Epis>{
        if(await this.IsValid(entity) && entity["id"] == 0)
        {
            var result = await this._episRepository.Add(entity);
            return result;
        }
        
        return null;
        
    }

    async Delete(id:number): Promise<Epis>{
        if(id !=0){
            var result = await this._episRepository.Delete(id);
            return result;
        }else{
            return null;
        }
    }

    async IsValid(entity): Promise<boolean>{
        var result = true;
        if(!entity["epi_id"] || entity["epi_id"] === "")
        {
            this._listErrors["EpiObrigatorio"] = "epi_id precisa ser preenchido";
            result= false;
        }

        if(!entity["description"] || entity["description"] === "")
        {
            this._listErrors["EpisDescObrigatorio"] = "description precisa ser preenchido";
            result= false;
        }

        if(!entity["start_image"] || entity["start_image"] === "")
        {
            this._listErrors["StartImageObrigatorio"] = "start_image precisa ser preenchido";
            result= false;
        }

        return result;
    }

}


export default async (req, res) => {
    var episService = new EpisService();
    var statusReturn = 404;
    var jsonReturn = null;
    var result = new Array<Epis>();
    switch(req.method)
    {
        case 'GET':
            if(req.query["Id"])
            {
                result[0] = await episService.Get(req.query["Id"]);
                statusReturn = (200);
                jsonReturn = ({result});
            }
            else if(Object.keys(req.query).length === 0)
            {
                var episs = await episService.GetAll();
                let result = {};
                result = episs;
                statusReturn = (200);
                jsonReturn = (result);
            }
            break;
        case 'PUT':
            var entity = req.body.Epis as Epis;
            var updated = await episService.Update(entity);
            if(updated != null)
            {
                statusReturn = (200);
                jsonReturn = (updated);
            }
            else{
                statusReturn = (400);
                jsonReturn = ({error:episService._listErrors});
            }

            break;
        case 'DELETE':
            if(req.body.id)
            {
                let result = await episService.Delete(parseInt(req.body.id));
                statusReturn = (200);
                jsonReturn = (result);
            }else
            {
                statusReturn = (400)
            }
            break;
        case 'POST':
            var entity = req.body.Epis as Epis;
            var created = await episService.Create(entity);
            if(created != null)
            {
                statusReturn = (200);
                jsonReturn = (created);
            }
            else{
                statusReturn = (400);
                jsonReturn = ({error:episService._listErrors});
            }
            break;
        default:
            break;
    }

    res.status(statusReturn).json(jsonReturn);
    res.end();
};