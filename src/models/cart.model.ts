import { Model, DataTypes, Sequelize } from 'sequelize';

export class Cart extends Model {
  public id!: number;
  public userId!: number;
  public menuItemId!: number;
  public quantity!: number;
  public price!: number;
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
    },
    {
      sequelize,
      tableName: 'carts',
    }
  );

  return Cart;
}