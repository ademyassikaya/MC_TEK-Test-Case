import services from "../../services/index.js";

export default async function (req, res) {
  try {
    const userId = req.userId;
    const draws = await services.draw.getDraws({ userId });
    res.json(draws);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
