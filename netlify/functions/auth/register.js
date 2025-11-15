// Netlify Function for user registration
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const { email, password, name, phone, address } = JSON.parse(event.body);
    
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Register the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          address
        }
      }
    });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {
          token: data.session?.access_token,
          user: data.user
        }
      })
    };
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        success: false,
        message: error.message || 'Registration failed',
        error: error
      })
    };
  }
};
