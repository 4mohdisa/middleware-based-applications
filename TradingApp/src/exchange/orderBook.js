class OrderBook {
  constructor() {
    this.buyOrders = [];
    this.sellOrders = [];
  }

  // Add an order to the buy or sell list
  addOrder(order) {
    if (order.side === 'BUY') {
      this.buyOrders.push(order);
      this.buyOrders.sort((a, b) => b.price - a.price); // Sort buy orders descending
    } else {
      this.sellOrders.push(order);
      this.sellOrders.sort((a, b) => a.price - b.price); // Sort sell orders ascending
    }
  }

  // Find a matching order in the opposite order list
  findMatchingOrder(order) {
    const oppositeOrders = order.side === 'BUY' ? this.sellOrders : this.buyOrders;
    return oppositeOrders.find(o => 
      (order.side === 'BUY' ? o.price <= order.price : o.price >= order.price) &&
      o.stock === order.stock
    );
  }

  // Remove an order from the order book after trade execution
  removeOrder(order) {
    const orderList = order.side === 'BUY' ? this.buyOrders : this.sellOrders;
    const index = orderList.findIndex(o => o.id === order.id);
    if (index !== -1) {
      orderList.splice(index, 1);
    }
  }
}

module.exports = OrderBook;
