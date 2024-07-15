import services from "../../services/index.js";

export default async function (req, res) {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const draw = await services.draw.updateDraw({ id, name });
    res.json(draw);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
