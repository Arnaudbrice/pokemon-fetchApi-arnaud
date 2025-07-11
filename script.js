// You can work here or download the template
const userInput = document.getElementById("userInput");

const submitBtn = document.querySelector("button");

const list = document.querySelector("ul");
const reloadBtn = document.getElementById("reload");
const getLocalStorageItems = () =>
  JSON.parse(localStorage.getItem("items")) || [];
const updateLocalStorageItems = items =>
  localStorage.setItem("items", JSON.stringify(items));

//********** handle click event on the submit button **********

const handleSubmit = event => {
  event.preventDefault();

  const userInputValue = userInput.value.trim();
  if (!userInputValue) {
    return;
  }

  const id = self.crypto.randomUUID();
  const item = {
    id: id.replaceAll("-", ""),
    content: userInputValue
  };

  //retrieves items array from the local storage
  const arrayItems = getLocalStorageItems();

  // the submitted item will be at the top of the todo list
  const updatedArray = [item, ...arrayItems];

  //update the localStorage
  updateLocalStorageItems(updatedArray);

  const listItem = createListItem(item);
  list.prepend(listItem);

  //clear the input
  userInput.value = "";
  // form.reset() if I use form to handle submit event
};

//********** Create list item

const createListItem = item => {
  const listItem = document.createElement("li");
  listItem.setAttribute("id", item.id);

  const paragraph = document.createElement("p");
  paragraph.textContent = item.content;

  const redBtn = document.createElement("button");
  redBtn.textContent = "Delete";

  listItem.appendChild(paragraph);

  listItem.appendChild(redBtn);

  // list.classList.add("grid","grid-cols-[1fr]","gap-4");
  // for grid we have justify-items instead of justify-content
  //and we have align-items like in flex
  // therefore we can use place-items to do justify-items and align-items
  listItem.classList.add(
    "grid",
    "grid-cols-[1fr_auto]",
    "items-center",
    "gap-4",
    "my-4"
  );

  paragraph.classList.add("wrap-anywhere");
  redBtn.classList.add(
    "bg-red-500",
    "hover:bg-red-400",
    "text-white",
    "p-2",
    "rounded",
    "min-w-[80px]",
    "redBtn"
  );
  return listItem;
};

//********** Create list item and populate the list**********
const refreshPage = () => {
  //retrieves items array from the local storage
  const arrayItems = getLocalStorageItems();
  //clear list children to replace it with list item from the local Storage
  list.replaceChildren(); //is better than list./textContent/innerHTML=""

  console.log("arrayItems here", arrayItems);

  for (const itemObject of arrayItems) {
    const listItem = createListItem(itemObject);

    list.appendChild(listItem);
  }
};

//*** handle click event on a list item (will handle click event on delete button) ****

//use of event bubbling here
//Event bubbling us to attach a single event handler to a parent element to handle events that occur on its children
const handleDelete = event => {
  console.log("event.target", event.target); //button
  // Only handle clicks on delete buttons otherwise clicking on text near of the button will also delete the list item
  if (!event.target.classList.contains("redBtn")) {
    return;
  }

  // const listItemToRemove = event.target.parentElement; //li

  const listItemToRemove = event.target.closest("li"); //li (closest for safer element targeting)
  listItemToRemove.remove();

  console.log("listItemToRemove", listItemToRemove.getAttribute("id"));
  //retrieves items array from the local storage
  const arrayItems = getLocalStorageItems();
  //filter the arrayItems to remove deleted item
  const filteredArray = arrayItems.filter(
    item => item.id !== listItemToRemove.getAttribute("id")
  );

  console.log("filteredArray", filteredArray);
  //update the localStorage with the new filteredArray
  updateLocalStorageItems(filteredArray);
};

// handle load event for refreshing the page
const handleRefresh = () => {
  refreshPage();
};

//********** handle click event on the reload button **********

const handleReload = () => {
  window.location.reload();
};

// event listeners:
submitBtn.addEventListener("click", handleSubmit);

list.addEventListener("click", handleDelete);

window.addEventListener("load", handleRefresh);

reloadBtn.addEventListener("click", handleReload);
