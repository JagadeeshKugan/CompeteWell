from typing import Generator, List, Dict, Any, Optional
from app.integrations.gemini.client import GeminiClient
from app.integrations.gemini.prompt import PromptBuilder, PromptTemplates


class BusinessAdvisorService:
    def __init__(self, api_key: Optional[str] = None):
        self.client = GeminiClient(api_key=api_key)

    def generate_advisor_stream(
        self,
        context_data: Dict[str, Any],
        chat_history: List[Dict[str, str]],
        current_question: str,
    ) -> Generator[str, None, None]:
        """
        Builds the context and history prompt and streams response chunks from GeminiClient.
        """
        # 1. Format the business context fields into a block of text
        context_block = PromptBuilder.build_context_block(context_data)

        # 2. Build the stateless prompt including context block, history, and new query
        prompt = PromptBuilder.build_prompt(
            context_block=context_block,
            chat_history=chat_history,
            current_question=current_question,
        )

        # 3. Call the client with the custom system prompt and prompt
        return self.client.stream_chat(
            prompt=prompt, system_instruction=PromptTemplates.SYSTEM_INSTRUCTION
        )
