const Joi =require("joi");

// Define password complexity rules
const passwordComplexity = Joi.string()
  .min(8)
  .max(30)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
  .message("Password must contain at least 8 characters, one uppercase, one lowercase, and one number.");

// Define Joi schema for user registration
exports.registerValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).max(30).required(),
    lastname: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^07\d{8}$/)
      .message("Phone number must be a valid Jordanian number (07xxxxxxxx).")
      .required(),
    password: passwordComplexity.required(),
    rePassword: Joi.ref("password"), // Ensures passwords match
    address: Joi.string().min(3).max(100).required(),
  });

  return schema.validate(data, { abortEarly: false }); // Return all errors at once
};
