const handleSubmit = async () => {
  // Function to convert file to base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  let base64Image = "";
  if (selectedImage) {
    base64Image = await toBase64(selectedImage);
  }

  try {
    // 1. Changed URL to match your FastAPI @app.post("/api/victim-submit")
    const response = await fetch("http://localhost:8000/api/victim-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // 2. Structuring keys to match what your backend logic expects
        sender_details: {
          firstname: user.firstnameuser,
          lastname: user.lastnameuser,
          address: user.addressuser,
          phone: user.numberuser,
          citizenship_card: base64Image, // Your backend pops this
        },
        victim_details: {
          firstname: user.firstname,
          lastname: user.lastname,
          age: user.age,
          gender: "Not Specified", // Your backend expects 'gender' for verification_data
          address: user.address,
          victim_image: base64Image, // Your backend pops this
        },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Success:", result);
      alert("Successfully registered!");
    } else {
      const errorData = await response.json();
      console.error("Failed:", errorData.detail);
      alert("Error: " + errorData.detail);
    }
  } catch (error) {
    console.error("Network Error:", error);
  }
};
