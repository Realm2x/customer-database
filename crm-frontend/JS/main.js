import {
    getLocalClients,
    saveLocalClient,
    initialClient,
    deleteLocalClient,
} from "./storage.js";
import { renderTable } from "./table.js";
import { searchClient } from "./search.js";
import { cardClient } from "./card.js";
import { modalClients, addContacts, createModalDelete } from "./modal.js";
import { onClose, setupFormValidation } from "./utils.js";

let arrayClientsData = [
    {
        name: "Иван",
        surname: "Иванов",
        lastName: "Иванович",
        contacts: [
            { type: "Email", value: "dfds@ya.ru" },
            { type: "Телефон", value: "95835880191" },
        ],
        id: "mcq7xgabq5s3sp5zorg",
        createdAt: "2025-07-05T12:27:16.787Z",
        updatedAt: "2025-07-05T12:27:16.787Z",
    },
    {
        name: "Наталья",
        surname: "Высоцкая",
        lastName: "Андреевна",
        contacts: [
            { type: "Email", value: "dfds@ya.ru" },
            { type: "Телефон", value: "95835880191" },
        ],
        id: "mcq7xgabq7s4sp5zorg",
        createdAt: "2025-07-05T12:27:16.787Z",
        updatedAt: "2025-07-05T12:27:16.787Z",
    },
    {
        name: "Виктор",
        surname: "Прокофьев",
        lastName: "Андреевич",
        contacts: [
            { type: "Email", value: "dfds@ya.ru" },
            { type: "Телефон", value: "95835880191" },
        ],
        id: "mcq7xgabq7s3sp8zorg",
        createdAt: "2025-07-05T12:27:16.787Z",
        updatedAt: "2025-07-05T12:27:16.787Z",
    },
    {
        name: "Анастасия",
        surname: "Высокова",
        lastName: "Витальевна",
        contacts: [
            { type: "Email", value: "dfds@ya.ru" },
            { type: "Телефон", value: "95835880191" },
        ],
        id: "mcq7xgabq7s0sp5zorg",
        createdAt: "2025-07-05T12:27:16.787Z",
        updatedAt: "2025-07-05T12:27:16.787Z",
    },
    {
        name: "Дмитрий",
        surname: "Донской",
        lastName: "Павлович",
        contacts: [
            { type: "Email", value: "dfds@ya.ru" },
            { type: "Телефон", value: "95835880191" },
        ],
        id: "mcq1xgabq7s3sp5zorg",
        createdAt: "2025-07-05T12:27:16.787Z",
        updatedAt: "2025-07-05T12:27:16.787Z",
    },
    {
        name: "Анатолий",
        surname: "Быстров",
        lastName: "Анатольевич",
        contacts: [
            { type: "Email", value: "dfds@ya.ru" },
            { type: "Телефон", value: "95835880191" },
        ],
        id: "mcq7xgabq7s3sp5sorg",
        createdAt: "2025-07-05T12:27:16.787Z",
        updatedAt: "2025-07-05T12:27:16.787Z",
    },
    {
        name: "Владимир",
        surname: "Высоцкий",
        lastName: "Андреевич",
        contacts: [
            { type: "Email", value: "dfds@ya.ru" },
            { type: "Телефон", value: "95835880191" },
        ],
        id: "mcq7xgabq7s3we5zorg",
        createdAt: "2025-07-05T12:27:16.787Z",
        updatedAt: "2025-07-05T12:27:16.787Z",
    },
];

(async () => {
    const existingData = await getLocalClients();
    if (existingData.length === 0) {
        await initialClient(arrayClientsData); // Инициализируем только если хранилище пустое
    }
    
    let serverData = await getLocalClients();

    let sortMark = "id",
        sortDir = true;

    if (serverData !== null) {
        arrayClientsData = serverData;
    }

    // Инициализация DOM элементов
    const main = document.querySelector(".main"),
        table = document.querySelector(".clients__table"),
        tbody = document.createElement("tbody"),
        buttonAdd = document.querySelector(".clients__button");

    table.append(tbody);

    // Обработчики событий
    buttonAdd.addEventListener("click", () => {
        const modalClient = modalClients(onClose);
        main.append(modalClient.modalWrapper);

        // Очищаем поля формы
        modalClient.modalInputSurname.value = "";
        modalClient.modalInputName.value = "";
        modalClient.modalInputLastname.value = "";
        document.querySelector(".contacts").innerHTML = "";

        setupFormValidation(modalClient.modalFormAdd);

        // Добавляем обработчики изменения полей
        document.querySelectorAll(".form__input").forEach(function (elem) {
            elem.addEventListener("input", () => {
                elem.classList.remove("wrong");
                if (elem.value !== "") {
                    elem.classList.add("form__span--active");
                } else {
                    elem.classList.remove("form__span--active");
                }
            });
        });

        // Обработка отправки формы
        modalClient.modalFormAdd.addEventListener("submit", async (e) => {
            const isInvalid = modalClient.modalFormAdd.querySelector(".wrong");
            if (isInvalid) {
                return;
            }

            // Сбор контактов
            const typesContact = document.querySelectorAll(
                ".contacts__button-select"
            );
            const valueContact = document.querySelectorAll(".contacts__input");
            let contacts = [];

            // Валидация контактов
            for (let i = 0; i < typesContact.length; i++) {
                contacts.push({
                    type: typesContact[i].textContent,
                    value: valueContact[i].value,
                });
            }

            // Создание объекта клиента
            const clientObj = {
                name: modalClient.modalInputName.value.trim(),
                surname: modalClient.modalInputSurname.value.trim(),
                lastName: modalClient.modalInputLastname.value.trim(),
                contacts: contacts,
            };

            // Показываем индикатор загрузки
            modalClient.modalButtonSaveSpan.classList.add(
                "spinner-button--active"
            );

            try {
                modalClient.modalWindowBlock.classList.add(
                    "modal__clients-block--active"
                );

                // Сохраняем клиента
                await saveLocalClient(clientObj);

                // Обновляем данные и перерисовываем таблицу
                arrayClientsData = await getLocalClients();
                renderTable(arrayClientsData, sortMark, sortDir, tbody);
            } catch (error) {
                console.error("Ошибка при сохранении клиента:", error);
                modalClient.textWrong.classList.remove("visible-hidden");
                modalClient.textWrong.textContent =
                    "Произошла ошибка при сохранении";
            } finally {
                // Убираем индикаторы загрузки и закрываем модальное окно
                modalClient.modalWindowBlock.classList.remove(
                    "modal__clients-block--active"
                );
                onClose(modalClient.modalWrapper);
                modalClient.modalButtonSaveSpan.classList.remove(
                    "spinner-button--active"
                );
            }
        });
    });

    // Обработчик удаления клиента
    const handleDeleteClient = async (id) => {
        const modalDelete = createModalDelete(onClose);
        main.append(modalDelete.modalDeleteWrapper);

        modalDelete.modalDeleteButton.addEventListener("click", async () => {
            modalDelete.modalDeleteButtonSpan.classList.add(
                "spinner-button--active"
            );
            try {
                await deleteLocalClient(id);
                // Обновляем данные и перерисовываем таблицу
                const updatedClients = await getLocalClients();
                renderTable(
                    updatedClients,
                    sortMark,
                    sortDir,
                    tbody,
                    handleDeleteClient,
                    main
                );

                // Закрываем модальное окно удаления
                onClose(modalDelete.modalDeleteWrapper);

                // Очищаем hash, если удаляли текущего клиента
                if (window.location.hash.substring(1) === id) {
                    window.location.hash = "";
                }
            } catch (error) {
                console.error("Ошибка при удалении клиента:", error);
                // Можно показать сообщение об ошибке пользователю
            } finally {
                modalDelete.modalDeleteButtonSpan.classList.remove(
                    "spinner-button--active"
                );
            }
        });

        // Обработчики отмены
        modalDelete.modalDeleteCancel.addEventListener("click", () => {
            onClose(modalDelete.modalDeleteWrapper);
        });

        modalDelete.modalDeleteClose.addEventListener("click", () => {
            onClose(modalDelete.modalDeleteWrapper);
        });
    };

    const updatedClients = await getLocalClients();
    arrayClientsData = updatedClients; // Обновляем основной массив

    // Первоначальная отрисовка
    renderTable(
        arrayClientsData,
        sortMark,
        sortDir,
        tbody,
        handleDeleteClient,
        main
    );

    // Инициализация поиска и hash-навигации
    const createApp = async () => {
        const clients = await getLocalClients();
        searchClient(clients);

        // Обработчик hash-изменений
        const handleHashChange = async () => {
            const id = window.location.hash.substring(1);
            if (id) {
                try {
                    await cardClient(id, main);
                } catch (error) {
                    console.error(
                        "Ошибка при загрузке карточки клиента:",
                        error
                    );
                }
            }
        };

        window.addEventListener("hashchange", handleHashChange);

        // Первоначальная проверка hash
        handleHashChange();
    };

    createApp();
})();
