from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date
from sqlalchemy.orm import relationship
from db import Base 

class Victim(Base):
    __tablename__ = "victims"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("senders.id"))
    sender = relationship("Sender", back_populates="victims")
    first_name = Column(String)
    last_name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    address = Column(String)
    lastseen = Column(String)
    moredetails = Column(String)
    phone = Column(String)
    date = Column(Date)
    status = Column(String)
    victim_image = Column(String)

class Sender(Base):
    __tablename__ = "senders"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    address = Column(String)
    phone = Column(String)
    relationship = Column(String)
    citizenship_card = Column(String)
    victims = relationship("Victim", back_populates="sender")




