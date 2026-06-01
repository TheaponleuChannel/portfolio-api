// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

// Validate contact message body
const validateMessage = (req, res, next) => {
  const { name, email, message } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2)
    errors.push("Name must be at least 2 characters.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("A valid email is required.");
  if (!message || typeof message !== "string" || message.trim().length < 10)
    errors.push("Message must be at least 10 characters.");

  if (errors.length) {
    return res.status(422).json({ success: false, errors });
  }
  next();
};

// Validate project body
const validateProject = (req, res, next) => {
  const { title, description, techStack, category } = req.body;
  const errors = [];
  const validCategories = ["web", "mobile", "ai", "devops", "other"];

  if (!title || title.trim().length < 3) errors.push("Title must be at least 3 characters.");
  if (!description || description.trim().length < 10) errors.push("Description must be at least 10 characters.");
  if (!Array.isArray(techStack) || techStack.length === 0) errors.push("techStack must be a non-empty array.");
  if (!category || !validCategories.includes(category))
    errors.push(`Category must be one of: ${validCategories.join(", ")}.`);

  if (errors.length) {
    return res.status(422).json({ success: false, errors });
  }
  next();
};

module.exports = { notFound, errorHandler, validateMessage, validateProject };
