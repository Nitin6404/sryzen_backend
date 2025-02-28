import { ICartModel, IMenuItemModel, IOrderModel, IRestaurantModel, IUserModel } from './index';

export interface ModelRelationships {
  User: IUserModel;
  Restaurant: IRestaurantModel;
  MenuItem: IMenuItemModel;
  Cart: ICartModel;
  Order: IOrderModel;
}