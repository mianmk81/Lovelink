from utils.gemini import generate_gemini_response

def get_fallback_gemini_plan(request):
    # Step 1: Romantic date plan
    plan_prompt = f"""
Suggest a complete romantic date plan (activities, food, gift, surprise) for a couple.
Location: {request.location}
Budget: {request.budget}
Interests: {request.interests}
Vibe: {request.vibe}
Dietary restrictions: {request.dietary_restrictions}
Preferences: {request.preferences}

Format the response in readable text. Mention food, activity, optional surprise/gift, and reason for each selection.
"""
    date_plan = generate_gemini_response(plan_prompt)

    # Step 2: Fashion advice
    fashion_prompt = f"""
Suggest fashion outfit ideas for a couple going on a {request.vibe} date in {request.location}.
Their style preference is: {request.style_preference or "casual"}.
They own: {', '.join(request.available_clothing) if request.available_clothing else "no specific items"}.
Weather and activities are not known, so give flexible ideas.

Give one outfit idea for a woman, one for a man, and one gender-neutral option.
"""
    fashion_advice = generate_gemini_response(fashion_prompt)

    return {
        "gemini_fallback": date_plan,
        "fashion_advice": fashion_advice
    }