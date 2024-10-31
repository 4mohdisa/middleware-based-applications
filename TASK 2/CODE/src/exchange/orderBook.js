// Define a class named OrderBook to manage buy and sell orders
class OrderBook {
  // Constructor method to initialize the OrderBook
  constructor() {
    // Initialize an empty array to store buy orders
    this.buyOrders = [];
    // Initialize an empty array to store sell orders
    this.sellOrders = [];
  }

  // Method to add an order to the appropriate list (buy or sell)
  addOrder(order) {
    // Check if the order is a buy order
    if (order.side === 'BUY') {
      // If it's a buy order, add it to the buyOrders array
      this.buyOrders.push(order);
      // Sort the buy orders in descending order of price
      // This ensures that the highest buy prices are at the beginning of the array
      this.buyOrders.sort((a, b) => b.price - a.price);
    } else {
      // If it's not a buy order (i.e., it's a sell order), add it to the sellOrders array
      this.sellOrders.push(order);
      // Sort the sell orders in ascending order of price
      // This ensures that the lowest sell prices are at the beginning of the array
      this.sellOrders.sort((a, b) => a.price - b.price);
    }
  }

  // Method to find a matching order in the opposite order list
  findMatchingOrder(order) {
    // Determine which list of orders to search based on the incoming order type
    const oppositeOrders = order.side === 'BUY' ? this.sellOrders : this.buyOrders;
    
    // Use the find method to locate the first matching order
    return oppositeOrders.find(o => 
      // For a buy order, find a sell order with price less than or equal to the buy price
      // For a sell order, find a buy order with price greater than or equal to the sell price
      (order.side === 'BUY' ? o.price <= order.price : o.price >= order.price) &&
      // Ensure the stocks match
      o.stock === order.stock
    );
  }

  // Method to remove an order from the order book after trade execution
  removeOrder(order) {
    // Determine which list the order is in (buy or sell)
    const orderList = order.side === 'BUY' ? this.buyOrders : this.sellOrders;
    
    // Find the index of the order in the appropriate list
    const index = orderList.findIndex(o => o.id === order.id);
    
    // If the order is found (index is not -1)
    if (index !== -1) {
      // Remove the order from the list using the splice method
      orderList.splice(index, 1);
    }
  }
}

// Export the OrderBook class so it can be used in other files
module.exports = OrderBook;
