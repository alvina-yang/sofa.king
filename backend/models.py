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

class SubcategoryBreakdown(BaseModel):
    """Represents the breakdown of subcategories within a category."""
    total: float = Field(description="The total amount spent in this category.")
    breakdown: Dict[str, float] = Field(
        description="A dictionary where each key is a subcategory name and each value is the amount spent in that subcategory."
    )


class DetailedTransactionAnalysis(BaseModel):
    """Represents the detailed transaction analysis for all categories."""
    total: float = Field(description="The overall total amount spent across all transactions.")
    categories: Dict[str, SubcategoryBreakdown] = Field(
        description="A dictionary where each key is a category name and each value is a detailed breakdown of that category."
    )