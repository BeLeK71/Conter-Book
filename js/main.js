document.addEventListener("DOMContentLoaded", () => {
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
    this.photo = photo || "./css/default_photo.jpg";
  }

  const initContactArray = () => {
    ContactArray = JSON.parse(localStorage.getItem("contacts")) || [];
  };

  const saveToLocalStorage = () =>
    localStorage.setItem("contacts", JSON.stringify(ContactArray));

  const displayRecord = () => {
    recordContainer.innerHTML = "";
    ContactArray.forEach(addToList);
  };

  const addToList = (item) => {
    const newRecordDiv = document.createElement("div");
    newRecordDiv.className = "record-item";
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
      </button>`;

    recordContainer.appendChild(newRecordDiv);

    newRecordDiv
      .querySelector(".edit-btn")
      .addEventListener("click", () => editContact(item, newRecordDiv));
    newRecordDiv
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteRecord(newRecordDiv, item));
  };

  const editContact = (contact, recordDiv) => {
    nameInput.value = contact.name;
    numberInput.value = contact.number;
    photoInput.value = "";
    addBtn.textContent = "Update";
    addBtn.removeEventListener("click", addContact);
    addBtn.addEventListener("click", () => updateContact(contact, recordDiv));
  };

  const updateContact = (contactToUpdate, recordDiv) => {
    const newName = nameInput.value;
    const newNumber = numberInput.value;
    const newPhoto =
      photoInput.files.length > 0
        ? URL.createObjectURL(photoInput.files[0])
        : contactToUpdate.photo;

    if (
      contactToUpdate.photo !== newPhoto &&
      contactToUpdate.photo.startsWith("blob:")
    ) {
      URL.revokeObjectURL(contactToUpdate.photo);
    }

    const indexToUpdate = ContactArray.findIndex(
      (contact) => contact.id === contactToUpdate.id
    );
    if (indexToUpdate !== -1) {
      ContactArray[indexToUpdate] = {
        name: newName,
        number: newNumber,
        photo: newPhoto,
      };
      saveToLocalStorage();
      displayRecord();
      clearInputFields();
      addBtn.textContent = "Add";
      addBtn.removeEventListener("click", updateContact);
      addBtn.addEventListener("click", addContact);
    }
  };

  const deleteRecord = (recordDiv, contact) => {
    recordContainer.removeChild(recordDiv);
    ContactArray = ContactArray.filter((record) => record.id !== contact.id);

    if (contact.photo.startsWith("blob:")) {
      URL.revokeObjectURL(contact.photo);
    }

    saveToLocalStorage();
  };

  const addContact = () => {
    if (checkInputFields()) {
      setMessage("success", "Record added successfully!");

      const contact = new Contact(
        nameInput.value,
        numberInput.value,
        photoInput.files.length > 0
          ? URL.createObjectURL(photoInput.files[0])
          : "./css/default_photo.jpg"
      );

      contact.id = Date.now();
      ContactArray.push(contact);
      saveToLocalStorage();
      clearInputFields();
      displayRecord();
    } else {
      setMessage("error", "Empty input fields or invalid input!");
    }
  };

  const setMessage = (status, message) => {
    messageBox.innerHTML = message;
    messageBox.className = status;
    removeMessage(status);
  };

  const removeMessage = (status) =>
    setTimeout(() => messageBox.classList.remove(status), 2000);

  const clearInputFields = () => {
    nameInput.value = "";
    numberInput.value = "";
    photoInput.value = "";
  };

  const checkInputFields = () =>
    nameInput.value !== "" &&
    numberInput.value !== "" &&
    phoneNumCheck(numberInput.value);

  const phoneNumCheck = (inputtxt) =>
    /^\(?([0-9]{4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/.test(inputtxt);

  const resetData = () => {
    ContactArray.forEach((contact) => {
      if (contact.photo.startsWith("blob:")) {
        URL.revokeObjectURL(contact.photo);
      }
    });

    ContactArray = [];
    saveToLocalStorage();
    location.reload();
  };

  initContactArray();
  displayRecord();

  addBtn.addEventListener("click", addContact);
  resetBtn.addEventListener("click", resetData);

  cancelBtn.addEventListener("click", () => {
    addBtn.textContent = "Add";
    addBtn.removeEventListener("click", updateContact);
    addBtn.addEventListener("click", addContact);
    clearInputFields();
  });
});
