import { onClose } from "./utils.js";

// Функция создания модального окна для добавления/редактирования клиента
export const modalClients = (onClose) => {
    const modalWrapper = document.createElement("div"),
        modalWindowAdd = document.createElement("div"),
        modalWindowBlock = document.createElement("div"),
        modalTitle = document.createElement("h2"),
        modalFormAdd = document.createElement("form"),
        modalLabelSurname = document.createElement("label"),
        modalInputSurname = document.createElement("input"),
        modalInputSurnameSpan = document.createElement("span"),
        modalLabelName = document.createElement("label"),
        modalInputName = document.createElement("input"),
        modalInputNameSpan = document.createElement("span"),
        modalLabelLastname = document.createElement("label"),
        modalInputLastname = document.createElement("input"),
        modalInputLastnameSpan = document.createElement("span"),
        modalContactsWrapper = document.createElement("div"),
        modalButtonAddContacts = document.createElement("button"),
        textWrong = document.createElement("div"),
        modalButtonSave = document.createElement("button"),
        modalButtonSaveSpan = document.createElement("span"),
        modalButtonCancel = document.createElement("button"),
        modalButtonClose = document.createElement("button");

    modalWrapper.classList.add("modal__wrapper", "modal__wrapper--active");
    modalContactsWrapper.classList.add("clients__contacts-wrapper", "contacts");
    modalWindowAdd.classList.add("modal__clients", "modal__clients--active");
    modalWindowBlock.classList.add("modal__clients-block");
    modalTitle.classList.add("modal__clients-title", "title-reset");
    modalFormAdd.classList.add("modal__form-add", "form");
    modalLabelSurname.classList.add("form__label");
    modalInputSurname.classList.add("form__input");
    modalInputSurnameSpan.classList.add("form__span", "form__span-surname");
    modalLabelName.classList.add("form__label");
    modalInputName.classList.add("form__input");
    modalInputNameSpan.classList.add("form__span", "form__span-name");
    modalLabelLastname.classList.add("form__label");
    modalInputLastname.classList.add("form__input");
    modalInputLastnameSpan.classList.add("form__span", "form__span-lastname");
    modalButtonAddContacts.classList.add(
        "btn-reset",
        "form__button-contacts",
        "form__button-contacts--active"
    );
    textWrong.classList.add("form__wrong", "visible-hidden");
    modalButtonSave.classList.add("btn-reset", "form__button-save");
    modalButtonCancel.classList.add("btn-reset", "form__button-cancel");
    modalButtonClose.classList.add("btn-reset", "form__button-close");
    modalButtonSaveSpan.classList.add("spinner-button");

    modalLabelSurname.setAttribute("for", "surname");
    modalInputSurname.id = "surname";
    modalInputSurname.type = "text";
    modalLabelName.setAttribute("for", "name");
    modalInputName.id = "name";
    modalInputName.type = "text";
    modalLabelLastname.setAttribute("for", "lastname");
    modalInputLastname.id = "lastname";
    modalInputLastname.type = "text";

    modalTitle.textContent = "Новый клиент";
    modalInputSurnameSpan.textContent = "Фамилия";
    modalInputNameSpan.textContent = "Имя";
    modalInputLastnameSpan.textContent = "Отчество";
    modalButtonAddContacts.textContent = "Добавить контакт";
    modalButtonSave.textContent = "Сохранить";
    modalButtonCancel.textContent = "Отмена";

    const initInputStates = () => {
        const checkAndSetState = (input, span) => {
            if (input.value.trim() !== "") {
                span.classList.add("form__span--active");
            } else {
                span.classList.remove("form__span--active");
            }
        };

        checkAndSetState(modalInputName, modalInputNameSpan);
        checkAndSetState(modalInputSurname, modalInputSurnameSpan);
        checkAndSetState(modalInputLastname, modalInputLastnameSpan);
        
        // Принудительно запускаем событие для обновления состояния
        modalInputName.dispatchEvent(new Event("input"));
        modalInputSurname.dispatchEvent(new Event("input"));
        modalInputLastname.dispatchEvent(new Event("input"));
    };

    modalButtonClose.addEventListener("click", (e) => {
        e.preventDefault();

        onClose(modalWrapper);
    });

    modalButtonCancel.addEventListener("click", (e) => {
        e.preventDefault();

        onClose(modalWrapper);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            onClose(modalWrapper);
        }
    });

    modalWindowAdd.addEventListener("click", (event) => {
        event._isClickWithInModal = true;
    });

    let mouseDownInsideModal = false;

    modalWindowAdd.addEventListener("mousedown", (event) => {
        event._isClickWithInModal = true;
        mouseDownInsideModal = true;
    });

    modalWrapper.addEventListener("mouseup", (event) => {
        if (mouseDownInsideModal) {
            mouseDownInsideModal = false;
            return;
        }
        onClose(modalWrapper);
    });

    // Добавляем контакты
    modalButtonAddContacts.addEventListener("click", (e) => {
        e.preventDefault();
        const contactsItem = document.querySelectorAll(".contacts__wrapper");

        if (contactsItem.length < 9) {
            const contactItem = addContacts();
            modalContactsWrapper.prepend(contactItem.formContacts);
            if (contactsItem.length > 4)
                document.querySelector(".modal__wrapper").style.alignItems =
                    "flex-start";
        } else {
            const contactItem = addContacts();
            modalContactsWrapper.prepend(contactItem.formContacts);
            modalButtonAddContacts.classList.remove(
                "form__button-contacts--active"
            );
        }
    });

    initInputStates();

    modalLabelSurname.append(modalInputSurname);
    modalLabelSurname.append(modalInputSurnameSpan);
    modalFormAdd.append(modalLabelSurname);
    modalLabelName.append(modalInputName);
    modalLabelName.append(modalInputNameSpan);
    modalFormAdd.append(modalLabelName);
    modalLabelLastname.append(modalInputLastname);
    modalLabelLastname.append(modalInputLastnameSpan);
    modalButtonSave.append(modalButtonSaveSpan);
    modalFormAdd.append(modalLabelLastname);
    modalFormAdd.append(modalContactsWrapper);
    modalFormAdd.append(modalButtonAddContacts);
    modalFormAdd.append(textWrong);
    modalFormAdd.append(modalButtonSave);
    modalFormAdd.append(modalButtonCancel);
    modalWindowAdd.append(modalWindowBlock);
    modalWindowAdd.append(modalTitle);
    modalWindowAdd.append(modalFormAdd);
    modalWindowAdd.append(modalButtonClose);
    modalWrapper.append(modalWindowAdd);

    return {
        modalWrapper,
        modalWindowBlock,
        modalInputSurname,
        modalInputName,
        modalInputLastname,
        modalContactsWrapper,
        modalButtonAddContacts,
        textWrong,
        modalButtonSave,
        modalButtonSaveSpan,
        modalButtonCancel,
        modalTitle,
        modalFormAdd,
        modalButtonClose,
        modalWindowAdd,
        initInputStates,
    };
};

// Функция создания модального окна для удаления клиента
export const createModalDelete = (onCloseCallback) => {
    const modalDeleteWrapper = document.createElement("div"),
        modalDeleteForm = document.createElement("div"),
        modalDeleteTitle = document.createElement("h2"),
        modalDeleteDescr = document.createElement("span"),
        modalDeleteButton = document.createElement("button"),
        modalDeleteButtonSpan = document.createElement("span"),
        modalDeleteCancel = document.createElement("button"),
        modalDeleteClose = document.createElement("button");

    modalDeleteWrapper.classList.add("modal__delete", "modal__delete--active");
    modalDeleteForm.classList.add(
        "modal__delete-form",
        "modal__delete-form--active"
    );
    modalDeleteTitle.classList.add("modal__delete-title", "title-reset");
    modalDeleteDescr.classList.add("modal__delete-descr");
    modalDeleteButton.classList.add("modal__delete-agree", "btn-reset");
    modalDeleteButtonSpan.classList.add("spinner-button");
    modalDeleteCancel.classList.add("modal__delete-cancel", "btn-reset");
    modalDeleteClose.classList.add("modal__delete-close", "btn-reset");

    modalDeleteTitle.textContent = "Удалить клиента";
    modalDeleteDescr.textContent =
        "Вы действительно хотите удалить данного клиента?";
    modalDeleteButton.textContent = "Удалить";
    modalDeleteCancel.textContent = "Отмена";

    modalDeleteClose.addEventListener("click", (e) => {
        e.preventDefault();
        onCloseCallback(modalDeleteWrapper);
    });

    modalDeleteCancel.addEventListener("click", (e) => {
        e.preventDefault();
        onCloseCallback(modalDeleteWrapper);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            onClose(modalDeleteWrapper);
        }
    });

    modalDeleteForm.addEventListener("click", (event) => {
        event._isClickWithInModal = true;
    });

    let mouseDownInsideDeleteModal = false;

    modalDeleteForm.addEventListener("mousedown", (event) => {
        event._isClickWithInModal = true;
        mouseDownInsideDeleteModal = true;
    });

    modalDeleteWrapper.addEventListener("mouseup", (event) => {
        if (mouseDownInsideDeleteModal) {
            mouseDownInsideDeleteModal = false;
            return;
        }
        onClose(modalDeleteWrapper);
    });

    modalDeleteButton.append(modalDeleteButtonSpan);
    modalDeleteForm.append(
        modalDeleteTitle,
        modalDeleteDescr,
        modalDeleteButton,
        modalDeleteCancel,
        modalDeleteClose
    );
    modalDeleteWrapper.append(modalDeleteForm);

    return {
        modalDeleteWrapper,
        modalDeleteForm,
        modalDeleteCancel,
        modalDeleteButton,
        modalDeleteButtonSpan,
        modalDeleteClose,
    };
};

// Функция добавления контактов
export const addContacts = () => {
    const formContacts = document.createElement("div"),
        selectWrapper = document.createElement("div"),
        buttonSelect = document.createElement("button"),
        selectList = document.createElement("ul"),
        inputContact = document.createElement("input"),
        buttonDelete = document.createElement("button"),
        buttonDeleteTooltip = document.createElement("span"),
        selectTel = document.createElement("li"),
        selectTelNew = document.createElement("li"),
        selectEmail = document.createElement("li"),
        selectVk = document.createElement("li"),
        selectFacebook = document.createElement("li"),
        selectItem = "select__item";

    selectTel.textContent = "Телефон";
    selectTelNew.textContent = "Доп. телефон";
    selectEmail.textContent = "Email";
    selectVk.textContent = "Vk";
    selectFacebook.textContent = "Facebook";
    buttonSelect.textContent = selectTel.textContent;
    inputContact.placeholder = "Введите данные контакта";
    inputContact.type = "text";
    buttonDeleteTooltip.textContent = "Удалить контакт";

    selectList.classList.add("select__list");
    formContacts.classList.add("contacts__wrapper");
    selectWrapper.classList.add("select", "select-wrapper");
    buttonSelect.classList.add("btn-reset", "contacts__button-select");
    inputContact.classList.add("contacts__input");
    buttonDelete.classList.add("btn-reset", "contacts__btn-delete");
    buttonDeleteTooltip.classList.add("tooltip", "contacts__tooltip-delete");
    selectTel.classList.add(selectItem);
    selectTelNew.classList.add(selectItem);
    selectEmail.classList.add(selectItem);
    selectVk.classList.add(selectItem);
    selectFacebook.classList.add(selectItem);

    // При выборе, убирает из списка такой же select
    buttonSelect.addEventListener("click", (e) => {
        e.preventDefault();

        for (const type of typeArr) {
            if (buttonSelect.textContent === type.textContent) {
                type.classList.add("select__item--hidden");
            } else {
                type.classList.remove("select__item--hidden");
            }
        }

        selectWrapper.classList.toggle("select__wrapper--active");
    });

    selectWrapper.addEventListener("mouseleave", () => {
        selectWrapper.classList.remove("select__wrapper--active");
    });

    // Удаляем контакт
    buttonDelete.addEventListener("click", () => {
        onClose(formContacts);
        const contactsItem = document.querySelectorAll(".contacts__wrapper");

        if (contactsItem.length < 6)
            document.querySelector(".modal__wrapper").style.alignItems =
                "center";

        document
            .querySelector(".form__button-contacts")
            .classList.add("form__button-contacts--active");
    });

    inputContact.addEventListener("input", () => {
        const textWrong = document.querySelector(".form__wrong");

        inputContact.classList.remove("wrong");
        textWrong.classList.add("visible-hidden");
    });

    // Функция select
    const setType = (type) => {
        type.addEventListener("click", () => {
            buttonSelect.textContent = type.textContent;
            selectWrapper.classList.remove("select__wrapper--active");
            if (buttonSelect.textContent === "Телефон") {
                inputContact.type = "number";
            } else {
                inputContact.type = "text";
            }

            if (inputContact.dataset.value) {
                inputContact.value = inputContact.dataset.value;
            }
        });
    };

    const typeArr = [
        selectTel,
        selectTelNew,
        selectEmail,
        selectVk,
        selectFacebook,
    ];

    for (const type of typeArr) {
        setType(type);
    }

    selectList.append(
        selectTel,
        selectTelNew,
        selectEmail,
        selectVk,
        selectFacebook
    );
    selectWrapper.append(buttonSelect);
    selectWrapper.append(selectList);
    buttonDelete.append(buttonDeleteTooltip);
    formContacts.append(selectWrapper);
    formContacts.append(inputContact);
    formContacts.append(buttonDelete);

    return {
        formContacts,
        buttonSelect,
        selectList,
        inputContact,
    };
};
