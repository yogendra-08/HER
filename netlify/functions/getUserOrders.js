const { getOrdersByUser } = require('../../backendjs/controllers/orderController');

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    // Extract email from the path
    const email = event.queryStringParameters.email;
    
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email is required' })
      };
    }

    // Call the getOrdersByUser function from your controller
    const orders = await getOrdersByUser({
      params: { email }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(orders)
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ 
        message: error.message || 'Internal Server Error' 
      })
    };
  }
};
