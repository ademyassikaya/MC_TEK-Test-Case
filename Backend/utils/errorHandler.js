export default function errorHandler(err, req, res, next) {
  console.error("Error occurred:", err);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  } else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON";
  } else if (err instanceof Error) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "Duplicate entry";
    }
  }

  res.status(statusCode).json({ message });
}
