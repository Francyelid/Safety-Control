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
        if(await this.IsValidToUpdate(entity) && entity["id"] !=0){
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

        if(!entity["start_date"] || entity["start_date"] === "")
        {
            this._listErrors["StartDateObrigatorio"] = "start_date precisa ser preenchido";
            result= false;
        }else{
            entity["start_date"] = new Date(entity["start_date"])

        }

        return result;
    }

    async IsValidToUpdate(entity): Promise<boolean>{
        var result = true;
        

        if(!entity["id"] || entity["id"] === "")
        {
            this._listErrors["IdObrigatorio"] = "id precisa ser preenchido";
            result= false;
        }

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

        if(!entity["end_image"] || entity["end_image"] === "")
        {
            this._listErrors["EndImageObrigatorio"] = "end_image precisa ser preenchido";
            result= false;
        }

        if(!entity["end_date"] || entity["end_date"] === "")
        {
            this._listErrors["EndDateObrigatorio"] = "end_date precisa ser preenchido";
            result= false;
        }else{
            entity["end_date"] = new Date(entity["end_date"])
            
        }


        return result;
    }

}

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '50mb',
      },
    },
  }

export default async (req, res) => {
    var controlService = new ControlService();
    var statusReturn = 404;
    var jsonReturn = null;
    
    var result = new Array<Control>();
    switch(req.method)
    {
        
        case 'GET':
            if(req.query["Id"])
            {
                result[0] = await controlService.Get(req.query["Id"]);
                statusReturn = (200);
                jsonReturn = ({result});
            }
            else if(Object.keys(req.query).length === 0)
            {
                var controls = await controlService.GetAll();
                let result = {};
                result = controls;
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