const addBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const resetBtn = document.getElementById("reset-btn");
const recordContainer = document.querySelector(".record-container");
const nameInput = document.getElementById("name");
const numberInput = document.getElementById("contact-num");
const photoInput = document.getElementById("contact-photo");
const messageBox = document.querySelector(".message");

let helperPhoto = "";

const checkLocalStoerage = () => {
  let dataLS = localStorage.getItem("contact");

  if (!dataLS) {
    localStorage.setItem("contact", JSON.stringify([]));
    return;
  } else {
    return dataLS;
  }
};

const setLocalStorage = (object) => {
  localStorage.setItem("contact", object);
};

const createContactLS = () => {
  const newContact = {
    name: nameInput.value,
    number: numberInput.value,
    image: helperPhoto,
  };

  console.log(newContact);

  const data = checkLocalStoerage();

  if (data) {
    data.push(newContact);
    setLocalStorage(data);
    helperPhoto = "";
  }
};

addBtn.addEventListener("click", () => {
  createContactLS();
});

photoInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
    // Создаем объект Blob из файла
    const blob = new Blob([file], { type: file.type });

    // Создаем локальную ссылку для Blob
    const localURL = URL.createObjectURL(blob);

    helperPhoto = localURL;
  }
});
