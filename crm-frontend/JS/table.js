import {
    formatDate,
    formatTime,
    onClose,
    setupFormValidation,
} from "./utils.js";
import { modalClients, addContacts } from "./modal.js";
import { patchLocalClient, getLocalClients } from "./storage.js";

// Функция создания строки клиента в таблице
export const createClient = (
    client,
    onCloseCallback,
    handleDeleteClient,
    mainElement,
    sortMark,
    sortDir,
    tbody
) => {
    const tableBodyTr = document.createElement("tr"),
        tableBodyTdId = document.createElement("td"),
        tableBodyTdFIO = document.createElement("td"),
        tableBodyTdFIOLink = document.createElement("a"),
        tableBodyTdCreate = document.createElement("td"),
        tableBodyTdChange = document.createElement("td"),
        tableBodyTdContact = document.createElement("td"),
        tableBodyTdAction = document.createElement("td"),
        contactWrapper = document.createElement("div"),
        contactSpanType = document.createElement("span"),
        buttonWrapper = document.createElement("div"),
        buttonWrapperTop = document.createElement("div"),
        buttonWrapperBottom = document.createElement("div"),
        actionButtonChangeSpinner = document.createElement("span"),
        actionButtonChange = document.createElement("a"),
        actionButtonDeleteSpinner = document.createElement("span"),
        actionButtonDelete = document.createElement("button"),
        tableSpanDateCreate = document.createElement("span"),
        tableSpanTimeCreate = document.createElement("span"),
        tableSpanDateChange = document.createElement("span"),
        tableSpanTimeChange = document.createElement("span"),
        classContactImg = "table__contact-img",
        contacts = client.contacts,
        id = client.id;

    tableBodyTr.classList.add("table__body-tr");
    tableBodyTdId.classList.add("table__td", "table__id");
    tableBodyTdFIO.classList.add("table__td", "table__fio");
    tableBodyTdFIOLink.classList.add("table__fio-link");
    tableBodyTdCreate.classList.add("table__td", "table__create");
    tableBodyTdChange.classList.add("table__td", "table__change");
    tableBodyTdContact.classList.add("table__td", "table__contact");
    tableBodyTdAction.classList.add("table__td", "table__action");
    buttonWrapper.classList.add("table__wrapper-btn");
    buttonWrapperTop.classList.add("table__wrapper-top");
    buttonWrapperBottom.classList.add("table__wrapper-bottom");
    actionButtonChange.classList.add("btn-reset", "table__btn-change");
    actionButtonDelete.classList.add("btn-reset", "table__btn-delete");
    tableSpanDateCreate.classList.add("table__span-date");
    tableSpanTimeCreate.classList.add("table__span-time");
    tableSpanDateChange.classList.add("table__span-date");
    tableSpanTimeChange.classList.add("table__span-time");
    contactWrapper.classList.add("table__contact-wrapper");
    contactSpanType.classList.add("table__contact-type");
    actionButtonChangeSpinner.classList.add("table__change-span");
    actionButtonDeleteSpinner.classList.add("table__delete-span");

    tableBodyTr.id = id;
    tableBodyTdId.textContent = id.substr(0, 10);
    tableBodyTdFIOLink.textContent = client.fio;
    tableBodyTdFIOLink.href = "#" + id;
    tableSpanDateCreate.textContent = formatDate(client.createdAt);
    tableSpanTimeCreate.textContent = formatTime(client.createdAt);
    tableSpanDateChange.textContent = formatDate(client.updatedAt);
    tableSpanTimeChange.textContent = formatTime(client.updatedAt);

    // добавляем контакты в Tooltip
    for (const contact of contacts) {
        const contactGroup = document.createElement("a"),
            contactImg = document.createElement("img"),
            contactTooltip = document.createElement("span");

        contactGroup.classList.add("table__contact-group");
        contactTooltip.classList.add("table__contact-tooltip", "tooltip");

        if (contacts.length <= 5) {
            contactGroup.classList.add("table__contact-group--correct");
        }

        if (contact.type === "Телефон") {
            contactSpanType.textContent = contact.type;
            contactImg.src = "img/phone.svg";
            contactImg.classList.add(classContactImg);
            contactTooltip.textContent =
                contactSpanType.textContent + ": " + contact.value;
            contactGroup.append(contactImg);
        } else if (contact.type === "Email") {
            contactSpanType.textContent = contact.type;
            contactImg.src = "img/email.svg";
            contactImg.classList.add(classContactImg);
            contactTooltip.textContent =
                contactSpanType.textContent + ": " + contact.value;
            contactGroup.append(contactImg);
        } else if (contact.type === "Vk") {
            contactSpanType.textContent = contact.type;
            contactImg.src = "img/vk.svg";
            contactImg.classList.add(classContactImg);
            contactTooltip.textContent =
                contactSpanType.textContent + ": " + contact.value;
            contactGroup.append(contactImg);
        } else if (contact.type === "Facebook") {
            contactSpanType.textContent = contact.type;
            contactImg.src = "img/fb.svg";
            contactImg.classList.add(classContactImg);
            contactTooltip.textContent =
                contactSpanType.textContent + ": " + contact.value;
            contactGroup.append(contactImg);
        } else {
            contactSpanType.textContent = contact.type;
            contactImg.src = "img/dop-tel.svg";
            contactImg.classList.add(classContactImg);
            contactTooltip.textContent =
                contactSpanType.textContent + ": " + contact.value;
            contactGroup.append(contactImg);
        }
        contactGroup.append(contactTooltip);
        contactWrapper.append(contactGroup);
    }

    actionButtonChange.textContent = "Изменить";
    actionButtonDelete.textContent = "Удалить";

    // Обработчик для кнопки изменения
    actionButtonChange.addEventListener("click", function () {
        try {
            actionButtonChangeSpinner.classList.add(
                "table__change-span--spinner"
            );
            const modalClient = modalClients(onCloseCallback);
            mainElement.append(modalClient.modalWrapper);

            // Заполняем поля формы данными клиента
            modalClient.modalInputName.value = client.name;
            modalClient.modalInputSurname.value = client.surname;
            modalClient.modalInputLastname.value = client.lastName;
            modalClient.modalTitle.textContent = "Изменить данные";

            // Очищаем контакты и добавляем существующие
            modalClient.modalContactsWrapper.innerHTML = "";
            for (const contact of client.contacts) {
                const contactItem = addContacts();
                contactItem.buttonSelect.textContent = contact.type;
                contactItem.inputContact.value = contact.value;
                modalClient.modalContactsWrapper.prepend(
                    contactItem.formContacts
                );
            }

            // Добавляем валидацию
            setupFormValidation(modalClient.modalFormAdd);

            // Обработчик отправки формы для изменения
            modalClient.modalFormAdd.addEventListener("submit", async (e) => {
                const isInvalid =
                    modalClient.modalFormAdd.querySelector(".wrong");
                if (isInvalid) {
                    e.preventDefault();
                    return;
                }

                // Собираем данные формы
                const typesContact = document.querySelectorAll(
                    ".contacts__button-select"
                );
                const valueContact =
                    document.querySelectorAll(".contacts__input");
                let contacts = [];

                for (let i = 0; i < typesContact.length; i++) {
                    contacts.push({
                        type: typesContact[i].textContent,
                        value: valueContact[i].value,
                    });
                }

                const clientObj = {
                    name: modalClient.modalInputName.value.trim(),
                    surname: modalClient.modalInputSurname.value.trim(),
                    lastName: modalClient.modalInputLastname.value.trim(),
                    contacts: contacts,
                };

                try {
                    await patchLocalClient(clientObj, client.id);
                    onCloseCallback(modalClient.modalWrapper);
                    const updatedClients = await getLocalClients();
                    renderTable(
                        updatedClients,
                        sortMark,
                        sortDir,
                        tbody,
                        handleDeleteClient,
                        mainElement
                    );
                } catch (error) {
                    console.error("Ошибка при обновлении клиента:", error);
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            actionButtonChangeSpinner.classList.remove(
                "table__change-span--spinner"
            );
        }
    });

    // Обработчик для кнопки удаления
    actionButtonDelete.addEventListener("click", function () {
        actionButtonDeleteSpinner.classList.add("table__delete-span--spinner");
        handleDeleteClient(client.id);
        actionButtonDeleteSpinner.classList.remove(
            "table__delete-span--spinner"
        );
    });

    tableBodyTdFIO.append(tableBodyTdFIOLink);
    tableBodyTdContact.append(contactWrapper);
    tableBodyTdChange.append(tableSpanDateChange);
    tableBodyTdChange.append(tableSpanTimeChange);
    tableBodyTdCreate.append(tableSpanDateCreate);
    tableBodyTdCreate.append(tableSpanTimeCreate);
    buttonWrapperTop.append(actionButtonChangeSpinner);
    buttonWrapperTop.append(actionButtonChange);
    buttonWrapperBottom.append(actionButtonDeleteSpinner);
    buttonWrapperBottom.append(actionButtonDelete);
    buttonWrapper.append(buttonWrapperTop);
    buttonWrapper.append(buttonWrapperBottom);
    tableBodyTdAction.append(buttonWrapper);
    tableBodyTr.append(
        tableBodyTdId,
        tableBodyTdFIO,
        tableBodyTdCreate,
        tableBodyTdChange,
        tableBodyTdContact,
        tableBodyTdAction
    );
    return tableBodyTr;
};

// Функция создания заголовков таблицы
const createTableHeader = (sortMark, sortDir, handleSort) => {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Массив заголовков
    const headers = [
        { id: 'id', text: 'ID', classes: ['table__th', 'table__th-id'] },
        { id: 'fio', text: 'ФИО', classes: ['table__th', 'table__th-name'] },
        { id: 'createdAt', text: 'Дата и время создания', classes: ['table__th', 'table__th-create'] },
        { id: 'updatedAt', text: 'Дата и время изменения', classes: ['table__th', 'table__th-change'] },
        { id: 'contacts', text: 'Контакты', classes: ['table__th'] },
        { id: 'actions', text: 'Действия', classes: ['table__th'] }
    ];

    headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header.text;
        th.classList.add(...header.classes);

        if (header.id === sortMark) {
            th.classList.add(sortDir ? "sort-up" : "sort-down");
        }

        // Делаем кликабельными только нужные заголовки
        if (
            header.classes.includes("table__th-id") ||
            header.classes.includes("table__th-name") ||
            header.classes.includes("table__th-create") ||
            header.classes.includes("table__th-change")
        ) {
            th.addEventListener("click", () => handleSort(header.id));
        }

        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    return thead;
};

// Функция отрисовки таблицы
export const renderTable = (
    updatedClients,
    sortMark,
    sortDir,
    tbody,
    handleDeleteClient,
    mainElement
) => {
    const table = tbody.parentElement;
    table.innerHTML = ""; // Очищаем всю таблицу

    // Добавляем обработчик сортировки
    const handleSort = (newSortMark) => {
        const newSortDir = sortMark === newSortMark ? !sortDir : true;
        renderTable(
            updatedClients,
            newSortMark,
            newSortDir,
            tbody,
            handleDeleteClient,
            mainElement
        );
    };

    table.appendChild(createTableHeader(sortMark, sortDir, handleSort));
    table.appendChild(tbody);
    tbody.innerHTML = "";

    if (updatedClients.length === 0) {
        return;
    }

    const preload = () => {
        const loadWrapper = document.createElement("div");
        loadWrapper.classList.add("preload__wrapper");
        return loadWrapper;
    };

    const load = preload();
    document.querySelector(".clients__wrapper").append(load);

    const buttonSave = document.querySelector(".clients__button");
    buttonSave.classList.add("visible-hidden");

    let copyClientsArray = [...updatedClients];

    copyClientsArray.sort((a, b) => {
        if (a[sortMark] < b[sortMark]) return sortDir ? -1 : 1;
        if (a[sortMark] > b[sortMark]) return sortDir ? 1 : -1;
        return 0;
    });

    try {
        for (const client of copyClientsArray) {
            client.fio = `${client.surname} ${client.name} ${client.lastName}`;
            const newClient = createClient(
                client,
                onClose,
                handleDeleteClient,
                mainElement,
                sortMark,
                sortDir,
                tbody
            );
            tbody.append(newClient);
        }
    } catch (error) {
        console.log(error);
    } finally {
        load.remove();
        buttonSave.classList.remove("visible-hidden");
    }
};
