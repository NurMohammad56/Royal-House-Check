import { Contact } from "../model/contactus.model.js";

export const createContact = async (req, res) => {
  try {
    const { inquiryType, fullName, email, phone, message } = req.body;

    const newContact = new Contact({
      inquiryType,
      fullName,
      email,
      phone,
      message,
    });

    await newContact.save();
    res.status(201).json({ message: 'Contact submission saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};