from bson import ObjectId

from pydantic import EmailStr, Field, BaseModel, validator

from email_validator import validate_email, EmailNotValidError


class PyObjectId(ObjectId):
  @classmethod
  def __get_validators__(cls):
    yield cls.validate

  @classmethod
  def validate(cls, v):
    if not ObjectId.is_valid(v):
      raise ValueError("Invalid objectid")
    return ObjectId(v)

  @classmethod
  def __modify_schema__(cls, field_schema):
    field_schema.update(type="string")


class MongoBaseModel(BaseModel):
  id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

  class Config:
    json_encoders = {ObjectId: str}


class UserBase(MongoBaseModel):
  email: str = Field(...)
  password: str = Field(...)

  @validator("email")
  def valid_email(cls, v):
    try:
      email = validate_email(v).email
      return email
    except EmailNotValidError as e:
      raise EmailNotValidError


class LoginBase(BaseModel):
  email: str = EmailStr(...)
  password: str = Field(...)


class CurrentUser(BaseModel):
  email: str = EmailStr(...)
