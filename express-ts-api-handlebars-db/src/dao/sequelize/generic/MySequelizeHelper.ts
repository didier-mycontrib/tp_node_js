import { Model } from "sequelize";

export class MySequelizeHelper<TAttr,TInstance,ID>{

    private dataValuesOfInstance(instance: TInstance): TAttr {
        /*
        let dataValues : any;
        let object : any = instance;
        dataValues = Reflect.get(object,"dataValues");
        return dataValues as TAttr;
        */
       return  (<any>instance)  as TAttr;
    }


    //To improve (model : any) ---> (model : AppropriateType)
    findByIdInModel(id: ID,model : any): Promise<TAttr> {
        return new Promise<TAttr>((resolve: Function, reject: Function) => {
            let pk :any = id;
            model.findByPk(pk)
             .then((devise: TInstance) => {
               resolve(this.dataValuesOfInstance(devise));
             }).catch((error: Error) => {
               reject(error);
             });
         });

    } 
}