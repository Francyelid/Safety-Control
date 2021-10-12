import User from "../../models/UserModel";
import UserRepository from "../../repositorio/User/userRepository";
import bcrypt from 'bcrypt';

class UserService{

    _userRepository = new UserRepository();
    _listErrors = new Object();

    async Get(Id:number): Promise<User>{

        var result = await this._userRepository.Get(Id);

        return result;
    }

    async GetAll(): Promise<User[]>{

        var result = await this._userRepository.GetAll();
        return result;
    }

    async Update(entity:User): Promise<User>{
        if(await this.IsValid(entity) && entity["id"] !=0){
            var result = await this._userRepository.Update(entity);
            return result;
        }else{
            return null;
        }
    }

    async Create(entity:User): Promise<User>{
        if(await this.IsValid(entity) && entity["id"] == 0)
        {
            var hashPass = await bcrypt.hash(entity["password"], 10);
            entity["password"] = hashPass;
            var result = await this._userRepository.Add(entity);
            return result;
        }
        
        return null;
        
    }

    async Delete(id:number): Promise<User>{
        if(id !=0){
            var result = await this._userRepository.Delete(id);
            return result;
        }else{
            return null;
        }
    }

    async IsValid(entity): Promise<boolean>{
        var result = true;
        if(!entity["name"] || entity["name"] === "")
        {
            this._listErrors["NomeObrigatorio"] = "Nome precisa ser preenchido";
            result= false;
        }

        if(!entity["email"] || entity["email"] === "")
        {
            this._listErrors["EmailObrigatorio"] = "Email precisa ser preenchido";
            result= false;
        }else{
            var existEmail = await this._userRepository.GetAllWithFilters({
                where: {
                  email: entity["email"],
                  NOT:{
                      id: entity["id"]
                  }
                },
            });
            
            if(existEmail.length){
                this._listErrors["EmailUnico"] = "Email já utilizado";
                result= false;
            }

        }

        if(!entity["password"] || entity["password"] === "")
        {
            this._listErrors["SenhaObrigatorio"] = "Senha precisa ser preenchido";
            result= false;
        }

        return result;
    }

}


export default async (req, res) => {
    var userService = new UserService();
    var statusReturn = 404;
    var jsonReturn = null;
    switch(req.method)
    {
        case 'GET':
            if(req.query["Id"])
            {
                var result = await userService.Get(req.query["Id"]);
                statusReturn = (200);
                jsonReturn = ({result});
            }
            else if(Object.keys(req.query).length === 0)
            {
                var users = await userService.GetAll();
                let result = {};
                result["Users"] = users;

                statusReturn = (200);
                jsonReturn = (result);
            }
            break;
        case 'PUT':
            var entity = req.body.user as User;
            var updated = await userService.Update(entity);
            if(updated != null)
            {
                statusReturn = (200);
                jsonReturn = (updated);
            }
            else{
                statusReturn = (200);
                jsonReturn = ({error:userService._listErrors});
            }

            break;
        case 'DELETE':
            if(req.body.id)
            {
                let result = await userService.Delete(parseInt(req.body.id));
                statusReturn = (200);
                jsonReturn = (result);
            }else
            {
                statusReturn = (400)
            }
            break;
        case 'POST':
            var entity = req.body.user as User;
            var created = await userService.Create(entity);
            if(created != null)
            {
                statusReturn = (200);
                jsonReturn = (created);
            }
            else{
                statusReturn = (200);
                jsonReturn = ({error:userService._listErrors});
            }
            break;
        default:
            break;
    }

    res.status(statusReturn).json(jsonReturn);
    res.end();
};