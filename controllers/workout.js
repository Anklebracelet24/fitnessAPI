const Workout = require("../models/Workout");

// Add a workout
exports.addWorkout = async (req, res) => {
  try {
    const workout = new Workout({ ...req.body, userId: req.user.id });
    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding workout", error: error.message });
  }
};

// Get user's workouts
exports.getMyWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id });
    res.status(200).json({ workouts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving workouts", error: error.message });
  }
};

// Update a workout
exports.updateWorkout = async (req, res) => {
  try {
    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Workout updated successfully",
      updatedWorkout,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating workout", error: error.message });
  }
};

// Delete a workout
exports.deleteWorkout = async (req, res) => {
  try {
    await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting workout", error: error.message });
  }
};

// Mark workout as completed
exports.completeWorkoutStatus = async (req, res) => {
  try {
    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "completed" },
      { new: true }
    );
    res.status(200).json({
      message: "Workout status updated successfully",
      updatedWorkout,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};
