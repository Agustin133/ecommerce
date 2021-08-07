class OrderDtoService {
  async getOrder(orderInfo, cartInfo, directionInfo) {
    // returns the correct information of my order
    const data = [];
    cartInfo.forEach((cartElement) => {
      const newData = {
        product_id: cartElement.product_id,
        quantity: cartElement.product_quantity,
      };
      data.push(newData);
    });
    const dataToReturn = {
      user_id: orderInfo.user_id,
      order_id: orderInfo.order_id,
      condition: orderInfo.order_condition,
      created_on: orderInfo.order_timestamp,
      total: orderInfo.order_total,
      items: data,
      delivery_direction: {
        street: directionInfo.user_direction_street,
        house_number: directionInfo.user_direction_house_number,
        postal_code: directionInfo.user_direction_postal_code,
        floor: directionInfo.user_direction_floor,
        department: directionInfo.user_direction_department,
      },
    };
    return dataToReturn;
  }

  async registOrder(orderInfo) {
    // return the correct information of my order to store it in my registry
    const dataToReturn = {
      order_register_condition: 'completed',
      order_register_total: orderInfo.order_total,
      user_id: orderInfo.user_id,
    };
    return dataToReturn;
  }

  async getUserOrders(orderInfo) {
    // returns the correct information of all my user orders
    const data = [];
    orderInfo.forEach((orderElement) => {
      const newData = {
        register_id: orderElement.order_register_id,
        status: orderElement.order_register_condition,
        created_on: orderElement.order_register_timestamp,
        total: orderElement.order_register_total,
      };
      data.push(newData);
    });
    const dataToReturn = {
      user_id: orderInfo[0].user_id,
      orders: data,
    };
    return dataToReturn;
  }
}

module.exports = new OrderDtoService();
