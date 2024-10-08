from pydantic import BaseModel, Field, ConfigDict

class AttributesSchema(BaseModel):
    id: int = Field(..., title="Attribute ID")
    product_id: int = Field(..., title="Product ID")
    value: str = Field(..., title="Attribute Value")

### 속성 기본 스키마 ###
class AttributeBase(BaseModel):
    value: str

    model_config = ConfigDict(from_attributes=True)

### 속성 생성 스키마 ###
class AttributeCreate(AttributeBase):
    pass

# 속성 응답 스키마
class AttributeResponse(BaseModel):
    attribute_id: int = Field(..., title="Attribute ID")
    value: str = Field(..., title="Attribute Value")

    model_config = ConfigDict(from_attributes=True)
