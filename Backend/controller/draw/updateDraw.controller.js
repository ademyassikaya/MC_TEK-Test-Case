import services from "../../services/index.js";

export default async function (req, res) {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const { kind } = req.body;
    const { size } = req.body;
    const { coordinates } = req.body;
    const userId = req.userId;
    const draw = await services.draw.updateDraw({
      id,
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
