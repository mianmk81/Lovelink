from schemas.request_schemas import DateRequest
from services.logic.fallback_gemini import get_fallback_gemini_plan

if __name__ == "__main__":
    # Sample input request
    request = DateRequest(
        location="Atlanta, GA",
        budget="$75",
        interests=["art", "coffee", "walking"],
        dietary_restrictions=["vegetarian"],
        preferences=["walkable", "free_parking"],
        vibe="romantic",
        style_preference="casual",  # "casual", "elevated", "trendy"
        available_clothing=["white sneakers", "denim jacket", "black dress pants"]
    )

    result = get_fallback_gemini_plan(request)

    print("\n💘 Gemini Fallback Romantic Date Plan:\n")
    print(result["gemini_fallback"])

    print("\n👗 Fashion Advice for the Couple:\n")
    print(result["fashion_advice"])