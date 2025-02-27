import { Model, DataTypes, Sequelize } from 'sequelize';

export class MenuItem extends Model {
  public id!: number;
  public restaurantId!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: string;
}

export default function (sequelize: Sequelize): typeof MenuItem {
  MenuItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'menu_items',
    },
  );

  return MenuItem;
}