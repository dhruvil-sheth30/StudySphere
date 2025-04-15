const requestLogger = (req, res, next) => {
  // Only log API requests to keep the console clean
  if (req.originalUrl.startsWith('/api/')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  
  // Track response for error logging
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode >= 400 && req.originalUrl.startsWith('/api/')) {
      console.error(`[ERROR] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
      
      // If it's a JSON response with error details, log those too
      if (res.getHeader('content-type')?.includes('application/json')) {
        try {
          const body = JSON.parse(data);
          if (body.error) {
            console.error(`Error details:`, body.error);
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

export default requestLogger;
