import supabase from './supabaseClient';

// ==================== USER AUTHENTICATION ====================

/**
 * Register a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} username - User's username
 * @returns {Promise} - Registration result
 */
export const registerUser = async (email, password, username) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        }
      }
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error registering user:', error);
    return { data: null, error };
  }
};

/**
 * Login a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Login result
 */
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error logging in:', error);
    return { data: null, error };
  }
};

/**
 * Logout the current user
 * @returns {Promise} - Logout result
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error logging out:', error);
    return { error };
  }
};

/**
 * Get the current logged-in user
 * @returns {Promise} - Current user data
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { data: null, error };
  }
};

// ==================== PROFILE MANAGEMENT ====================

/**
 * Create or update a user profile
 * @param {Object} profileData - Profile data including name, birthday, etc.
 * @returns {Promise} - Profile creation/update result
 */
export const upsertProfile = async (profileData) => {
  try {
    const { data: userData } = await getCurrentUser();
    if (!userData) throw new Error('User not authenticated');
    
    const userId = userData.user.id;
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    let profileId = existingProfile?.profile_id;
    let result;
    
    // If profile exists, update it
    if (profileId) {
      result = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          birthday: profileData.birthday,
          favorite_food: profileData.favoriteFood,
          favorite_movie: profileData.favoriteMovie,
          updated_at: new Date().toISOString()
        })
        .eq('profile_id', profileId)
        .select()
        .single();
    } else {
      // Create new profile
      result = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          name: profileData.name,
          birthday: profileData.birthday,
          favorite_food: profileData.favoriteFood,
          favorite_movie: profileData.favoriteMovie
        })
        .select()
        .single();
      
      if (result.data) {
        profileId = result.data.profile_id;
      }
    }
    
    if (result.error) throw result.error;
    
    // Handle hobbies if provided
    if (profileData.hobbies && profileData.hobbies.length > 0 && profileId) {
      // Delete existing hobbies
      await supabase
        .from('hobbies')
        .delete()
        .eq('profile_id', profileId);
      
      // Insert new hobbies
      const hobbiesData = profileData.hobbies.map(hobby => ({
        profile_id: profileId,
        hobby_name: hobby
      }));
      
      const { error: hobbiesError } = await supabase
        .from('hobbies')
        .insert(hobbiesData);
      
      if (hobbiesError) throw hobbiesError;
    }
    
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error upserting profile:', error);
    return { data: null, error };
  }
};

/**
 * Create or update a partner profile
 * @param {Object} partnerData - Partner profile data
 * @returns {Promise} - Partner profile creation/update result
 */
export const upsertPartnerProfile = async (partnerData) => {
  try {
    const { data: userData } = await getCurrentUser();
    if (!userData) throw new Error('User not authenticated');
    
    const userId = userData.user.id;
    
    // Create partner profile
    const { data: partnerProfile, error: partnerError } = await supabase
      .from('profiles')
      .insert({
        name: partnerData.name,
        birthday: partnerData.birthday,
        favorite_food: partnerData.favoriteFood,
        favorite_movie: partnerData.favoriteMovie
      })
      .select()
      .single();
    
    if (partnerError) throw partnerError;
    
    // Create relationship
    const { error: relationshipError } = await supabase
      .from('relationships')
      .insert({
        user_id: userId,
        partner_id: partnerProfile.profile_id,
        anniversary: partnerData.anniversary
      });
    
    if (relationshipError) throw relationshipError;
    
    // Handle hobbies if provided
    if (partnerData.hobbies && partnerData.hobbies.length > 0) {
      const hobbiesData = partnerData.hobbies.map(hobby => ({
        profile_id: partnerProfile.profile_id,
        hobby_name: hobby
      }));
      
      const { error: hobbiesError } = await supabase
        .from('hobbies')
        .insert(hobbiesData);
      
      if (hobbiesError) throw hobbiesError;
    }
    
    return { data: partnerProfile, error: null };
  } catch (error) {
    console.error('Error upserting partner profile:', error);
    return { data: null, error };
  }
};

/**
 * Get a user's profile
 * @returns {Promise} - User profile data
 */
export const getUserProfile = async () => {
  try {
    const { data: userData } = await getCurrentUser();
    if (!userData) throw new Error('User not authenticated');
    
    const userId = userData.user.id;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        hobbies(*)
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return { data: profile, error: null };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { data: null, error };
  }
};

/**
 * Get a user's partner profile
 * @returns {Promise} - Partner profile data
 */
export const getPartnerProfile = async () => {
  try {
    const { data: userData } = await getCurrentUser();
    if (!userData) throw new Error('User not authenticated');
    
    const userId = userData.user.id;
    
    // First, get the relationship data
    const { data: relationship, error: relationshipError } = await supabase
      .from('relationships')
      .select(`
        *,
        partner:partner_id(
          *,
          hobbies(*)
        )
      `)
      .eq('user_id', userId)
      .single();
    
    if (relationshipError) {
      console.error('Error getting relationship:', relationshipError);
      return { data: null, error: relationshipError };
    }
    
    console.log("Raw relationship data from Supabase:", relationship);
    
    return { data: relationship, error: null };
  } catch (error) {
    console.error('Error getting partner profile:', error);
    return { data: null, error };
  }
};

// ==================== DATE PLAN MANAGEMENT ====================

/**
 * Create a new date plan
 * @param {Object} datePlanData - Date plan data
 * @returns {Promise} - Date plan creation result
 */
export const createDatePlan = async (datePlanData) => {
  try {
    const { data: userData } = await getCurrentUser();
    if (!userData) throw new Error('User not authenticated');
    
    const userId = userData.user.id;
    
    // Create date plan
    const { data: datePlan, error: datePlanError } = await supabase
      .from('date_plans')
      .insert({
        user_id: userId,
        title: datePlanData.title,
        scheduled_for: datePlanData.scheduledFor,
        location: datePlanData.location,
        budget: datePlanData.budget,
        notes: datePlanData.notes
      })
      .select()
      .single();
    
    if (datePlanError) throw datePlanError;
    
    // Add restaurant and activity if provided
    if (datePlanData.restaurantId || datePlanData.activityId) {
      let detailOrder = 1;
      const details = [];
      
      if (datePlanData.restaurantId) {
        details.push({
          date_plan_id: datePlan.date_plan_id,
          restaurant_id: datePlanData.restaurantId,
          detail_order: detailOrder++
        });
      }
      
      if (datePlanData.activityId) {
        details.push({
          date_plan_id: datePlan.date_plan_id,
          activity_id: datePlanData.activityId,
          detail_order: detailOrder++
        });
      }
      
      if (details.length > 0) {
        const { error: detailsError } = await supabase
          .from('date_plan_details')
          .insert(details);
        
        if (detailsError) throw detailsError;
      }
    }
    
    return { data: datePlan, error: null };
  } catch (error) {
    console.error('Error creating date plan:', error);
    return { data: null, error };
  }
};

/**
 * Get all date plans for the current user
 * @returns {Promise} - User's date plans
 */
export const getDatePlans = async () => {
  try {
    const { data: userData } = await getCurrentUser();
    if (!userData) throw new Error('User not authenticated');
    
    const userId = userData.user.id;
    
    const { data: datePlans, error } = await supabase
      .from('date_plans')
      .select(`
        *,
        date_plan_details(
          *,
          restaurant:restaurant_id(*),
          activity:activity_id(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data: datePlans, error: null };
  } catch (error) {
    console.error('Error getting date plans:', error);
    return { data: null, error };
  }
};

/**
 * Get a specific date plan by ID
 * @param {string} datePlanId - Date plan ID
 * @returns {Promise} - Date plan data
 */
export const getDatePlanById = async (datePlanId) => {
  try {
    const { data: datePlan, error } = await supabase
      .from('date_plans')
      .select(`
        *,
        date_plan_details(
          *,
          restaurant:restaurant_id(*),
          activity:activity_id(*)
        )
      `)
      .eq('date_plan_id', datePlanId)
      .single();
    
    if (error) throw error;
    
    return { data: datePlan, error: null };
  } catch (error) {
    console.error('Error getting date plan:', error);
    return { data: null, error };
  }
};

// ==================== ACTIVITIES & RESTAURANTS ====================

/**
 * Get activities based on filters
 * @param {Object} filters - Filter criteria
 * @returns {Promise} - Filtered activities
 */
export const getActivities = async (filters = {}) => {
  try {
    let query = supabase
      .from('activities')
      .select(`
        *,
        activity_tags(*)
      `);
    
    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters.priceRange) {
      query = query.eq('price_range', filters.priceRange);
    }
    
    // Get results
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting activities:', error);
    return { data: null, error };
  }
};

/**
 * Get restaurants based on filters
 * @param {Object} filters - Filter criteria
 * @returns {Promise} - Filtered restaurants
 */
export const getRestaurants = async (filters = {}) => {
  try {
    let query = supabase
      .from('restaurants')
      .select(`
        *,
        restaurant_tags(*)
      `);
    
    // Apply filters
    if (filters.cuisine) {
      query = query.eq('cuisine', filters.cuisine);
    }
    
    if (filters.priceRange) {
      query = query.eq('price_range', filters.priceRange);
    }
    
    // Get results
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting restaurants:', error);
    return { data: null, error };
  }
};

/**
 * Get local events
 * @returns {Promise} - Local events data
 */
export const getLocalEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('local_events')
      .select('*')
      .order('event_date', { ascending: true });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting local events:', error);
    return { data: null, error };
  }
};

/**
 * Create a new activity
 * @param {Object} activityData - Activity data
 * @returns {Promise} - Activity creation result
 */
export const createActivity = async (activityData) => {
  try {
    // Create activity
    const { data, error } = await supabase
      .from('activities')
      .insert({
        name: activityData.name,
        description: activityData.description,
        image_url: activityData.image_url,
        type: activityData.type,
        price_range: activityData.price_range
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add tags if provided
    if (activityData.tags && activityData.tags.length > 0 && data) {
      const tagsData = activityData.tags.map(tag => ({
        activity_id: data.activity_id,
        tag_name: tag
      }));
      
      const { error: tagsError } = await supabase
        .from('activity_tags')
        .insert(tagsData);
      
      if (tagsError) throw tagsError;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating activity:', error);
    return { data: null, error };
  }
};

/**
 * Create a new restaurant
 * @param {Object} restaurantData - Restaurant data
 * @returns {Promise} - Restaurant creation result
 */
export const createRestaurant = async (restaurantData) => {
  try {
    // Create restaurant
    const { data, error } = await supabase
      .from('restaurants')
      .insert({
        name: restaurantData.name,
        cuisine: restaurantData.cuisine,
        price_range: restaurantData.price_range,
        image_url: restaurantData.image_url,
        rating: restaurantData.rating
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add tags if provided
    if (restaurantData.tags && restaurantData.tags.length > 0 && data) {
      const tagsData = restaurantData.tags.map(tag => ({
        restaurant_id: data.restaurant_id,
        tag_name: tag
      }));
      
      const { error: tagsError } = await supabase
        .from('restaurant_tags')
        .insert(tagsData);
      
      if (tagsError) throw tagsError;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return { data: null, error };
  }
};

/**
 * Add an activity to a date plan
 * @param {string} datePlanId - Date plan ID
 * @param {string} activityId - Activity ID
 * @returns {Promise} - Result of adding activity to date plan
 */
export const addActivityToDatePlan = async (datePlanId, activityId) => {
  try {
    const { data, error } = await supabase
      .from('date_plan_details')
      .insert({
        date_plan_id: datePlanId,
        activity_id: activityId,
        detail_order: 1
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error adding activity to date plan:', error);
    return { data: null, error };
  }
};

/**
 * Add a restaurant to a date plan
 * @param {string} datePlanId - Date plan ID
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise} - Result of adding restaurant to date plan
 */
export const addRestaurantToDatePlan = async (datePlanId, restaurantId) => {
  try {
    const { data, error } = await supabase
      .from('date_plan_details')
      .insert({
        date_plan_id: datePlanId,
        restaurant_id: restaurantId,
        detail_order: 2
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error adding restaurant to date plan:', error);
    return { data: null, error };
  }
};

// ==================== USER PREFERENCES ====================

/**
 * Save user preferences
 * @param {Object} preferences - User preferences
 * @returns {Promise} - Preferences save result
 */
export const saveUserPreferences = async (preferences) => {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      console.log('No authenticated user found, skipping database save');
      // Save to localStorage as fallback
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      return { data: null, error: new Error('User not authenticated') };
    }
    
    const userId = user.id;
    
    // Check if preferences exist
    const { data: existingPrefs } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    let result;
    
    // If preferences exist, update them
    if (existingPrefs) {
      result = await supabase
        .from('user_preferences')
        .update({
          dietary_needs: preferences.dietaryNeeds || [],
          transit_preferences: preferences.transitPreferences || [],
          budget_preference: preferences.budgetPreference || 'medium',
          updated_at: new Date().toISOString()
        })
        .eq('preference_id', existingPrefs.preference_id)
        .select()
        .single();
    } else {
      // Create new preferences
      result = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          dietary_needs: preferences.dietaryNeeds || [],
          transit_preferences: preferences.transitPreferences || [],
          budget_preference: preferences.budgetPreference || 'medium'
        })
        .select()
        .single();
    }
    
    if (result.error) throw result.error;
    
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return { data: null, error };
  }
};

/**
 * Get user preferences
 * @returns {Promise} - User preferences data
 */
export const getUserPreferences = async () => {
  try {
    // First check if we have a valid session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      // Return default preferences if no user is logged in
      console.log('No authenticated user found, returning default preferences');
      return { 
        data: { 
          dietary_needs: [], 
          transit_preferences: [], 
          budget_preference: 'medium' 
        }, 
        error: null 
      };
    }
    
    const userId = session.user.id;
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" error
    
    return { 
      data: data || { 
        dietary_needs: [], 
        transit_preferences: [], 
        budget_preference: 'medium' 
      }, 
      error: null 
    };
  } catch (error) {
    console.log('Error getting user preferences:', error);
    return { data: null, error };
  }
};

// ==================== DATE HISTORY ====================

/**
 * Save date history (completed date)
 * @param {Object} historyData - Date history data
 * @returns {Promise} - History save result
 */
export const saveDateHistory = async (historyData) => {
  try {
    const { data, error } = await supabase
      .from('date_history')
      .insert({
        date_plan_id: historyData.datePlanId,
        completed_at: historyData.completedAt || new Date().toISOString(),
        rating: historyData.rating,
        notes: historyData.notes,
        photos: historyData.photos || []
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update date plan status
    await supabase
      .from('date_plans')
      .update({ status: 'completed' })
      .eq('date_plan_id', historyData.datePlanId);
    
    return { data, error: null };
  } catch (error) {
    console.error('Error saving date history:', error);
    return { data: null, error };
  }
};

/**
 * Get date history for a user
 * @returns {Promise} - Date history data
 */
export const getDateHistory = async () => {
  try {
    const { data: userData } = await getCurrentUser();
    if (!userData) throw new Error('User not authenticated');
    
    const userId = userData.user.id;
    
    const { data, error } = await supabase
      .from('date_history')
      .select(`
        *,
        date_plan:date_plan_id(
          *,
          date_plan_details(
            *,
            restaurant:restaurant_id(*),
            activity:activity_id(*)
          )
        )
      `)
      .eq('date_plan.user_id', userId)
      .order('completed_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting date history:', error);
    return { data: null, error };
  }
};

const supabaseApi = {
  // Auth
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  
  // Profiles
  upsertProfile,
  upsertPartnerProfile,
  getUserProfile,
  getPartnerProfile,
  
  // Date Plans
  createDatePlan,
  getDatePlans,
  getDatePlanById,
  
  // Activities & Restaurants
  getActivities,
  getRestaurants,
  getLocalEvents,
  createActivity,
  createRestaurant,
  addActivityToDatePlan,
  addRestaurantToDatePlan,
  
  // Preferences
  saveUserPreferences,
  getUserPreferences,
  
  // History
  saveDateHistory,
  getDateHistory
};

export default supabaseApi;
