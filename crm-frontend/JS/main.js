(async () => {
  let arrayClientsData = [];

  const SERVER_URL = 'http://localhost:3000';

  const saveServerClient = async (obj) => {
    try {
      const response = await fetch(SERVER_URL + '/api/clients', {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          'Content-type': 'application/json',
        },
      })
      let data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const getServerClient = async () => {
    try {
      const response = await fetch(SERVER_URL + '/api/clients', {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
        },
      })
      let data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const patchServerClient = async (obj, id) => {
    try {
      await fetch(SERVER_URL + '/api/clients/' + id, {
        method: "PATCH",
        body: JSON.stringify(obj),
      })
    } catch (error) {
      console.log(error);
    }
  }

  const deleteClientServer = async (id) => {
    try {
      const response = await fetch(SERVER_URL + '/api/clients/' + id, {
        method: "DELETE",
      })
      let data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  let serverData = await getServerClient();

  let sortMark = 'id',
      sortDir = true;

  if (serverData !== null) {
    arrayClientsData = serverData;
  }
  
  // Создаем таблицу
  const main = document.querySelector('.main'),
        table = document.querySelector('.clients__table'),
        thead = document.createElement('thead'),
        tbody = document.createElement('tbody'),
        buttonAdd = document.querySelector('.clients__button'),

        tableHeadTr = document.createElement('tr'),
        tableHeadThId = document.createElement('th'),
        tableHeadThName = document.createElement('th'),
        tableHeadThDateCreate = document.createElement('th'),
        tableHeadThDateChange = document.createElement('th'),
        tableHeadThContacts = document.createElement('th'),
        tableHeadThAction = document.createElement('th'),
        tableThClass = 'table__th'
        
  tableHeadThId.classList.add(tableThClass, 'table__th-id', 'sort-down', 'sort-up');
  tableHeadThName.classList.add(tableThClass, 'table__th-name', 'sort-down');
  tableHeadThDateCreate.classList.add(tableThClass, 'table__th-create', 'sort-down');
  tableHeadThDateChange.classList.add(tableThClass, 'table__th-change', 'sort-down');
  tableHeadThContacts.classList.add(tableThClass, 'table__th-contacts');
  tableHeadThAction.classList.add(tableThClass, 'table__th-action');
  thead.classList.add('table__head');
  tbody.classList.add('table__body');
  tableHeadTr.classList.add('table__head-tr');

  const sortItems = [tableHeadThId, tableHeadThName, tableHeadThDateCreate, tableHeadThDateChange];
  
  for (const item of sortItems) {
    item.addEventListener('click', () => {
      item.classList.toggle('sort-up');
      for (let i = 0; i < sortItems.length; i++) {
        if (sortItems[i] !== item) {
          sortItems[i].classList.remove('sort-up');
        }
      }
    })
  }
  
  tableHeadThId.textContent = 'ID';
  tableHeadThName.textContent = 'Фамилия Имя Отчество';
  tableHeadThDateCreate.textContent = 'Дата и время создания';
  tableHeadThDateChange.textContent = 'Последние изменения';
  tableHeadThContacts.textContent = 'Контакты';
  tableHeadThAction.textContent = 'Действия';

  // Обработчик клика для отображения модального окна
  buttonAdd.addEventListener('click', () => {
    const modalClient = modalClients(onClose);
    main.append(
      modalClient.modalWrapper
    )
    modalClient.modalInputSurname.value = '';
    modalClient.modalInputName.value = '';
    modalClient.modalInputLastname.value = '';

    document.querySelector('.contacts').innerHTML = '';
    
    document.querySelectorAll('.form__input').forEach(function(elem) {
      elem.addEventListener('input', () => {
        elem.classList.remove('wrong')
        if (elem.value !== '') {
          elem.classList.add('form__span--active');
        } else {
          elem.classList.remove('form__span--active');
        }
      })
    })
    
    // Отправка формы для добавления клиента
    modalClient.modalFormAdd.addEventListener('submit', async e => {
      e.preventDefault();

      const regexp = /[^а-яА-ЯёЁ]+$/g;

      if (regexp.test(modalClient.modalInputSurname.value)) {
        modalClient.modalInputSurname.classList.add('wrong');
        modalClient.textWrong.classList.remove('visible-hidden');
        modalClient.textWrong.textContent = 'Допустимые символы (а-я, А-Я)';
        return;
      }

      if (modalClient.modalInputSurname.value.trim() === '') {
        modalClient.modalInputSurname.classList.add('wrong');
        modalClient.textWrong.classList.remove('visible-hidden');
        modalClient.textWrong.textContent = 'Вы не ввели "Фамилию"';
        return;
      }

      if (regexp.test(modalClient.modalInputName.value)) {
        modalClient.modalInputName.classList.add('wrong');
        modalClient.textWrong.classList.remove('visible-hidden');
        modalClient.textWrong.textContent = 'Допустимые символы (а-я, А-Я)';
        return;
      }
  
      if (modalClient.modalInputName.value.trim() === '') {
        modalClient.modalInputName.classList.add('wrong');
        modalClient.textWrong.classList.remove('visible-hidden');
        modalClient.textWrong.textContent = 'Вы не ввели "Имя"';
        return;
      }
  
      const typesContact = document.querySelectorAll('.contacts__button-select');
      const valueContact = document.querySelectorAll('.contacts__input');

      let contacts = [];

      for (let i = 0; i < typesContact.length; i++) {
        if (valueContact[i].value === '') {
          valueContact[i].classList.add('wrong');
          modalClient.textWrong.classList.remove('visible-hidden');
          modalClient.textWrong.textContent = 'Заполните поле!';
          return;
        }
        if (typesContact[i].textContent === 'Телефон') {
          if (valueContact[i].value.length !== 11) {
            valueContact[i].classList.add('wrong');
            modalClient.textWrong.classList.remove('visible-hidden');
            modalClient.textWrong.textContent = 'Введите корректный номер (11 цифр)';
            return;
          } 
        } else if (typesContact[i].textContent === 'Email') {
          if (valueContact[i].value.includes('@') !== true || valueContact[i].value.includes('.') !== true) {
            valueContact[i].classList.add('wrong');
            modalClient.textWrong.classList.remove('visible-hidden');
            modalClient.textWrong.textContent = 'Введите корректную почту (a-z, A-Z (@/.))';
            return
          };
        }
        
        contacts.push({
          type: typesContact[i].textContent,
          value: valueContact[i].value
        })
      }

      let clientObj = {
        name: modalClient.modalInputName.value.trim(),
        surname: modalClient.modalInputSurname.value.trim(),
        lastName: modalClient.modalInputLastname.value.trim(),
        contacts: contacts
      };

      let serverDataObj;

      modalClient.modalButtonSaveSpan.classList.add('spinner-button--active');

      try {
        modalClient.modalWindowBlock.classList.add('modal__clients-block--active');
        serverDataObj = await saveServerClient(clientObj);
      } catch (error) {
        console.log(error);
      } finally {
        modalClient.modalWindowBlock.classList.remove('modal__clients-block--active');
        arrayClientsData.push(serverDataObj);
        render(arrayClientsData);
        onClose(modalClient.modalWrapper);
        modalClient.modalButtonSaveSpan.classList.remove('spinner-button--active');
      }
    })
  })
  
  tableHeadTr.append(tableHeadThId);
  tableHeadTr.append(tableHeadThName);
  tableHeadTr.append(tableHeadThDateCreate);
  tableHeadTr.append(tableHeadThDateChange);
  tableHeadTr.append(tableHeadThContacts);
  tableHeadTr.append(tableHeadThAction);

  thead.append(tableHeadTr);
  table.append(thead);
  table.append(tbody);
  
  // Функция добавления клиента в таблицу
  function createClient(client) {
    const tableBodyTr = document.createElement('tr'),
          tableBodyTdId = document.createElement('td'),
          tableBodyTdFIO = document.createElement('td'),
          tableBodyTdFIOLink = document.createElement('a'),
          tableBodyTdCreate = document.createElement('td'),
          tableBodyTdChange = document.createElement('td'),
          tableBodyTdContact = document.createElement('td'),
          tableBodyTdAction = document.createElement('td'),
          contactWrapper = document.createElement('div'),
          contactSpanType = document.createElement('span'),
          buttonWrapper = document.createElement('div'),
          buttonWrapperTop = document.createElement('div'),
          buttonWrapperBottom = document.createElement('div'),
          actionButtonChangeSpinner = document.createElement('span'),
          actionButtonChange = document.createElement('a'),
          actionButtonDeleteSpinner = document.createElement('span'),
          actionButtonDelete = document.createElement('button'),
          tableSpanDateCreate = document.createElement('span'),
          tableSpanTimeCreate = document.createElement('span'),
          tableSpanDateChange = document.createElement('span'),
          tableSpanTimeChange = document.createElement('span'),
          classContactImg = 'table__contact-img',
          contacts = client.contacts,
          id = client.id;

    tableBodyTr.classList.add('table__body-tr');
    tableBodyTdId.classList.add('table__td', 'table__id');
    tableBodyTdFIO.classList.add('table__td', 'table__fio');
    tableBodyTdFIOLink.classList.add('table__fio-link');
    tableBodyTdCreate.classList.add('table__td', 'table__create');
    tableBodyTdChange.classList.add('table__td', 'table__change');
    tableBodyTdContact.classList.add('table__td', 'table__contact');
    tableBodyTdAction.classList.add('table__td', 'table__action');
    buttonWrapper.classList.add('table__wrapper-btn');
    buttonWrapperTop.classList.add('table__wrapper-top');
    buttonWrapperBottom.classList.add('table__wrapper-bottom');
    actionButtonChange.classList.add('btn-reset', 'table__btn-change');
    actionButtonDelete.classList.add('btn-reset', 'table__btn-delete');
    tableSpanDateCreate.classList.add('table__span-date');
    tableSpanTimeCreate.classList.add('table__span-time');
    tableSpanDateChange.classList.add('table__span-date');
    tableSpanTimeChange.classList.add('table__span-time');
    contactWrapper.classList.add('table__contact-wrapper');
    contactSpanType.classList.add('table__contact-type');
    actionButtonChangeSpinner.classList.add('table__change-span');
    actionButtonDeleteSpinner.classList.add('table__delete-span');
    
    tableBodyTr.id = id;
    tableBodyTdId.textContent = id.substr(0, 10);
    tableBodyTdFIOLink.textContent = client.fio;
    tableBodyTdFIOLink.href = '#' + id;
    tableSpanDateCreate.textContent = formatDate(client.createdAt);
    tableSpanTimeCreate.textContent = formatTime(client.createdAt);
    tableSpanDateChange.textContent = formatDate(client.updatedAt);
    tableSpanTimeChange.textContent = formatTime(client.updatedAt);

    // добавляем контакты в Tooltip
    for (const contact of contacts) {
      const contactGroup = document.createElement('a'),
            contactImg = document.createElement('img'),
            contactTooltip = document.createElement('span')

      contactGroup.classList.add('table__contact-group');
      contactTooltip.classList.add('table__contact-tooltip', 'tooltip');

      if (contacts.length <= 5) {
        contactGroup.classList.add('table__contact-group--correct');
      }

      if (contact.type === 'Телефон') {
        contactSpanType.textContent = contact.type;
        contactImg.src = 'img/phone.svg';
        contactImg.classList.add(classContactImg);
        contactTooltip.textContent = contactSpanType.textContent + ': ' + contact.value;
        contactGroup.href = `tel:${contact.value.trim()}`;
        contactGroup.append(contactImg);
      } else if (contact.type === 'Email') {
        contactSpanType.textContent = contact.type;
        contactImg.src = 'img/email.svg';
        contactImg.classList.add(classContactImg);
        contactTooltip.textContent = contactSpanType.textContent + ': ' + contact.value;
        contactGroup.href = `mailto:${contact.value.trim()}`;
        contactGroup.append(contactImg);
      } else if (contact.type === 'Vk') {
        contactSpanType.textContent = contact.type;
        contactImg.src = 'img/vk.svg';
        contactImg.classList.add(classContactImg);
        contactTooltip.textContent = contactSpanType.textContent + ': ' + contact.value;
        contactGroup.append(contactImg); 
      } else if (contact.type === 'Facebook') {
        contactSpanType.textContent = contact.type;
        contactImg.src = 'img/fb.svg';
        contactImg.classList.add(classContactImg);
        contactTooltip.textContent = contactSpanType.textContent + ': ' + contact.value;
        contactGroup.append(contactImg); 
      } else {
        contactSpanType.textContent = contact.type;
        contactImg.src = 'img/dop-tel.svg';
        contactImg.classList.add(classContactImg);
        contactTooltip.textContent = contactSpanType.textContent + ': ' + contact.value;
        contactGroup.append(contactImg);
      }
      contactGroup.append(contactTooltip);
      contactWrapper.append(contactGroup);
    }

    actionButtonChange.textContent = 'Изменить';
    actionButtonDelete.textContent = 'Удалить';

    // Открываем модальное окно для изменения данных клиента
    actionButtonChange.addEventListener('click', function() {
      try {
        actionButtonChangeSpinner.classList.add('table__change-span--spinner');
        changeModaltClient(client);
      } catch (error) {
        console.log(error);
      } finally {
        const modalClient = modalClients(onClose);

        if (client.contacts.length > 4) { 
          document.querySelector('.modal__wrapper').style.alignItems = 'flex-start';
        } else {
          modalClient.modalButtonAddContacts.classList.remove('form__button-contacts--active');
        }
        
        actionButtonChangeSpinner.classList.remove('table__change-span--spinner');
      }
    })

    // Hash-часть))
    if (window.location.hash.substring(1) === id) {
      actionButtonChange.click();
    }

    window.addEventListener('hashchange', () => {
      if (window.location.hash.substring(1) === id) {
        actionButtonChange.click();
      }
    })

    // Удаляем клиента
    actionButtonDelete.addEventListener('click', async function() {
      const modalDelete = createModalDelete();
      actionButtonDeleteSpinner.classList.add('table__delete-span--spinner');
      main.append(modalDelete.modalDeleteWrapper);
      actionButtonDeleteSpinner.classList.remove('table__delete-span--spinner');

      modalDelete.modalDeleteButton.addEventListener('click', async () => {
        modalDelete.modalDeleteButtonSpan.classList.add('spinner-button--active');
        try {
          await deleteClientServer(id);
        } catch (error) {
          console.log(error);
        } finally {
          tableBodyTr.remove();
          onClose(modalDelete.modalDeleteWrapper);
          modalDelete.modalDeleteButtonSpan.classList.remove('spinner-button--active');
        }
      })
    })
    
    tableBodyTdFIO.append(tableBodyTdFIOLink)
    tableBodyTdContact.append(contactWrapper);
    tableBodyTdChange.append(tableSpanDateChange);
    tableBodyTdChange.append(tableSpanTimeChange);
    tableBodyTdCreate.append(tableSpanDateCreate);
    tableBodyTdCreate.append(tableSpanTimeCreate)
    buttonWrapperTop.append(actionButtonChangeSpinner)
    buttonWrapperTop.append(actionButtonChange)
    buttonWrapperBottom.append(actionButtonDeleteSpinner)
    buttonWrapperBottom.append(actionButtonDelete)
    buttonWrapper.append(buttonWrapperTop);
    buttonWrapper.append(buttonWrapperBottom);
    tableBodyTdAction.append(buttonWrapper);
    tableBodyTr.append(tableBodyTdId, tableBodyTdFIO, tableBodyTdCreate, tableBodyTdChange, tableBodyTdContact, tableBodyTdAction);

    return tableBodyTr;
  }

  // Модальное окно для изменения данных клиента
  const changeModaltClient = (client) => {
    const modalClient = modalClients(onClose),
          modalTitleId = document.createElement('span')

    modalTitleId.classList.add('modal__clients-span');
    modalClient.modalTitle.classList.add('modal__clients-title--change');

    modalClient.modalTitle.textContent = 'Изменить данные';
    modalTitleId.textContent = 'ID: ' + client.id.substr(0, 6);
    modalClient.modalInputName.value = client.name;
    modalClient.modalInputLastname.value = client.lastName;
    modalClient.modalInputSurname.value = client.surname;
    modalClient.modalButtonCancel.textContent = 'Удалить клиента';

    // Получаем контакты и создаем соответствующие элементы в модальном окне
    for (const item of client.contacts) {
      const addContact = addContacts();
      addContact.buttonSelect.textContent = item.type;
      
      if (addContact.buttonSelect.textContent === 'Телефон') {
        addContact.inputContact.type = 'number';
        addContact.inputContact.value = item.value;
      } else if (addContact.buttonSelect.textContent === 'Email') {
        addContact.inputContact.type = 'text';
        addContact.inputContact.value = item.value;
      } else {
        addContact.inputContact.type = 'text';
        addContact.inputContact.value = item.value;
      }
      
      modalClient.modalContactsWrapper.prepend(addContact.formContacts);
    }

    modalClient.modalButtonCancel.addEventListener('click', async (e) => {
      e.preventDefault()

      const modalDelete = createModalDelete();
      main.append(modalDelete.modalDeleteWrapper);

      // Модальное окно для подтверждения удаления клиента
      modalDelete.modalDeleteButton.addEventListener('click', async () => {
        modalDelete.modalDeleteButtonSpan.classList.add('spinner-button--active');
        try {
          await deleteClientServer(client.id);
        } catch (error) {
          console.log(error);
        } finally {
          document.getElementById(client.id).remove();
          onClose(modalDelete.modalDeleteWrapper);
          modalDelete.modalDeleteButtonSpan.classList.remove('spinner-button--active');
        }
      })
    })
    
    modalClient.modalTitle.append(modalTitleId);
    main.append(
      modalClient.modalWrapper
    )
      
    // Форма отправки изменений клиента на сервер
    modalClient.modalFormAdd.addEventListener('submit', async(e) => {
      e.preventDefault()
  
      const typesContact = document.querySelectorAll('.contacts__button-select');
      const valueContact = document.querySelectorAll('.contacts__input');
      let contacts = [];
      let clientObj = {};

      const regexp = /[^а-яА-ЯёЁ]+$/g;
      const onlyEnglish = /[^a-zA-Z|@|.]+$/g;

      if (regexp.test(modalClient.modalInputSurname.value)) {
        modalClient.modalInputSurname.classList.add('wrong');
        modalClient.textWrong.classList.remove('visible-hidden');
        modalClient.textWrong.textContent = 'Допустимые символы (а-я, А-Я)';
        return;
      }

      if (modalClient.modalInputSurname.value.trim() === '') {
        modalClient.modalInputSurname.classList.add('wrong');
        modalClient.textWrong.classList.remove('visible-hidden');
        modalClient.textWrong.textContent = 'Вы не ввели "Фамилию"';
        return;
      }

      if (regexp.test(modalClient.modalInputName.value)) {
        modalClient.modalInputName.classList.add('wrong');
        modalClient.textWrong.classList.remove('visible-hidden');
        modalClient.textWrong.textContent = 'Допустимые символы (а-я, А-Я)';
        return;
      }
  
      if (modalClient.modalInputName.value.trim() === '') {
        modalClient.modalInputName.classList.add('wrong');
        modalClient.textWrong.classList.remove('visible-hidden');
        modalClient.textWrong.textContent = 'Вы не ввели "Имя"';
        return;
      }

      for (let i = 0; i < typesContact.length; i++) {
        if (valueContact[i].value === '') {
          valueContact[i].classList.add('wrong');
          modalClient.textWrong.classList.remove('visible-hidden');
          modalClient.textWrong.textContent = 'Заполните поле!';
          return;
        }
        if (typesContact[i].textContent === 'Телефон') {
          if (valueContact[i].value === '' || valueContact[i].value.length !== 11) {
            valueContact[i].classList.add('wrong');
            modalClient.textWrong.classList.remove('visible-hidden');
            modalClient.textWrong.textContent = 'Введите корректный номер (11 цифр)';
            return;
          } 
        } else if (typesContact[i].textContent === 'Email') {
          if (onlyEnglish.test(valueContact[i].value)) {
            valueContact[i].classList.add('wrong');
            modalClient.textWrong.classList.remove('visible-hidden');
            modalClient.textWrong.textContent = 'Введите корректную почту (a-z, A-Z (@/.))';
            return
          };
        }
        contacts.push({
          type: typesContact[i].textContent,
          value: valueContact[i].value
        })
      }
      
      clientObj = {
        name: modalClient.modalInputName.value.trim(),
        surname: modalClient.modalInputSurname.value.trim(),
        lastName: modalClient.modalInputLastname.value.trim(),
        contacts: contacts
      };

      patchServerClient(clientObj, client.id);

      let serverData;

      modalClient.modalButtonSaveSpan.classList.add('spinner-button--active');

      try {
        serverData = await getServerClient();
        modalClient.modalWindowBlock.classList.add('modal__clients-block--active');
      } catch (error) {
        console.log(error);
      } finally {
        window.location.hash = '';
        modalClient.modalWindowBlock.classList.remove('modal__clients-block--active');
        arrayClientsData = serverData;
        render(arrayClientsData);
        onClose(modalClient.modalWrapper);
        modalClient.modalButtonSaveSpan.classList.remove('spinner-button--active');
      }
    })

    // Плавающий span для input
    document.querySelectorAll('.form__input').forEach(function(e) {
      e.classList.add('form__span--active');
      e.addEventListener('input', () => {
        if (e.value !== '') {
          e.classList.add('form__span--active');
        } else {
          e.classList.remove('form__span--active');
        }
      })
    })
  }
  
  // Создаем модальное окно 
  const modalClients = (onClose) => {
    const modalWrapper = document.createElement('div'),
          modalWindowAdd = document.createElement('div'),
          modalWindowBlock = document.createElement('div'),
          modalTitle = document.createElement('h2'),
          modalFormAdd = document.createElement('form'),
          modalLabelSurname = document.createElement('label'),
          modalInputSurname = document.createElement('input'),
          modalInputSurnameSpan = document.createElement('span'),
          modalLabelName = document.createElement('label'),
          modalInputName = document.createElement('input'),
          modalInputNameSpan = document.createElement('span'),
          modalLabelLastname = document.createElement('label'),
          modalInputLastname = document.createElement('input'),
          modalInputLastnameSpan = document.createElement('span'),
          modalContactsWrapper = document.createElement('div'),
          modalButtonAddContacts = document.createElement('button'),
          textWrong = document.createElement('div'),
          modalButtonSave = document.createElement('button'),
          modalButtonSaveSpan = document.createElement('span'),
          modalButtonCancel = document.createElement('button'),
          modalButtonClose = document.createElement('button')
  
    modalWrapper.classList.add('modal__wrapper', 'modal__wrapper--active');
    modalContactsWrapper.classList.add('clients__contacts-wrapper', 'contacts')
    modalWindowAdd.classList.add('modal__clients', 'modal__clients--active');
    modalWindowBlock.classList.add('modal__clients-block');
    modalTitle.classList.add('modal__clients-title', 'title-reset');
    modalFormAdd.classList.add('modal__form-add', 'form');
    modalLabelSurname.classList.add('form__label')
    modalInputSurname.classList.add('form__input');
    modalInputSurnameSpan.classList.add('form__span', 'form__span-surname');
    modalLabelName.classList.add('form__label')
    modalInputName.classList.add('form__input');
    modalInputNameSpan.classList.add('form__span', 'form__span-name');
    modalLabelLastname.classList.add('form__label')
    modalInputLastname.classList.add('form__input');
    modalInputLastnameSpan.classList.add('form__span', 'form__span-lastname');
    modalButtonAddContacts.classList.add('btn-reset', 'form__button-contacts', 'form__button-contacts--active');
    textWrong.classList.add('form__wrong', 'visible-hidden')
    modalButtonSave.classList.add('btn-reset', 'form__button-save');
    modalButtonCancel.classList.add('btn-reset', 'form__button-cancel');
    modalButtonClose.classList.add('btn-reset', 'form__button-close');
    modalButtonSaveSpan.classList.add('spinner-button');
  
    modalLabelSurname.setAttribute('for', 'surname');
    modalInputSurname.id = 'surname';
    modalInputSurname.type = 'text';
    modalLabelName.setAttribute('for', 'name');
    modalInputName.id = 'name';
    modalInputName.type = 'text';
    modalLabelLastname.setAttribute('for', 'lastname');
    modalInputLastname.id = 'lastname';
    modalInputLastname.type = 'text';
  
    modalTitle.textContent = 'Новый клиент';
    modalInputSurnameSpan.textContent = 'Фамилия';
    modalInputNameSpan.textContent = 'Имя';
    modalInputLastnameSpan.textContent = 'Отчество';
    modalButtonAddContacts.textContent = 'Добавить контакт';
    modalButtonSave.textContent = 'Сохранить';
    modalButtonCancel.textContent = 'Отмена';
  
    modalButtonClose.addEventListener('click', e => {
      e.preventDefault();

      onClose(modalWrapper);
    })
  
    modalButtonCancel.addEventListener('click', e => {
      e.preventDefault();
  
      onClose(modalWrapper);
    })
  
    document.addEventListener('keydown', e => {
      if (e.key === "Escape") {
        onClose(modalWrapper);
      }
    });
    
    modalWindowAdd.addEventListener('click', event => {
      event._isClickWithInModal = true;
    });
  
    modalWrapper.addEventListener('click', event => {
      if (event._isClickWithInModal) return;

      onClose(modalWrapper);
    })
  
    // Добавляем контакты
    modalButtonAddContacts.addEventListener('click', e => {
      e.preventDefault()
      const contactsItem = document.querySelectorAll('.contacts__wrapper');

      if (contactsItem.length < 9) {
        const contactItem = addContacts();
        modalContactsWrapper.prepend(contactItem.formContacts);
        if (contactsItem.length > 4) document.querySelector('.modal__wrapper').style.alignItems = 'flex-start';
      } else {
        const contactItem = addContacts();
        modalContactsWrapper.prepend(contactItem.formContacts);
        modalButtonAddContacts.classList.remove('form__button-contacts--active');
      }
    })

    modalLabelSurname.append(modalInputSurname);
    modalLabelSurname.append(modalInputSurnameSpan);
    modalFormAdd.append(modalLabelSurname);
    modalLabelName.append(modalInputName);
    modalLabelName.append(modalInputNameSpan)
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
    };
  }

  // Функция создания модального окна для удаления клиента
  const createModalDelete = () => {
    const modalDeleteWrapper = document.createElement('div'),
          modalDeleteForm = document.createElement('div'),
          modalDeleteTitle = document.createElement('h2'),
          modalDeleteDescr = document.createElement('span'),
          modalDeleteButton = document.createElement('button'),
          modalDeleteButtonSpan = document.createElement('span'),
          modalDeleteCancel = document.createElement('button'),
          modalDeleteClose = document.createElement('button')

    modalDeleteWrapper.classList.add('modal__delete', 'modal__delete--active');
    modalDeleteForm.classList.add('modal__delete-form', 'modal__delete-form--active');
    modalDeleteTitle.classList.add('modal__delete-title', 'title-reset');
    modalDeleteDescr.classList.add('modal__delete-descr');
    modalDeleteButton.classList.add('modal__delete-agree', 'btn-reset');
    modalDeleteButtonSpan.classList.add('spinner-button');
    modalDeleteCancel.classList.add('modal__delete-cancel', 'btn-reset');
    modalDeleteClose.classList.add('modal__delete-close', 'btn-reset');

    modalDeleteTitle.textContent = 'Удалить клиента';
    modalDeleteDescr.textContent = 'Вы действительно хотите удалить данного клиента?';
    modalDeleteButton.textContent = 'Удалить';
    modalDeleteCancel.textContent = 'Отмена';

    modalDeleteCancel.addEventListener('click', () => {
      e.preventDefault();

      onClose(modalDeleteWrapper);
    })

    modalDeleteClose.addEventListener('click', () => {
      onClose(modalDeleteWrapper);
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        onClose(modalDeleteWrapper);
      }
    });

    modalDeleteForm.addEventListener('click', event => {
      event._isClickWithInModal = true;
    })

    modalDeleteWrapper.addEventListener('click', event => {
      if (event._isClickWithInModal) return;
      onClose(modalDeleteWrapper);
    })

    modalDeleteButton.append(modalDeleteButtonSpan);
    modalDeleteForm.append(modalDeleteTitle, modalDeleteDescr, modalDeleteButton, modalDeleteCancel, modalDeleteClose);
    modalDeleteWrapper.append(modalDeleteForm);

    return {
      modalDeleteWrapper,
      modalDeleteForm,
      modalDeleteCancel,
      modalDeleteButton,
      modalDeleteButtonSpan,
      modalDeleteClose
    };
  }
  
  // Функция закрытия
  function onClose(modalElement) {
    modalElement.remove();
    window.location.hash = '';
  }
  
  // Функция добавления контактов клиента
  const addContacts = () => {
      
    const formContacts = document.createElement('div'),
          selectWrapper = document.createElement('div'),
          buttonSelect = document.createElement('button'),
          selectList = document.createElement('ul'),
          inputContact = document.createElement('input'),
          buttonDelete = document.createElement('button'),
          buttonDeleteTooltip = document.createElement('span'), 
          selectTel = document.createElement('li'),
          selectTelNew = document.createElement('li'),
          selectEmail = document.createElement('li'),
          selectVk = document.createElement('li'),
          selectFacebook = document.createElement('li'),
          selectItem = 'select__item'
  
    selectTel.textContent = 'Телефон'; 
    selectTelNew.textContent = 'Доп. телефон'; 
    selectEmail.textContent = 'Email'; 
    selectVk.textContent = 'Vk'; 
    selectFacebook.textContent = 'Facebook';
    buttonSelect.textContent = selectTel.textContent;
    inputContact.placeholder = 'Введите данные контакта';
    inputContact.type = 'number';
    buttonDeleteTooltip.textContent = 'Удалить контакт';
  
    selectList.classList.add('select__list');
    formContacts.classList.add('contacts__wrapper');
    selectWrapper.classList.add('select', 'select-wrapper');
    buttonSelect.classList.add('btn-reset', 'contacts__button-select');
    inputContact.classList.add('contacts__input');
    buttonDelete.classList.add('btn-reset', 'contacts__btn-delete');
    buttonDeleteTooltip.classList.add('tooltip', 'contacts__tooltip-delete')
    selectTel.classList.add(selectItem);
    selectTelNew.classList.add(selectItem);
    selectEmail.classList.add(selectItem);
    selectVk.classList.add(selectItem);
    selectFacebook.classList.add(selectItem);
    
    // При выборе, убирает из списка такой же select
    buttonSelect.addEventListener('click', (e) => {
      e.preventDefault();

      for (const type of typeArr) {
        if (buttonSelect.textContent === type.textContent) {
          type.classList.add('select__item--hidden');
        } else {
          type.classList.remove('select__item--hidden');
        }
      }
  
      selectWrapper.classList.toggle('select__wrapper--active');
    })

    selectWrapper.addEventListener('mouseleave', () => {
      selectWrapper.classList.remove('select__wrapper--active');
    })
  
    // Удаляем контакт
    buttonDelete.addEventListener('click', () => {
      onClose(formContacts);
      const contactsItem = document.querySelectorAll('.contacts__wrapper');

      if (contactsItem.length < 6) document.querySelector('.modal__wrapper').style.alignItems = 'center';

      document.querySelector('.form__button-contacts').classList.add('form__button-contacts--active')
    })

    inputContact.addEventListener('input', () => {
      const textWrong = document.querySelector('.form__wrong');

      inputContact.classList.remove('wrong');
      textWrong.classList.add('visible-hidden');
    })

    // Функция select
    const setType = (type) => {
      type.addEventListener('click', () => {
        buttonSelect.textContent = type.textContent;
        selectWrapper.classList.remove('select__wrapper--active');
        if (buttonSelect.textContent === 'Телефон') {
          inputContact.type = 'number';
        } else {
          inputContact.type = 'text';
        }
      })
    }

    const typeArr = [selectTel, selectTelNew, selectEmail, selectVk, selectFacebook];

    for (const type of typeArr) {
      setType(type);
    }
  
    selectList.append(selectTel, selectTelNew, selectEmail, selectVk, selectFacebook,)
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
  }

  // Форматируем дату
  const formatDate = data => {
    const newDate = new Date(data);

    const correctDate = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }

    const resultDate = newDate.toLocaleString('ru', correctDate);

    return resultDate;
  }

  // Форматируем время
  const formatTime = data => {
    const newDate = new Date(data);

    const correctDate = {
      hour: 'numeric',
      minute: 'numeric',
    }

    const resultTime = newDate.toLocaleString('ru', correctDate);

    return resultTime;
  }

  // Поиск
  const searchClient = (clients) => {
    const searchInput = document.querySelector('.header__input-search'),
          searchList = document.querySelector('.header__search-list')

    clients.forEach(client => {
      const searchItem = document.createElement('li');
      const searchLink = document.createElement('a');

      searchItem.classList.add('header__search-item');
      searchLink.classList.add('header__search-link');

      searchLink.textContent = `${client.surname} ${client.name}`;

      searchLink.addEventListener('click', () => {
        const el = document.getElementById(client.id);
        el.scrollIntoView({block: 'center', inline: 'center'});
        searchInput.value = '';
        searchList.classList.add('visible-hidden');
        searchItem.classList.add('visible-hidden');
        document.getElementById(client.id).classList.add('active-client');
        setTimeout(() => {
          document.getElementById(client.id).classList.remove('active-client');
        }, 5000)
      })

      searchItem.append(searchLink);
      searchList.append(searchItem);
    })

    searchInput.addEventListener('input', () => {
      const value = searchInput.value.trim();
      const foundItems = document.querySelectorAll('.header__search-item');
      const foundLinks = document.querySelectorAll('.header__search-link');
      
      if (value !== '') {
        for (let i = 0; i < foundItems.length; i++) {
          if (foundLinks[i].innerText.search(value) === -1) {
            foundItems[i].classList.add('visible-hidden');
            foundLinks[i].innerHTML = foundLinks[i].textContent;
          } else {
            foundItems[i].classList.remove('visible-hidden');
            searchList.classList.remove('visible-hidden');
            const str = foundLinks[i].textContent;
            foundLinks[i].innerHTML = insertMark(str, foundLinks[i].textContent.search(value), value.length);
          }
        }
      } else {
        for (let i = 0; i < foundItems.length; i++) {
          foundItems[i].classList.add('visible-hidden');
        }
        searchList.classList.add('visible-hidden');
      }

      document.body.addEventListener('click', () => {
        foundItems.forEach(item => {
          item.classList.add('visible-hidden');
          searchList.classList.add('visible-hidden');
        })
      })
    })
    
    const insertMark = (str, pos, leng) => str
    .slice(0, pos) + '<mark>' + str
    .slice(pos, pos + leng) + '</mark>' + str
    .slice(pos + leng);
  }


  // Индикатор загрузки
  const preload = () => {
    const loadWrapper = document.createElement('div'),
          loadImg = document.createElement('span')

    loadWrapper.classList.add('preload__wrapper');
    loadImg.classList.add('preload__img');
    loadImg.id = 'loader';   

    loadWrapper.append(loadImg);

    return loadWrapper;
  }

  
  // Сортировка
  tableHeadThId.addEventListener('click', function() {
    sortMark = 'id';
    sortDir = !sortDir;
    render(arrayClientsData);
  })
  
  tableHeadThName.addEventListener('click', function() {
    sortMark = 'fio';
    sortDir = !sortDir;
    render(arrayClientsData);
  })
  
  tableHeadThDateCreate.addEventListener('click', function() {
    sortMark = 'createdAt';
    sortDir = !sortDir;
    render(arrayClientsData);
  })
  
  tableHeadThDateChange.addEventListener('click', function() {
    sortMark = 'updatedAt';
    sortDir = !sortDir;
    render(arrayClientsData);
  })

  // Функция отрисовки и добавления данных в таблицу
  function render(arrData) {
    tbody.innerHTML = '';

    document.querySelector('.clients__wrapper').append(preload());
    const buttonSave = document.querySelector('.clients__button');
    buttonSave.classList.add('visible-hidden');

    let copyClientsArray = [...arrData];

    copyClientsArray = copyClientsArray.sort(function(a, b) {
      let sort = a[sortMark] < b[sortMark]
  
      if (sortDir === false) sort = a[sortMark] > b[sortMark]
  
      if (sort) return -1;
    })

    const load = document.querySelector('.preload__wrapper');

    try {
      for (const client of copyClientsArray) {
        client.fio = client.surname + ' ' + client.name + ' ' + client.lastName;
        const newClient = createClient(client);
        tbody.append(newClient);
      }
    } catch (error) {
      console.log(error);
    } finally {
      load.remove();
      buttonSave.classList.remove('visible-hidden');
    }
  }

  render(arrayClientsData);

  const createApp = async () => {
    const clients = await getServerClient();
    searchClient(clients);
    document.querySelector('.header__search-list');
  }

  createApp();
})()
