const Food = require('../models/fooditems');
const Canteen = require('../models/Canteen');

// ⭐ Rate a Food Item
exports.rateFood = async (req, res) => {
  const { userId, rating } = req.body;
  const foodId = req.params.id;

  try {
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food item not found' });

    const existingRating = food.ratings.find(r => r.user.toString() === userId);
    if (existingRating) {
      existingRating.rating = rating; // Update rating
    } else {
      food.ratings.push({ user: userId, rating }); // Add new rating
    }

    await food.calculateAvgRating();
    res.status(200).json({ message: 'Food rated successfully', avgRating: food.avgRating });
  } catch (err) {
    console.error('Error rating food:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ⭐ Rate a Canteen
exports.rateCanteen = async (req, res) => {
  const { userId, rating } = req.body;
  const canteenId = req.params.id;

  try {
    const canteen = await Canteen.findById(canteenId);
    if (!canteen) return res.status(404).json({ message: 'Canteen not found' });

    const existingRating = canteen.ratings.find(r => r.user.toString() === userId);
    if (existingRating) {
      existingRating.rating = rating; // Update
    } else {
      canteen.ratings.push({ user: userId, rating }); // New
    }

    await canteen.calculateAvgRating();
    res.status(200).json({ message: 'Canteen rated successfully', avgRating: canteen.avgRating });
  } catch (err) {
    console.error('Error rating canteen:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
