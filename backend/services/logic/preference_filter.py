def filter_options(options, preferences):
    if not preferences:
        return options

    filtered = []
    for opt in options:
        score = 0
        if "walkable" in preferences and opt.get("walkable_from"):
            score += 1
        if "free_parking" in preferences and "free" in opt.get("parking_tip", "").lower():
            score += 1
        if "transit_friendly" in preferences and opt.get("transit_suggestion"):
            score += 1
        if score > 0:
            filtered.append(opt)

    return filtered or options