(function () {
  // создаём массив для хранения дел
  let listArray = [];
  let listName = '';

  // создаём и возвращаем заголовок приложения
  function createAppTitle(title) {
    const appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    // создаем элементы формы
    const form = document.createElement("form");
    const input = document.createElement("input");
    const buttonWrapper = document.createElement("div");
    const button = document.createElement("button");

    // присваиваем классы элементам формы
    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");

    // добавляем текстовую информацию элементам формы
    input.placeholder = "Введите название нового дела";
    button.textContent = "Добавить дело";

    // делаем кнопку неактивной при отсутствии записи в поле дела
    button.disabled = true;

    // объединяем DOM элементы формы в единую структуру
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // устанавливаем атрибут disabled, когда поле ввода пустое
    input.addEventListener('input', function () {
      button.disabled = input.value === '';
    });

    // возвращаем форму
    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    const list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(obj) {
    // создаем элементы списка
    const item = document.createElement("li");
    // кнопка помещает в элемент, который красиво покажет их в одной группе
    const buttonGroup = document.createElement("div");
    const doneButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    // устанавливаем стили(классы) для элемента списка, а также для размещения кнопок в его правой части с помощью flex
    item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    item.textContent = obj.name;

    // присваиваем классы элементам списка
    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    deleteButton.classList.add("btn", "btn-danger");

    // добавляем текстовую информацию элементам списка
    doneButton.textContent = "Готово";
    deleteButton.textContent = "Удалить";

    if (obj.done) {
      item.classList.add("list-group-item-success");
    }

    // добавляем обработчики на кнопки
    doneButton.addEventListener("click", function () {
      item.classList.toggle("list-group-item-success");

      for (const listItem of listArray) {
        if (listItem.id === obj.id) {
          listItem.done = !listItem.done;
        }
      }
      saveList(listArray, listName);
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        item.remove();

        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id === obj.id) {
            listArray.splice(i, 1);
          }
        }
        saveList(listArray, listName);
      }
    });

    // вкладываем кнопки в отдельный элемент, чтобы они объединялись в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатием
    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  // создаем функцию для генерации уникального id
  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) {
        max = item.id;
      }
    };
    return max + 1;
  }

  // создаем функцию сохранения данных каждого пользователя
  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  // создаем функцию создания дела
  function createTodoApp(container, title = "Список дел", keyName) {
    const todoAppTitle = createAppTitle(title);
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();

    listName = keyName;

    // объединяем DOM элементы в единую структуру
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localDate = localStorage.getItem(listName);

    if (localDate !== null && localDate !== "") {
      listArray = JSON.parse(localDate);
    }

    for (const itemList of listArray) {
      const todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    // браузер создает событие submit на форме по нажатию не Enter или на кнопку создания дела
    todoItemForm.form.addEventListener("submit", function (e) {
      // эта строка необходима, чтобы предотвратить стандартное действие браузера, в данном случае мы не хотим, чтобы страница перегружалась при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввёл в поле
      if (!todoItemForm.input.value) {
        return;
      };

      const newItem = {
        id: getNewID(listArray),
        name: todoItemForm.input.value,
        done: false,
      };

      const todoItem = createTodoItem(newItem);

      // добавление новой записи в конец массива
      listArray.push(newItem);

      // сохранение списка
      saveList(listArray, listName);

      // создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      // возвращаем true для кнопки после добавления дела
      todoItemForm.button.disabled = true;

      // обнуляем значение в поле, чтобы не прошлось стирать его вручную
      todoItemForm.input.value = "";
    });
  }

  window.createTodoApp = createTodoApp;
})();
