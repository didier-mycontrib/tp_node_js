import { Instance} from "sequelize";
import {DeviseAttributes} from '../devise'

/*
export interface DeviseInstance extends Instance<DeviseAttributes> {
  dataValues: DeviseAttributes;
}
*/
export type DeviseInstance = Instance<DeviseAttributes> & DeviseAttributes;