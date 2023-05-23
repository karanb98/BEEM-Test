const dropArea = document.querySelector(".drop-section");
const listSection = document.querySelector(".list-section");
const listContainer = document.querySelector(".list");
const fileSelector = document.querySelector(".file-selector");
const secFileSelector = document.querySelector(".sec-selector");
const fileSelectorInput = document.querySelector(".file-selector-input");
const secFileSelectorInput = document.querySelector(".sec-selector-input");
const imgElement = document.getElementById("imgIcon");
const emptyListContent = document.querySelector(".list-empty");
const staticScreen = document.querySelector(".static-screen");
const uploadScreen = document.querySelector(".upload-screen");
const errorScreen = document.querySelector(".error-screen");
const errorFileName = document.querySelector(".error-file-name");
const uploadFileName = document.querySelector(".upload-file-name");

// upload files with browse button
fileSelector.onclick = () => fileSelectorInput.click();
fileSelectorInput.onchange = () => {
  [...fileSelectorInput.files].forEach((file) => {
    if (typeValidation(file.type)) {
      uploadFile(file);
    } else {
        staticScreen.style.display = "none";
        uploadScreen.style.display = "none";
        errorScreen.style.display = "block";
        errorFileName.innerHTML = `${file.name}`;
    }
  });
};

// upload files when there is an error screen (using "Upload another document")
secFileSelector.onclick = () => secFileSelectorInput.click();
secFileSelectorInput.onchange = () => {
  [...secFileSelectorInput.files].forEach((file) => {
    if (typeValidation(file.type)) {
      uploadFile(file);
    } else {
        staticScreen.style.display = "none";
        uploadScreen.style.display = "none";
        errorScreen.style.display = "block";
        errorFileName.innerHTML = `${file.name}`;
    }
  });
};

// check the file type
function typeValidation(type) {
  if (
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || type === "text/csv"
  ) {
    return true;
  }
}

// when file is over the drag area
dropArea.ondragover = (e) => {
  e.preventDefault();
  [...e.dataTransfer.items].forEach((item) => {
    if (typeValidation(item.type)) {
      dropArea.classList.add("drag-over-effect");
    } else {
        staticScreen.style.display = "none";
        uploadScreen.style.display = "none";
        errorScreen.style.display = "block";
        errorFileName.innerHTML = `${file.name}`;
    }
  });
};
// when file leave the drag area
dropArea.ondragleave = () => {
  dropArea.classList.remove("drag-over-effect");
};

// when file drops on the drag area
dropArea.ondrop = (e) => {
  e.preventDefault();
  dropArea.classList.remove("drag-over-effect");
  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (typeValidation(file.type)) {
          uploadFile(file);
        } else {
            staticScreen.style.display = "none";
        uploadScreen.style.display = "none";
        errorScreen.style.display = "block";
        errorFileName.innerHTML = `${file.name}`;
        }
      } else {
        staticScreen.style.display = "none";
        uploadScreen.style.display = "none";
        errorScreen.style.display = "block";
        errorFileName.innerHTML = `${file.name}`;
      }
    });
  } else {
    [...e.dataTransfer.files].forEach((file) => {
      if (typeValidation(file.type)) {
        uploadFile(file);
      } else {
        staticScreen.style.display = "none";
        uploadScreen.style.display = "none";
        errorScreen.style.display = "block";
        errorFileName.innerHTML = `${file.name}`;
      }
    });
  }
};

// upload file function
function uploadFile(file) {
  listSection.style.display = "block";
  var li = document.createElement("li");
  staticScreen.style.display = "none";
  uploadScreen.style.display = "block";
  errorScreen.style.display = "none";
  uploadFileName.innerHTML = `${file.name}`;
  emptyListContent.style.display = "none";
  li.classList.add("in-prog");
  li.innerHTML = `
        <div class="col">
            <img src="icons/${iconSelector(file.type)}" alt="">
        </div>
        <div class="col">
            <div class="file-name">
                <div class="name">${file.name}</div>
                <span>0%</span>
            </div>
            <div class="file-progress">
                <span></span>
            </div>
            <div class="file-size">${(file.size / (1024 * 1024)).toFixed(
              2
            )} MB</div>
        </div>
        <div class="col">
            <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20"><path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="tick" height="20" width="20"><path d="m8.229 14.438-3.896-3.917 1.438-1.438 2.458 2.459 6-6L15.667 7Z"/></svg>
        </div>
    `;
  listContainer.prepend(li);
  var http = new XMLHttpRequest();
  var data = new FormData();
  data.append("file", file);
  http.onload = () => {
    staticScreen.style.display = "block";
    uploadScreen.style.display = "none";
    errorScreen.style.display = "none";
    li.classList.add("complete");
    li.classList.remove("in-prog");
    imgElement.src = "icons/Spreadsheet-Center.svg";
  };
  http.upload.onprogress = (e) => {
    var percent_complete = (e.loaded / e.total) * 100;
    li.querySelectorAll("span")[0].innerHTML =
      Math.round(percent_complete) + "%";
    li.querySelectorAll("span")[1].style.width = percent_complete + "%";
  };
  http.open("POST", "sender.php", true);
  http.send(data);
  li.querySelector(".cross").onclick = () => http.abort();
  http.onabort = () => li.remove();
}
// find icon for file
function iconSelector(type) {
  var splitType =
    type === "text/csv"
      ? "csv"
      : "xlsx";
  return splitType + ".svg";
}
