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


/**
 * @desc   Get all reported crimes
 * @route  GET /api/crime/all
 * @access Public
 */
export const getAllCrimes = async (req, res) => {
  try {
    // Fetch all crimes from DB
    const crimes = await Crime.find().populate("user", "email");


    // Send data to frontend
    res.json(crimes);
    console.log("comes for fetching it from the DB ");
    console.log(crimes) ;
  } catch (err) {
    // Handle DB or server errors
    res.status(500).json({ msg: "Server error" });
  }
};
