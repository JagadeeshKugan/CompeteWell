import os
import logging
from typing import Generator, Optional
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                logger.info("Gemini client configured successfully.")
            except Exception as e:
                logger.error(f"Error configuring Gemini SDK: {e}")
        else:
            logger.warning("GEMINI_API_KEY not found in settings or environment.")

    def stream_chat(
        self, prompt: str, system_instruction: Optional[str] = None
    ) -> Generator[str, None, None]:
        """
        Sends the prompt to Gemini and streams the text response chunk by chunk.
        """
        if not self.api_key:
            yield (
                "Error: GEMINI_API_KEY is not configured in the backend environment. "
                "Please add GEMINI_API_KEY to your backend .env file to enable the Business Advisor."
            )
            return

        try:
            # Using gemini-1.5-flash as the specialized consultant model
            model_name = "gemini-1.5-flash"
            
            config = genai.types.GenerationConfig(
                temperature=0.4,  # Lower temperature for more factual consultant responses
                max_output_tokens=2048,
            )
            
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config=config,
                system_instruction=system_instruction
            )
            
            response = model.generate_content(prompt, stream=True)
            for chunk in response:
                # Handle possible empty text or safety blocks
                try:
                    if chunk.text:
                        yield chunk.text
                except Exception as chunk_err:
                    logger.debug(f"Skipping empty or blocked chunk: {chunk_err}")
                    continue
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}")
            yield f"\n\nError calling Gemini API: {str(e)}"
