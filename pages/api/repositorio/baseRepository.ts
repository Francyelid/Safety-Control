import {PrismaClient, Prisma} from '@prisma/client'

interface IBaseRepository<T>
{
    Get(Id:number): Promise<T>;
    GetAll(): Promise<T>;
    GetAllWithFilters(filter: object): Promise<T>;
    Add(entity:T): Promise<T>;
    Delete(id: number): Promise<T>;
    DeleteAllWithFilters(filter: object): Promise<T>;
    Update(entity:T): Promise<T>;
}

class BaseRepository<T> implements IBaseRepository<T>
{
    _prisma = new PrismaClient();
    _TName : string;

    constructor(x : new () => T){
        this._TName = x.name.toLowerCase();
    }

    //#region  [GET]
    async Get(Id:number): Promise<T>{

        var result = await this._prisma[this._TName].findUnique({
            where: {
              id: Id,
            },
          });
          
        return  result;
    }

    async GetAll(): Promise<T>{

        var result = await this._prisma[this._TName].findMany();
        return  result;

    }

    async GetAllWithFilters(filter: object): Promise<T>{
        var result = await this._prisma[this._TName].findMany(filter);
        return  result;
    }

    //#endregion

    //#region [ADD]
    async Add(entity:T): Promise<T>{

        var newRegister = {};
        var properties = Object.getOwnPropertyNames(entity);
        
        for(var item in properties)
        {
            if(properties[item] != "id")
                newRegister[properties[item]] = entity[properties[item]];
        }

        var result = await this._prisma[this._TName].create({
            data:newRegister
        });

        return result;
    }
    //#endregion

    //#region [DELETE]

    async Delete(Id: number): Promise<T>{

        var result = await this._prisma[this._TName].delete({
            where: {
              id: Id,
            },
          });

        return result;
    }

    async DeleteAllWithFilters(filter: object): Promise<T>{
        var result = await this._prisma[this._TName].deleteMany(filter);
        return  result;
    }

    //#endregion

    //#region [UPDATE]

    async Update(entity:T): Promise<T>{
        var newRegister = {};
        var properties = Object.getOwnPropertyNames(entity);
        
        var Id = 0;

        for(var item in properties)
        {
            if(properties[item] != "id")
                newRegister[properties[item]] = entity[properties[item]];
            else
                Id = entity[properties[item]];
        }

        if(Id != 0)
        {
            var result = await this._prisma[this._TName].update({
                where: {id:Id},
                data:newRegister
            });
            return result;
        }

        return null;
    }

    //#endregion

}

export default BaseRepository;



