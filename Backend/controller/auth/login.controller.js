import services from "../../services/index.js";

export default async function login(req, res) {
  // Get the user data from the request body
  const { email, password } = req.body;

  // Call the login service with the user data
  try {
    const response = await services.user.login({ email, password });

    req.userId = response.userId;

    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
    });

    res.cookie("accessToken", response.accessToken, {
      httpOnly: true,
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
}
