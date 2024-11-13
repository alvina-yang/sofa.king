from pydantic import BaseModel, Field
from typing import Dict

class TransactionAnalysis(BaseModel):
    total: float = Field(description="The total amount of all transactions.")
    categories: Dict[str, float] = Field(
        description=(
            "A dictionary where each key is a broad category name and each value "
            "is the total amount spent in that category."
        )
    )
