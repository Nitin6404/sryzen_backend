import { Model, DataTypes, Sequelize } from 'sequelize';

export class Order extends Model {
  public id!: number;
  public userId!: number;
  public restaurantId!: number;
  public totalAmount!: number;
  public status!: string;
  public deliveryAddress!: string;
  public paymentStatus!: string;
  public paymentMethod!: string;
  // Add timestamp fields
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
        type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'),
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
    },
    {
      sequelize,
      tableName: 'orders',
      timestamps: true, // Ensure timestamps are enabled
    }
  );

  return Order;
}