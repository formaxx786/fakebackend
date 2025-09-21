import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { doctorModel } from "../models/doctor.models.js";

//API for adding a doctor

const addDoctor = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      image,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      available,
    } = req.body;
    const imageFile = req.file;

    //checking for all data to add doctor
    const requiredFields = {
      name,
      email,
      password,
      imageFile,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      available
    };

    const missingFields = [];
    
    for (const [fieldName, fieldValue] of Object.entries(requiredFields)) {
      if (!fieldValue) {
        missingFields.push(fieldName);
      }
    }

    if (missingFields.length > 0) {
      return res.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    //validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    //validate strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }
    
    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload.secure_url;

    // Handle address - can be JSON string or plain string
    let parsedAddress;
    try {
      // Check if address is already an object
      if (typeof address === 'object') {
        parsedAddress = address;
      } else if (typeof address === 'string') {
        // Try to parse as JSON first, if it fails, treat as plain string
        try {
          console.log('Address to parse:', address);
          parsedAddress = JSON.parse(address);
        } catch (jsonError) {
          // If JSON parsing fails, treat as plain string
          console.log('Treating address as plain string:', address);
          parsedAddress = { fullAddress: address };
        }
      } else {
        throw new Error('Invalid address format');
      }
    } catch (parseError) {
      console.log('Address parsing error:', parseError.message);
      console.log('Address value:', address);
      return res.json({
        success: false,
        message: "Invalid address format.",
      });
    }

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      date: Date.now(),
      available,
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in adding doctor" });
  }
};

export { addDoctor };