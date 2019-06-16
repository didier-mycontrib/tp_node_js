import { BasicCrudService } from "../itf/generic/BasicCrudService";

export enum TargetEnv { SIMPLE_TEST, REAL_TEST , PROD};
export enum DaoImplType { MEMORY_MAP , SEQUELIZE_ORM , MONGO_DB , OTHER  };

export interface DataServiceFactory<T,ID,DATASERVICE extends BasicCrudService<T,ID>>{

    dataServiceForTargetEnv(targetEnv : TargetEnv) : DATASERVICE ;
    dataServiceByImpl(daoImplType : DaoImplType) : DATASERVICE;

}