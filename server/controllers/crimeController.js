import Crime from "../models/Crime.js";

export const reportCrime = async (req, res) => {
  try {
    const crime = new Crime({
      user: req.user.id, // from JWT
      ...req.body,
    });

    await crime.save();
    res.status(201).json({ msg: "Crime reported successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
