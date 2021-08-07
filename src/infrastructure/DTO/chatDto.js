class ChatDtoService {
  async getStock(cartInfo) {
    const data = [];
    cartInfo.forEach((cartElement) => {
      const newData = {
        title: cartElement.product_title,
        stock: cartElement.product_stock,
      };
      data.push(newData);
    });
    const dataToReturn = data;
    return dataToReturn;
  }

  async getOrders(orderInfo) {
    const data = [];
    orderInfo.forEach((orderElement) => {
      const newData = {
        order_id: orderElement.order_register_id,
        condition: orderElement.order_register_condition,
        total: orderElement.order_register_total,
      };
      data.push(newData);
    });
    const dataToReturn = data;
    return dataToReturn;
  }

  async getCart(cartInfo, productInfo) {
    const data = [];
    let total = 0;
    cartInfo.forEach((cartElement) => {
      productInfo.forEach((productElement) => {
        if (cartElement.product_id == productElement.product_id) {
          const tot =
            cartElement.product_quantity * productElement.product_price;
          total += tot;
          const newData = {
            title: productElement.product_title,
            price: productElement.product_price,
            quantity: cartElement.product_quantity,
          };
          data.push(newData);
        }
      });
    });
    const dataToReturn = {
      products: data,
      total,
    };
    return dataToReturn;
  }
}

module.exports = new ChatDtoService();
