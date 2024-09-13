import producer from "../rabbitmq/producer.js";

const coldMailController = async (req, res, next) => {
  const jobDescription = req.body;
  console.log(jobDescription);
  if (!jobDescription) {
    return res.status(404).json({
      message: " job description is required",
    });
  }
  await producer(jobDescription);
  return res.status(200).json({
    message:
      " jodescription is  recesived and it send to the cold mail generator",
  });
};

export default coldMailController;
