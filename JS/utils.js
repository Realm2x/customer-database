// Форматируем дату
export const formatDate = (data) => {
    const newDate = new Date(data);
    const correctDate = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    };
    return newDate.toLocaleString("ru", correctDate);
};

// Форматируем время
export const formatTime = (data) => {
    const newDate = new Date(data);
    const correctDate = {
        hour: "numeric",
        minute: "numeric",
    };
    return newDate.toLocaleString("ru", correctDate);
};

// Функция закрытия модальных окон
export const onClose = (modalElement) => {
    if (modalElement && modalElement.parentNode) {
        modalElement.remove();
    }
};

// Функция для выделения найденного текста
export const insertMark = (str, pos, leng) =>
    str.slice(0, pos) +
    "<mark>" +
    str.slice(pos, pos + leng) +
    "</mark>" +
    str.slice(pos + leng);

// Валидация
export const setupFormValidation = (formElement) => {
    const inputs = formElement.querySelectorAll(
        ".form__input, .contacts__input"
    );
    const textWrong = formElement.querySelector(".form__wrong");

    // Функция для обновления состояния спана
    const updateSpanState = (input, span) => {
        if (input.value.trim() !== "") {
            span.classList.add("form__span--active");
        } else {
            span.classList.remove("form__span--active");
        }
    };

    // Функция для валидации ФИО
    const validateNameField = (input, fieldName, isRequired = true) => {
        const value = input.value.trim();
        const regexp = /^[а-яА-ЯёЁ]+$/;

        if (isRequired && value === "") {
            input.classList.add("wrong");
            textWrong.textContent = `Вы не ввели "${fieldName}"`;
            return false;
        }

        if (value !== "" && !regexp.test(value)) {
            input.classList.add("wrong");
            textWrong.textContent = `Поле "${fieldName}" содержит недопустимые символы (только кириллица)`;
            return false;
        }

        return true;
    };

    inputs.forEach((input) => {
        const span = input.parentElement.querySelector(".form__span");
        if (span) {
            // Инициализируем состояние при загрузке
            updateSpanState(input, span);

            input.addEventListener("input", () => {
                input.classList.remove("wrong");
                updateSpanState(input, span);
            });
        }
    });

    formElement.addEventListener("submit", (e) => {
        let isValid = true;

        // Валидация ФИО
        const surnameInput = formElement.querySelector("#surname");
        const nameInput = formElement.querySelector("#name");
        const lastnameInput = formElement.querySelector("#lastname");

        // Фамилия и Имя - обязательные
        isValid = validateNameField(surnameInput, "Фамилию") && isValid;
        isValid = validateNameField(nameInput, "Имя") && isValid;

        // Отчество - необязательное, но если заполнено - проверяем
        isValid =
            validateNameField(lastnameInput, "Отчество", false) && isValid;

        // Валидация контактов
        const contactWrappers =
            formElement.querySelectorAll(".contacts__wrapper");
        contactWrappers.forEach((wrapper) => {
            const type = wrapper.querySelector(
                ".contacts__button-select"
            ).textContent;
            const input = wrapper.querySelector(".contacts__input");
            const value = input.value.trim();

            if (value === "") {
                input.classList.add("wrong");
                textWrong.textContent = "Заполните все контакты!";
                isValid = false;
            } else if (
                type === "Email" &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {
                input.classList.add("wrong");
                textWrong.textContent = "Некорректный email";
                isValid = false;
            } else if (type === "Телефон" && !/^\d{11}$/.test(value)) {
                input.classList.add("wrong");
                textWrong.textContent = "Телефон должен содержать 11 цифр";
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
            textWrong.classList.remove("visible-hidden");
        }
    });
};
