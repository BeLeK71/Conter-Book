document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.getElementById("submit-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const resetBtn = document.getElementById("reset-btn");
  const recordContainer = document.querySelector(".record-container");
  const nameInput = document.getElementById("name");
  const numberInput = document.getElementById("contact-num");
  const photoInput = document.getElementById("contact-photo");
  const messageBox = document.querySelector(".message");

  let ContactArray = [];

  function Contact(name, number, photo) {
    this.name = name;
    this.number = number;
    this.photo = photo || "./css/default_photo.jpg"; // Default photo if not provided
  }

  function initContactArray() {
    ContactArray = JSON.parse(localStorage.getItem("contacts")) || [];
  }

  function saveToLocalStorage() {
    localStorage.setItem("contacts", JSON.stringify(ContactArray));
  }

  function displayRecord() {
    recordContainer.innerHTML = "";
    ContactArray.forEach(addToList);
  }

  function addToList(item) {
    const newRecordDiv = document.createElement("div");
    newRecordDiv.classList.add("record-item");
    newRecordDiv.innerHTML = `
            <div class="record-el">
              <span id="labeling">Contact Photo: </span>
              <span id="contact-photo-content">
                <img id="contact-photo" src="${item.photo}" alt="." />
              </span>
            </div>
        
            <div class="record-el">
              <span id="labeling">Name: </span>
              <span id="name-content">${item.name}</span>
            </div>
        
            <div class="record-el">
              <span id="labeling">Contact Number: </span>
              <span id="contact-num-content">${item.number}</span>
            </div>
        
            <button type="button" class="edit-btn">
              <span> <i class="fas fa-edit"></i> </span> Edit
            </button>
            
            <button type="button" class="delete-btn">
              <span> <i class="fas fa-trash"></i> </span> Delete
            </button>
          `;

    recordContainer.appendChild(newRecordDiv);

    const editBtn = newRecordDiv.querySelector(".edit-btn");
    editBtn.addEventListener("click", function () {
      editContact(item, newRecordDiv);
    });

    const deleteBtn = newRecordDiv.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
      deleteRecord(newRecordDiv, item);
    });
  }

  function editContact(contact, recordDiv) {
    nameInput.value = contact.name;
    numberInput.value = contact.number;
    photoInput.value = ""; // Clear the input when editing
    addBtn.textContent = "Update";
    addBtn.removeEventListener("click", addContact);
    addBtn.addEventListener("click", function () {
      updateContact(contact, recordDiv);
    });
  }

  function updateContact(contactToUpdate, recordDiv) {
    const newName = nameInput.value;
    const newNumber = numberInput.value;

    // Check if a new photo is selected
    const newPhoto =
      photoInput.files.length > 0
        ? URL.createObjectURL(photoInput.files[0])
        : contactToUpdate.photo; // Use existing photo if no new photo is provided

    // Revoke the existing object URL to free up resources
    if (
      contactToUpdate.photo !== newPhoto &&
      contactToUpdate.photo.startsWith("blob:")
    ) {
      URL.revokeObjectURL(contactToUpdate.photo);
    }

    contactToUpdate.name = newName;
    contactToUpdate.number = newNumber;
    contactToUpdate.photo = newPhoto;

    saveToLocalStorage();
    clearInputFields();
    displayRecord();

    addBtn.textContent = "Add";
    addBtn.removeEventListener("click", updateContact);
    addBtn.addEventListener("click", addContact);
  }

  function deleteRecord(recordDiv, contact) {
    recordContainer.removeChild(recordDiv);
    ContactArray = ContactArray.filter((record) => record.id !== contact.id);

    // Revoke the object URL of the deleted contact's photo
    if (contact.photo.startsWith("blob:")) {
      URL.revokeObjectURL(contact.photo);
    }

    saveToLocalStorage();
  }

  function addContact() {
    if (checkInputFields()) {
      setMessage("success", "Record added successfully!");

      const contact = new Contact(
        nameInput.value,
        numberInput.value,
        photoInput.files.length > 0
          ? URL.createObjectURL(photoInput.files[0])
          : "./css/default_photo.jpg"
      ); // Use default photo if no new photo is provided
      contact.id = Date.now();
      ContactArray.push(contact);
      saveToLocalStorage();
      clearInputFields();

      displayRecord();
    } else {
      setMessage("error", "Empty input fields or invalid input!");
    }
  }

  function setMessage(status, message) {
    messageBox.innerHTML = message;
    messageBox.classList.add(status);
    removeMessage(status);
  }

  function removeMessage(status) {
    setTimeout(function () {
      messageBox.classList.remove(status);
    }, 2000);
  }

  function clearInputFields() {
    nameInput.value = "";
    numberInput.value = "";
    photoInput.value = "";
  }

  function checkInputFields() {
    if (nameInput.value === "" || numberInput.value === "") {
      return false;
    }
    return phoneNumCheck(numberInput.value);
  }

  function phoneNumCheck(inputtxt) {
    const phoneNo = /^\(?([0-9]{4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;
    return phoneNo.test(inputtxt);
  }

  function resetData() {
    ContactArray.forEach((contact) => {
      // Revoke object URLs of all contacts' photos
      if (contact.photo.startsWith("blob:")) {
        URL.revokeObjectURL(contact.photo);
      }
    });

    ContactArray = [];
    saveToLocalStorage();
    location.reload();
  }

  initContactArray();
  displayRecord();

  addBtn.addEventListener("click", addContact);

  resetBtn.addEventListener("click", resetData);

  cancelBtn.addEventListener("click", function () {
    addBtn.textContent = "Add";
    addBtn.removeEventListener("click", updateContact);
    addBtn.addEventListener("click", addContact);
    clearInputFields();
  });
});
