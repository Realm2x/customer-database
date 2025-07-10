import { onClose } from "./utils.js";
import { searchLocalClient } from "./storage.js";

// Функция создания карточки клиента
export const cardClient = async (id, mainElement) => {
    const client = await searchLocalClient(id);

    const wrapperCard = document.createElement("div"),
        card = document.createElement("div"),
        clientName = document.createElement("h2"),
        clientContact = document.createElement("h2"),
        clientButtonClose = document.createElement("button");

    wrapperCard.classList.add("modal__wrapper", "modal__wrapper--active");
    card.classList.add("card");
    clientName.classList.add("client__name", "title-reset");
    clientContact.classList.add("client__contacts", "title-reset");
    clientButtonClose.classList.add("btn-reset", "form__button-close");

    clientName.textContent =
        client.surname + " " + client.name + " " + client.lastName;
    clientContact.textContent = "Контакты";

    card.append(clientName);
    card.append(clientContact);
    card.append(clientButtonClose);
    wrapperCard.append(card);

    for (const item of client.contacts) {
        const clientGroupContacts = document.createElement("div");
        const clientCardContactsInfo = document.createElement("span");
        const clientCardContactsLink = document.createElement("a");

        clientGroupContacts.classList.add("client__contact-group");
        clientCardContactsInfo.classList.add("client__contact-type");
        clientCardContactsLink.classList.add("client__contact-link");

        if (item.type === "Телефон") {
            clientCardContactsLink.href = "tel:" + item.value;
        } else if (item.type === "Email") {
            clientCardContactsLink.href = "mailto:" + item.value;
        }

        clientCardContactsLink.textContent = item.value;
        clientCardContactsInfo.textContent = item.type + ":";

        clientGroupContacts.append(clientCardContactsInfo);
        clientGroupContacts.append(clientCardContactsLink);
        card.append(clientGroupContacts);
    }

    clientButtonClose.addEventListener("click", (e) => {
        e.preventDefault();

        onClose(wrapperCard);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            onClose(wrapperCard);
        }
    });

    let mouseDownInsideCard = false;

    card.addEventListener("mousedown", (event) => {
        event._isClickWithInModal = true;
        mouseDownInsideCard = true;
    });

    wrapperCard.addEventListener("mouseup", (event) => {
        if (mouseDownInsideCard) {
            mouseDownInsideCard = false;
            return;
        }
        onClose(wrapperCard);
    });

    mainElement.append(wrapperCard);
};
