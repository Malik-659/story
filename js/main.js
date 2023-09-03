const API = "http://localhost:8000/Item";
const APIusers = "http://localhost:8000/users";

// --------------------
let regOpen = document.getElementById("regOpen");
let signUp = document.getElementById("singUp");
let inpRegLogin = document.getElementById("inpRegLogin");
let inpRegPassword = document.getElementById("inpRegPassword");
let btnReg = document.getElementById("btnReg");
let btnCloseReg = document.getElementById("btnCloseReg");

regOpen.addEventListener("click", () => {
  signUp.style.display = "block";
});
btnCloseReg.addEventListener("click", () => {
  signUp.style.display = "none";
});

btnReg.addEventListener("click", () => {
  if (!inpRegLogin.value.trim() || !inpRegPassword.value.trim()) {
    alert("заполните поля");
    return;
  }
  let user = {
    login: inpRegLogin.value,
    password: inpRegPassword.value,
    isAdmin: false,
  };
  fetch(APIusers, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  });
  inpRegLogin.value = "";
  inpRegPassword.value = "";
  signUp.style.display = "none";
  alert("Регистрация прошла успешно");
});

// ---------------
let signInOpen = document.getElementById("signInOpen");
let signIn = document.getElementById("singIn");
let inpLogin = document.getElementById("inpLogin");
let inpPassword = document.getElementById("inpPassword");
let btnLogin = document.getElementById("btnLogin");
let btnCloseLogin = document.getElementById("btnCloseLogin");
let userName = document.getElementById("userName");
let logOut = document.getElementById("logOut");
let addPanel = document.getElementById("accordionFlushExample");
let isLogin = false;
let adminRole = false;
let logUser = [];

signInOpen.addEventListener("click", () => {
  signIn.style.display = "block";
});

btnCloseLogin.addEventListener("click", () => {
  signIn.style.display = "none";
});

btnLogin.addEventListener("click", () => {
  if (!inpLogin.value.trim() || !inpPassword.value.trim()) {
    alert("заполните поля");
    return;
  }

  let userCheck = false;
  let user = {
    login: inpLogin.value,
    password: inpPassword.value,
  };
  fetch(APIusers)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      data.forEach((item) => {
        if (item.login == user.login && item.password == user.password) {
          userCheck = true;
          logUser = item;
          userName.innerHTML = logUser.login;
        }
      });
      if (userCheck) {
        isLogin = true;
        signIn.style.display = "none";
        readFunc();
        showIfLogin();
      } else {
        alert("User not found");
        signIn.style.display = "none";
      }
      if (logUser.isAdmin) {
        adminRole = true;
        addPanel.style.display = "block";
      }
    });
  inpLogin.value = "";
  inpPassword.value = "";
});

function showIfLogin() {
  regOpen.style.display = "none";
  signInOpen.style.display = "none";
  logOut.style.display = "block";
}

logOut.addEventListener("click", () => {
  window.location.reload();
});
// -----------------

let inpName = document.getElementById("inpName");
let inpCategory = document.getElementById("inpCategory");
let inpImage = document.getElementById("inpImage");
let inpPrice = document.getElementById("inpPrice");
let inpText = document.getElementById("inpText");
let btnAdd = document.getElementById("btnAdd");
let btnOpenForm = document.getElementById("flush-collapseOne");
let sectionItem = document.getElementById("sectionItem");
let searchValue = "";
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");
let currentPage = 1;
let countPage = 1;
let category = "";

btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpCategory.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim() ||
    !inpText.value.trim()
  ) {
    alert("Заполните поля!");
    return;
  }

  let newTovar = {
    tovarName: inpName.value,
    tovarCategory: inpCategory.value,
    tovarImage: inpImage.value,
    tovarPrice: inpPrice.value,
    tovarText: inpText.value,
  };
  createFunc(newTovar);
  readFunc();
});

//! create
function createFunc(item) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(item),
  }).then(() => readFunc());
  btnOpenForm.classList.toggle("show");
  inpName.value = "";
  inpCategory.value = "";
  inpImage.value = "";
  inpPrice.value = "";
  inpText.value = "";
}

//! read отображение данных

function readFunc() {
  fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=8&tovarCategory_like=${category}`
  )
    .then((res) => res.json())
    .then((data) => {
      sectionItem.innerHTML = "";
      data.forEach((item) => {
        sectionItem.innerHTML += `
                    <div class="card md-4 cardItem mx-auto mb-3" style="width: 18rem">
                        <img class="m-4 card-img-top detailsCard" id="${
                          item.id
                        }" src="${item.tovarImage}" 
                      
                        style="width:240px; height:280px" alt="${
                          item.tovarName
                        }"/>
                        <div class="card-body">
                            <h5 class="card-title">
                            ${item.tovarName}
                            </h5>
                            ${
                              adminRole
                                ? `<button class="btn btn-outline-danger btnDelete" id="${item.id}">Delete</button>
                              <button class="btn btn-outline-success btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>`
                                : ``
                            }
                            
                        </div>
                    </div>
                `;
      });
      pageFunc();
    });
}
readFunc();

{
  /* <p class="card-text">
                            ${item.tovarText}
                            </p> */
}

//! delete

document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readFunc());
  }
});

//! edit

let editInpName = document.getElementById("editInpName");
let editInpCategory = document.getElementById("editInpCategory");
let editInpImage = document.getElementById("editInpImage");
let editInpPrice = document.getElementById("editInpPrice");
let editInpText = document.getElementById("editInpText");
let editBtnSave = document.getElementById("editBtnSave");

document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.tovarName;
        editInpCategory.value = data.tovarCategory;
        editInpImage.value = data.tovarImage;
        editInpPrice.value = data.tovarPrice;
        editInpText.value = data.tovarText;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});

editBtnSave.addEventListener("click", () => {
  let editedItem = {
    tovarName: editInpName.value,
    tovarCategory: editInpCategory.value,
    tovarImage: editInpImage.value,
    tovarPrice: editInpPrice.value,
    tovarText: editInpText.value,
  };
  editBook(editedItem, editBtnSave.id);
});

function editBook(editedItem, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedItem),
  }).then(() => readFunc());
}

//! search

let inpSearch = document.getElementById("inpSearch");

inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value;
  readFunc();
});

//! paginattion

function pageFunc() {
  fetch(`${API}?q=${searchValue}`)
    .then((res) => res.json())
    .then((data) => {
      countPage = Math.ceil(data.length / 8);
    });
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readFunc();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readFunc();
});

//! filter
let btnCategory = document.querySelectorAll(".btnCategory");
let btnAllCategory = document.getElementById("btnAllCategory");

btnAllCategory.addEventListener("click", () => {
  category = "";
  readFunc();
});

btnCategory.forEach((item) => [
  item.addEventListener("click", (e) => {
    category = e.target.innerText;
    readFunc();
  }),
]);

//! details

let detailsModal = document.getElementById("detailsModal");
let detailsModalBody = document.getElementById("detailsModalBody");
let detailsModalClose = document.getElementById("detailsModalClose");

document.addEventListener("click", (e) => {
  let classProduct = [...e.target.classList];
  if (classProduct.includes("detailsCard")) {
    readDetails(e.target.id);
    detailsModal.style.display = "block";
  }
});

function readDetails(id) {
  try {
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        detailsModalBody.innerHTML = `
        <div class="details-img">
        <img class="details-img" src="${data.tovarImage}" alt="icon" />
      </div>
      <div class="details-info">
        <h5 class="card-title">${data.tovarName}</h5>
        <p class="card-text">${data.tovarText}</p>
      </div>
        `;
      });
  } catch {
    console.log("Error");
  }
}

detailsModalClose.addEventListener("click", () => {
  detailsModal.style.display = "none";
});
