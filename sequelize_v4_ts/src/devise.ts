//GENERIC PART (SEQUELIZE OR NOT)
export interface Devise  {
   code :string ; 
   name :string ;
   change :number ;
}

//exemples: ("USD" , "dollar" , 1) ,  ("EUR" , "euro" , 0.9)

//real class for instanciation ,  with constructor .
export class DeviseObject implements Devise {
   constructor(public code:string = "?" , 
               public name:string = "?",
               public change:number= 0){
   }
}

//****** SPECIF SEQUELIZE****************
import SequelizeStatic from "sequelize";
import { Instance , DataTypes , Sequelize  } from "sequelize";



export type DeviseAttributes = Devise ; /* simple type alias */
//interface name "....Attributes" is traditional within Sequelize


export interface DeviseInstance extends Instance<DeviseAttributes> , DeviseAttributes {
}
// ou bien export type DeviseInstance = Instance<DeviseAttributes> & DeviseAttributes;

export function deviseModelFactory(sequelize: Sequelize, DataTypes: DataTypes) 
  :  SequelizeStatic.Model<DeviseInstance, DeviseAttributes> {

   let deviseModel = sequelize.define<DeviseInstance, DeviseAttributes>('devise', {
       code: {type: DataTypes.STRING(32), autoIncrement: false, primaryKey: true},
       name: { type: DataTypes.STRING(64),allowNull: false 	},
       change: { type: DataTypes.DOUBLE,allowNull: false  	},
       }, {   
       freezeTableName: true 
       }
   );
   return deviseModel;
}