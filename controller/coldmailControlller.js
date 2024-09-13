import producer from "../rabbitmq/producer.js";
import ErrorHandler from "../middleware/errorHandler.js";

const coldMailController = async (req, res, next) => {
  const { jobDescription } = req.body;

  // check if the job description is provided or not
  if (!jobDescription) {
    return next(new ErrorHandler("job descriptionis required", 404));
  }

  // send the job description to the microservice
  await producer(jobDescription);

  // send the response
  return res.status(200).json({
    message:
      " jodescription is  recesived and it send to the cold mail generator",
  });
};

export default coldMailController;
