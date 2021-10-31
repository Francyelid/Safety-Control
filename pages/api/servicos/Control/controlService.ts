import Control from "../../models/ControlModel";
import ControlRepository from "../../repositorio/Control/controlRepository";

class ControlService{

    _controlRepository = new ControlRepository();
    _listErrors = new Object();

    async Get(Id:number): Promise<Control>{

        var result = await this._controlRepository.Get(Id);

        return result;
    }

    async GetAll(): Promise<Control[]>{

        var result = await this._controlRepository.GetAll();
        return result;
    }

    async Update(entity:Control): Promise<Control>{
        if(await this.IsValid(entity) && entity["id"] !=0){
            var result = await this._controlRepository.Update(entity);
            return result;
        }else{
            return null;
        }
    }

    async Create(entity:Control): Promise<Control>{
        if(await this.IsValid(entity) && entity["id"] == 0)
        {
            var result = await this._controlRepository.Add(entity);
            return result;
        }
        
        return null;
        
    }

    async Delete(id:number): Promise<Control>{
        if(id !=0){
            var result = await this._controlRepository.Delete(id);
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
            this._listErrors["ControlDescObrigatorio"] = "description precisa ser preenchido";
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
    var controlService = new ControlService();
    var statusReturn = 404;
    var jsonReturn = null;
    switch(req.method)
    {
        case 'GET':
            if(req.query["Id"])
            {
                var result = await controlService.Get(req.query["Id"]);
                statusReturn = (200);
                jsonReturn = ({result});
            }
            else if(Object.keys(req.query).length === 0)
            {
                var controls = await controlService.GetAll();
                let result = {};
                result["Controls"] = controls;

                statusReturn = (200);
                jsonReturn = (result);
            }
            break;
        case 'PUT':
            var entity = req.body.Control as Control;
            var updated = await controlService.Update(entity);
            if(updated != null)
            {
                statusReturn = (200);
                jsonReturn = (updated);
            }
            else{
                statusReturn = (400);
                jsonReturn = ({error:controlService._listErrors});
            }

            break;
        case 'DELETE':
            if(req.body.id)
            {
                let result = await controlService.Delete(parseInt(req.body.id));
                statusReturn = (200);
                jsonReturn = (result);
            }else
            {
                statusReturn = (400)
            }
            break;
        case 'POST':
            var entity = req.body.Control as Control;
            var created = await controlService.Create(entity);
            if(created != null)
            {
                statusReturn = (200);
                jsonReturn = (created);
            }
            else{
                statusReturn = (400);
                jsonReturn = ({error:controlService._listErrors});
            }
            break;
        default:
            break;
    }

    res.status(statusReturn).json(jsonReturn);
    res.end();
};