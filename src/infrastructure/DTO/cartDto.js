class CartDtoService {
  async getCart(carts) {
    // change my data to return cart information
    const dataToReturn = [];
    carts.forEach((cart) => {
      const newData = {
        product_id: cart.product_id,
        quantity: cart.product_quantity,
      };
      dataToReturn.push(newData);
    });
    const data = {
      user_id: carts[0].user_id,
      cart_id: carts[0].user_cart_id,
      cart: dataToReturn,
    };
    return data;
  }

  async mailInfo(cartInfo, productInfo, orderInfo) {
    // change my data to return e-mail information
    const data = [];
    productInfo.forEach((productElement) => {
      cartInfo.forEach((cartElement) => {
        if (cartElement.product_id == productElement.product_id) {
          const newData = {
            title: productElement.product_title,
            unit_price: productElement.product_price,
            quantity: cartElement.product_quantity,
          };
          data.push(newData);
        }
      });
    });
    const dataToReturn = {
      order_status: orderInfo.order_condition,
      products: data,
      total: orderInfo.order_total,
    };
    return dataToReturn;
  }
}

module.exports = new CartDtoService();
