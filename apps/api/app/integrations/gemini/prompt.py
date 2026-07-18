from typing import List, Dict, Any

class PromptTemplates:
    SYSTEM_INSTRUCTION = (
        "You are an elite, highly experienced business consultant and growth advisor specializing in helping local businesses succeed. "
        "Your expertise covers:\n"
        "- Local SEO and Google Business Profile optimization\n"
        "- Marketing strategies (local, social media, and offline)\n"
        "- Customer reviews, reputation management, and rating improvement\n"
        "- Competitor analysis and differentiation\n"
        "- Sales growth, pricing, and revenue optimization\n"
        "- Customer retention and experience enhancement\n\n"
        "Style and Guidelines:\n"
        "1. Be professional, direct, and encouraging, like talking to an executive consultant.\n"
        "2. Avoid generic, boilerplate advice. Always reference the provided business context, location, rating, and competitor details directly.\n"
        "3. Provide actionable, step-by-step recommendations. Give concrete examples suited for the business category.\n"
        "4. Structure your response clearly using markdown headings, bullet points, and tables where helpful.\n"
        "5. Remind the user about their data when giving recommendations (e.g. 'Since your competitor Bluebird Coffee has 1,280 reviews and you have 348, we should...').\n"
        "6. Do not mention that you are an AI or talk about prompts/context. Address the user directly as their consultant."
    )

    CONTEXT_FORMAT = (
        "### BUSINESS CONTEXT DETAILS\n"
        "- **Organization Name**: {organization_name}\n"
        "- **Business Location**: {business_name}\n"
        "- **Category**: {category}\n"
        "- **Address**: {address}\n"
        "- **Website**: {website}\n"
        "- **Phone**: {phone}\n"
        "- **Verification Status**: {is_verified}\n"
        "- **Average Rating**: {rating}/5.0\n"
        "- **Total Reviews**: {review_count}\n\n"
        "### LOCAL ANALYSIS & COMPETITION (Scan Radius: {radius})\n"
        "- **Business Health Score**: {health_score}/100\n"
        "- **Local SEO Audit Status**: {seo_status}\n"
        "- **Website Status**: {website_status}\n"
        "- **Competition Level**: {competition_level}\n\n"
        "### DETECTED LOCAL COMPETITORS\n"
        "{competitors_list}\n\n"
        "### RECENT REVIEWS SUMMARY\n"
        "- **Overall Sentiment**: {reviews_sentiment}\n"
        "- **Customer Strengths**: {reviews_strengths}\n"
        "- **Customer Pain Points**: {reviews_pain_points}\n\n"
        "### HISTORICAL RECOMMENDATIONS & TASKS STATUS\n"
        "{recommendations_list}\n"
    )


class PromptBuilder:
    @staticmethod
    def build_context_block(context_data: Dict[str, Any]) -> str:
        """
        Formats the loaded business, competitor, review, and report metadata
        into a structured text block for the AI.
        """
        competitors = context_data.get("competitors", [])
        competitors_str = ""
        if competitors:
            for idx, comp in enumerate(competitors, 1):
                competitors_str += (
                    f"{idx}. **{comp['name']}** - Category: {comp['category']} | "
                    f"Distance: {comp['distance']} mi | Rating: {comp['rating']} | Reviews: {comp['reviews']}\n"
                    f"   - Strengths: {', '.join(comp.get('strengths', []))}\n"
                    f"   - Weaknesses: {', '.join(comp.get('weaknesses', []))}\n"
                )
        else:
            competitors_str = "No competitor data available."

        recs = context_data.get("recommendations", [])
        recs_str = ""
        if recs:
            for r in recs:
                recs_str += f"- [{r['status']}] {r['task']}\n"
        else:
            recs_str = "No active recommendations recorded."

        return PromptTemplates.CONTEXT_FORMAT.format(
            organization_name=context_data.get("organization_name", "N/A"),
            business_name=context_data.get("business_name", "N/A"),
            category=context_data.get("category", "N/A"),
            address=context_data.get("address", "N/A"),
            website=context_data.get("website", "N/A"),
            phone=context_data.get("phone", "N/A"),
            is_verified="Verified" if context_data.get("is_verified") else "Unverified",
            rating=context_data.get("rating", "N/A"),
            review_count=context_data.get("review_count", 0),
            radius=context_data.get("radius", "5 km"),
            health_score=context_data.get("health_score", "N/A"),
            seo_status=context_data.get("seo_status", "Needs Attention"),
            website_status=context_data.get("website_status", "Healthy"),
            competition_level=context_data.get("competition_level", "High"),
            competitors_list=competitors_str,
            reviews_sentiment=context_data.get("reviews_sentiment", "N/A"),
            reviews_strengths=context_data.get("reviews_strengths", "N/A"),
            reviews_pain_points=context_data.get("reviews_pain_points", "N/A"),
            recommendations_list=recs_str,
        )

    @staticmethod
    def build_prompt(context_block: str, chat_history: List[Dict[str, str]], current_question: str) -> str:
        """
        Combines the system instruction, business context, conversation history,
        and current user question into the final prompt sent to Gemini.
        """
        history_str = ""
        for msg in chat_history:
            role_label = "User" if msg["role"] == "user" else "Assistant"
            history_str += f"{role_label}: {msg['content']}\n\n"

        prompt = (
            f"You are the Business Advisor. Use the following context details to inform your response. "
            f"Make sure to reference these details directly when relevant to answer the user's questions.\n\n"
            f"{context_block}\n\n"
            f"### CONVERSATION HISTORY\n"
            f"{history_str}"
            f"User: {current_question}\n"
            f"Assistant:"
        )
        return prompt
