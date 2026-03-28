export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
        const errorMessages = error.errors.map((err) => ({
          path: err.path[0],
          message: err.message,
        }));
        return res.status(400).json({ errors: errorMessages, message: errorMessages[0].message });
    }
    
    console.error('Validation Middleware Error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error during validation' });
  }
};
