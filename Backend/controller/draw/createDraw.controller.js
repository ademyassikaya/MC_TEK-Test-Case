import services from "../../services/index.js";

export default async function (req, res) {
  try {
    const { name, kind, size, coordinates } = req.body;
    const userId = req.userId;
    const draw = await services.draw.createDraw({
      name,
      kind,
      size,
      coordinates,
      userId,
    });
    res.json(draw);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
