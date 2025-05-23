import { Model, DataTypes, Sequelize } from 'sequelize';
import { Restaurant } from './restaurant.model';
import { Cart } from './cart.model';

export class Order extends Model {
  public id!: number;
  public userId!: number;
  public restaurantId!: number;
  public totalAmount!: number;
  public status!: string;
  public deliveryAddress!: string;
  public paymentStatus!: string;
  public paymentMethod!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public price!: number;

  // Add association properties
  public readonly Restaurant?: Restaurant;
  public readonly CartItems?: Cart[];
}

export default function (sequelize: Sequelize): typeof Order {
  Order.init(
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
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'confirmed',
          'preparing',
          'ready',
          'delivered',
          'cancelled',
        ),
        defaultValue: 'pending',
      },
      deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending',
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'orders',
      timestamps: true, // Ensure timestamps are enabled
    },
  );

  return Order;
}
