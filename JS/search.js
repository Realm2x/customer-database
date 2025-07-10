import { insertMark } from "./utils.js";

// Функция поиска клиентов
export const searchClient = (clients) => {
    const searchInput = document.querySelector(".header__input-search"),
        searchList = document.querySelector(".header__search-list");

    clients.forEach((client) => {
        const searchItem = document.createElement("li");
        const searchLink = document.createElement("a");

        searchItem.classList.add("header__search-item");
        searchLink.classList.add("header__search-link");

        searchLink.tabIndex = "0";
        searchLink.textContent = `${client.surname} ${client.name}`;

        searchLink.addEventListener("click", () => {
            const el = document.getElementById(client.id);
            el.scrollIntoView({ block: "center", inline: "center" });
            searchInput.value = "";
            searchList.classList.add("visible-hidden");
            searchItem.classList.add("visible-hidden");
            document.getElementById(client.id).classList.add("active-client");
            setTimeout(() => {
                document
                    .getElementById(client.id)
                    .classList.remove("active-client");
            }, 5000);
        });

        searchItem.append(searchLink);
        searchList.append(searchItem);
    });

    searchInput.addEventListener("input", () => {
        const value = searchInput.value.trim();
        const foundItems = document.querySelectorAll(".header__search-item");
        const foundLinks = document.querySelectorAll(".header__search-link");

        if (value !== "") {
            for (let i = 0; i < foundItems.length; i++) {
                if (foundLinks[i].innerText.search(value) === -1) {
                    foundItems[i].classList.add("visible-hidden");
                    foundLinks[i].innerHTML = foundLinks[i].textContent;
                } else {
                    foundItems[i].classList.remove("visible-hidden");
                    searchList.classList.remove("visible-hidden");
                    const str = foundLinks[i].textContent;
                    foundLinks[i].innerHTML = insertMark(
                        str,
                        foundLinks[i].textContent.search(value),
                        value.length
                    );
                }
            }
        } else {
            for (let i = 0; i < foundItems.length; i++) {
                foundItems[i].classList.add("visible-hidden");
            }
            searchList.classList.add("visible-hidden");
        }

        document.body.addEventListener("click", () => {
            foundItems.forEach((item) => {
                item.classList.add("visible-hidden");
                searchList.classList.add("visible-hidden");
            });
        });
    });

    const insertMark = (str, pos, leng) =>
        str.slice(0, pos) +
        "<mark>" +
        str.slice(pos, pos + leng) +
        "</mark>" +
        str.slice(pos + leng);
};
