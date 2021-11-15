import User from "../../models/UserModel";
import UserRepository from "../../repositorio/User/userRepository";
import bcrypt from 'bcrypt';
import { getSession } from "next-auth/client";
import EUserType from "../../utils/EUserType";

class UserService{

    _userRepository = new UserRepository();
    _listErrors = new Object();
    _session = null;

    async Get(Id:number): Promise<User>{

        var result = await this._userRepository.Get(Id);

        return result;
    }

    async GetByEmail(email:string): Promise<User>{

        var result = await this._userRepository.GetAllWithFilters({
            where:{
                AND:[
                    {email: email}
                ]
            }
        });

        return result[0];
    }

    async GetAuthentication(email:string, password:string): Promise<User>{

        var result = await this._userRepository.GetAllWithFilters({
            where:{
                AND:[
                    {email: email}
                ]
            }
        });

        var correctAuth = await bcrypt.compareSync(password, result[0].password);
        if(correctAuth)
            return result[0];
        else
            return null;
    }

    async GetAll(): Promise<User[]>{

        var result = await this._userRepository.GetAll();
        return result;
    }

    async Update(entity:User): Promise<User>{

        if(this._session && entity.email == this._session.user.email)
        {
            this._listErrors["UsuarioAtual"] = "Não é permitido editar o usuário em uso";
            return null;
        }

        if(await this.IsValid(entity) && entity["id"] !=0){
            var result = await this._userRepository.Update(entity);
            return result;
        }else{
            return null;
        }
    }

    async UpdatePassword(oldPass: string, newPass : string, email:string): Promise<User>
    {
        if(!newPass)
        {
            this._listErrors["SenhaVazia"] = "Nova senha precisa ser preenchida";
            return null;
        }
        var auth = await this.GetAuthentication(email, oldPass);
        if(!auth || auth == null)
        {
            this._listErrors["SenhaIncorreta"] = "Senha atual incorreta.";
            return null;
        }else{
            var user = await this.GetByEmail(email);
            console.log(user);
            var hashPass = await bcrypt.hash(newPass, 10);
            user.password = hashPass;
            var updated = await this._userRepository.Update(user);
            return updated;
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
            var entity = await this.Get(id);
            if(this._session && entity.email == this._session.user.email)
            {
                this._listErrors["UsuarioAtual"] = "Não é permitido excluir o usuário em uso";
                return null;
            }

            var result = await this._userRepository.Delete(id);
            return result;
        }
        
        return null;
        
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

        if(!entity["type"] || entity["type"] === "")
        {
            this._listErrors["TipoObrigatorio"] = "Tipo precisa ser preenchido";
            result= false;
        }

        return result;
    }

    async IsMasterUser(email: string): Promise<boolean>{

        var result = await this._userRepository.GetAllWithFilters({
            where:{
                AND:[
                    {email: email}
                ]
            }
        });

        if(result && result[0].type == EUserType.Master)
            return true;

        return false;
    }

}


export default async (req, res) => {
    var userService = new UserService();
    var statusReturn = 404;
    var jsonReturn = null;

    const session = await getSession({ req });
    userService._session = session;
    var auth = session? await userService.IsMasterUser(session.user.email) : null;

    switch(req.method)
    {
        case 'GET':
            if(req.query["Id"])
            {
                var result = await userService.Get(req.query["Id"]);
                statusReturn = (200);
                jsonReturn = ({result});
            }else if(req.query["email"] && req.query["password"])
            {
                var result = await userService.GetAuthentication(req.query["email"], req.query["password"]);
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
            if(auth){
                if(req.body["newPass"])
                {
                    var updatedPass = await userService.UpdatePassword(req.body["oldPass"], req.body["newPass"], session.user.email);
                    if(updatedPass != null)
                    {
                        statusReturn = (200);
                        jsonReturn = (updatedPass);
                    }else{
                        statusReturn = (200);
                        jsonReturn = ({error:userService._listErrors});
                    }
                }else{
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
                }
            }else{
                statusReturn = (200);
                userService._listErrors["AuthFail"] = "Somente usuários Master podem editar um usuário";
                jsonReturn = ({error:userService._listErrors})
            }
            break;
        case 'DELETE':
            if(req.body.id)
            {
                if(auth){
                    let result = await userService.Delete(parseInt(req.body.id));
                    if(result){
                        statusReturn = (200);
                        jsonReturn = (result);
                    }else{
                        statusReturn = (200);
                        jsonReturn = ({error:userService._listErrors});
                    }
                }else{
                    statusReturn = (200);
                    userService._listErrors["AuthFail"] = "Somente usuários Master podem deletar um usuário";
                    jsonReturn = ({error:userService._listErrors})
                }
            }else
            {
                statusReturn = (400)
            }
            break;
        case 'POST':
            if(auth){
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
            }else{
                statusReturn = (200);
                userService._listErrors["AuthFail"] = "Somente usuários Master podem criar um novo usuário";
                jsonReturn = ({error:userService._listErrors})
            }
            break;
        default:
            break;
    }

    res.status(statusReturn).json(jsonReturn);
    res.end();
};