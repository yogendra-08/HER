const { createOrder } = require('../../backendjs/controllers/orderController');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    const orderData = JSON.parse(event.body);
    
    // Call the createOrder function from your controller
    const result = await createOrder({
      body: orderData,
      user: { _id: orderData.userId } // Assuming you pass userId in the request
    });

    return {
      statusCode: 201,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ 
        message: error.message || 'Internal Server Error' 
      })
    };
  }
};
