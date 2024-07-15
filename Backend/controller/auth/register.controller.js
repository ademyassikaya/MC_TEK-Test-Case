import services from "../../services/index.js";

export default async function (req, res) {
  const { name, surname, email, password, role } = req.body;
  const response = await services.user.register({
    name,
    surname,
    email,
    password,
    role,
  });
  return res.status(200).json(response);
}
