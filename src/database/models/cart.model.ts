import { Model, DataTypes, Sequelize } from 'sequelize';
import { MenuItem } from './menu.items.model';

export class Cart extends Model {
  public id!: number;
  public userId!: number;
  public menuItemId!: number;
  public quantity!: number;
  public price!: number;
  public orderId?: number;
  
  // Update association property to be non-optional when included
  public MenuItem!: MenuItem;
}

export default function (sequelize: Sequelize): typeof Cart {
  Cart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      menuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'carts',
    }
  );

  return Cart;
}