
import { DeviseDataServiceFactory} from "./factory/DeviseDataServiceFactory";
import { DeviseDataService } from "./itf/DeviseDataService";
import { defaultTargetEnv } from "./default.env";

export const deviseDataServiceFactory = new DeviseDataServiceFactory();
export const deviseDataService : DeviseDataService 
   = deviseDataServiceFactory.dataServiceForTargetEnv(defaultTargetEnv);
