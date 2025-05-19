import supabaseApi from './supabaseApi';

/**
 * Save a completed date plan to Supabase
 * This function takes the locally stored date plan information and saves it to Supabase
 * It handles creating activities, restaurants, and the date plan itself
 */
export const saveCompletedDatePlan = async () => {
  try {
    // Check if user is logged in
    const { data: userData } = await supabaseApi.getCurrentUser();
    if (!userData || !userData.user) {
      console.log("User not logged in, skipping Supabase save");
      return { success: false, message: "User not logged in" };
    }
    
    // Get the current date plan from localStorage
    const datePlanData = JSON.parse(localStorage.getItem('currentDatePlan') || '{}');
    if (!datePlanData.title) {
      console.log("No date plan found in localStorage");
      return { success: false, message: "No date plan found" };
    }
    
    // Create the date plan in Supabase
    const { data: datePlan, error: datePlanError } = await supabaseApi.createDatePlan({
      title: datePlanData.title,
      scheduledFor: datePlanData.scheduledFor,
      location: datePlanData.location,
      budget: datePlanData.budget,
      notes: datePlanData.notes
    });
    
    if (datePlanError) {
      console.error("Error creating date plan:", datePlanError);
      return { success: false, message: "Error creating date plan" };
    }
    
    // Process activity if available
    if (datePlanData.activity) {
      await processActivity(datePlan.date_plan_id, datePlanData.activity);
    }
    
    // Process restaurant if available
    if (datePlanData.restaurant) {
      await processRestaurant(datePlan.date_plan_id, datePlanData.restaurant);
    }
    
    // Clear the temporary data from localStorage
    localStorage.removeItem('currentDatePlan');
    localStorage.removeItem('savedActivities');
    localStorage.removeItem('savedRestaurants');
    
    return { 
      success: true, 
      message: "Date plan saved successfully", 
      datePlanId: datePlan.date_plan_id 
    };
  } catch (error) {
    console.error("Error saving date plan to Supabase:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Process and save an activity to Supabase
 * @param {string} datePlanId - The date plan ID
 * @param {Object} activity - The activity data
 */
const processActivity = async (datePlanId, activity) => {
  try {
    // Check if activity exists
    const { data: activities } = await supabaseApi.getActivities({ name: activity.name });
    
    let activityId;
    
    if (activities && activities.length > 0) {
      // Use existing activity
      activityId = activities[0].activity_id;
    } else {
      // Create new activity
      const { data: newActivity, error } = await supabaseApi.createActivity({
        name: activity.name,
        description: activity.description,
        image_url: activity.image,
        type: activity.type || 'Entertainment',
        price_range: activity.price_range || 'medium',
        tags: activity.tags || []
      });
      
      if (error) throw error;
      activityId = newActivity.activity_id;
    }
    
    // Add activity to date plan
    if (activityId) {
      await supabaseApi.addActivityToDatePlan(datePlanId, activityId);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error processing activity:", error);
    return { success: false, error };
  }
};

/**
 * Process and save a restaurant to Supabase
 * @param {string} datePlanId - The date plan ID
 * @param {Object} restaurant - The restaurant data
 */
const processRestaurant = async (datePlanId, restaurant) => {
  try {
    // Check if restaurant exists
    const { data: restaurants } = await supabaseApi.getRestaurants({ name: restaurant.name });
    
    let restaurantId;
    
    if (restaurants && restaurants.length > 0) {
      // Use existing restaurant
      restaurantId = restaurants[0].restaurant_id;
    } else {
      // Create new restaurant
      const { data: newRestaurant, error } = await supabaseApi.createRestaurant({
        name: restaurant.name,
        cuisine: restaurant.cuisine || 'Various',
        price_range: restaurant.price_range || 'medium',
        image_url: restaurant.image,
        rating: restaurant.rating || 4.5,
        tags: restaurant.vibe || []
      });
      
      if (error) throw error;
      restaurantId = newRestaurant.restaurant_id;
    }
    
    // Add restaurant to date plan
    if (restaurantId) {
      await supabaseApi.addRestaurantToDatePlan(datePlanId, restaurantId);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error processing restaurant:", error);
    return { success: false, error };
  }
};

export default {
  saveCompletedDatePlan
};
