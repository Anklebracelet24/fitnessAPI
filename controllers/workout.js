const Workout = require("../models/Workout");

// Add a workout
module.exports.addWorkout = async (req, res) => {
  try {
    // Create a new workout and associate it with the authenticated user
    const workout = new Workout({
      ...req.body,
      userId: req.user.id,
    });

    // Save the workout to the database
    const savedWorkout = await workout.save();

    // Return the saved workout, including the _id
    res.status(201).json(savedWorkout); // Ensure the _id is included in the response
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding workout", error: error.message });
  }
};

// Get user's workouts
module.exports.getMyWorkouts = async (req, res) => {
  try {
    // Ensure that req.user.id exists (to avoid errors)
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    console.log("User ID:", req.user.id);

    // Fetch workouts for the user
    const workouts = await Workout.find({ userId: req.user.id });

    // If no workouts are found, return an empty array and 200 status code
    if (!workouts.length) {
      return res.status(200).json({ workouts: [] }); // Return 200 with empty workouts array
    }

    // If workouts are found, return them with a 200 status code
    res.status(200).json({ workouts });
  } catch (error) {
    // Return 500 for internal server errors
    res
      .status(500)
      .json({ message: "Error retrieving workouts", error: error.message });
  }
};

// Update a workout
module.exports.updateWorkout = async (req, res) => {
  try {
    // Find the workout and ensure it belongs to the authenticated user
    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    // If no workout was found, return a 404 status code with an appropriate message
    if (!updatedWorkout) {
      return res
        .status(404)
        .json({ message: "No workout found for this user" });
    }

    // Return the updated workout
    res.status(200).json({
      message: "Workout updated successfully",
      updatedWorkout,
    });
  } catch (error) {
    // Return 500 for any internal errors
    res.status(500).json({
      message: "Error updating workout",
      error: error.message,
    });
  }
};

// Delete a workout
module.exports.deleteWorkout = async (req, res) => {
  try {
    // Find the workout by ID and ensure it belongs to the authenticated user
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    // If no workout is found, return a 404 error
    if (!workout) {
      // If workout is not found or the user is not authorized, handle the specific cases
      return res.status(404).json({
        message: "Workout not found or not authorized to delete this workout",
      });
    }

    // Return success message if workout was deleted
    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting workout",
      error: error.message,
    });
  }
};

// Mark workout as completed
module.exports.completeWorkoutStatus = async (req, res) => {
  try {
    // Find the workout by ID and ensure it's the user's workout
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "completed" },
      { new: true } // Returns the updated document
    );

    // If no workout is found, return a 404
    if (!workout) {
      return res
        .status(404)
        .json({ message: "Workout not found or not authorized" });
    }

    // Return success with updated workout, including the userId in the response
    res.status(200).json({
      message: "Workout status updated successfully",
      updatedWorkout: {
        id: workout._id, // Include the workout ID
        userId: workout.userId, // Include the userId in the response
        name: workout.name,
        duration: workout.duration,
        status: workout.status,
        dateAdded: workout.dateAdded,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating workout status", error: error.message });
  }
};
