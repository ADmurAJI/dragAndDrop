document.addEventListener('DOMContentLoaded', () => {
    // Выбираем элемент 'photo-button'
    const photoButton = document.querySelector('.photo-button');

    // Функция контролирует отображение элемента photoButton в зависимости от ширины окна
    function showPhotoButton() {
        if (window.innerWidth <= 768) {
            photoButton.style.display = 'block';
        } else {
            photoButton.style.display = 'none';
        }
    }

    // Вызываем функцию при загрузке страницы
    showPhotoButton();

    // Вызываем функцию при изменении размера окна
    window.addEventListener('resize', showPhotoButton);


    // Выбираем элемент с классом 'text-load'
    const textLoadElement = document.querySelector('.text-load');

    // Функция updateTextForMobile обновляет текст внутри textLoadElement в зависимости от ширины окна
    function updateTextForMobile() {
        if (window.innerWidth <= 768) {
            textLoadElement.innerHTML = '<button class="load-text">Загрузите документ</button> либо сделайте фото';
        } else {
            textLoadElement.innerHTML = 'Переместите файл в эту область, либо <button class="load-text">загрузите</button> его';
        }
    }

    // Вызов функции при первой загрузке страницы
    updateTextForMobile();

    // Вызов функции при изменении размера окна
    window.addEventListener('resize', updateTextForMobile);

    // Создаем массив для хранения валидных файлов
    const validFiles = [];

    // Функция для проверки и обработки файлов
    async function handleFiles(files) {

        // Создаем переменные для ошибок формата и размера файлов, изначально установлены в false
        let formatError = false;
        let sizeError = false;

        // Обновляем общий размер всех файлов, включая новые
        let newTotalSize = validFiles.reduce((total, file) => total + file.size, 0);
        for (let i = 0; i < files.length; i++) {
            newTotalSize += files[i].size;
        }

        // Проверяем общий размер всех файлов
        if (newTotalSize > 5 * 1024 * 1024) {
            sizeError = true;
        }

        // Перебираем все выбранные файлы
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Проверяем формат файла
            if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'application/pdf') {
                formatError = true;
            }

            // Проверяем общее количество файлов
            if (validFiles.length >= 3) {
                alert('Вы можете выбрать не более 3 файлов одновременно');
                break; // Прерываем цикл, если достигнут лимит файлов
            }

            // Если нет ошибок формата и размера, добавляем файл в массив валидных файлов
            if (!formatError && !sizeError) {
                validFiles.push(file);
            }
        }

        // Выбираем элемент с классом 'retry-text' и устанавливаем ему стили и слушатель события для перезагрузки страницы
        const retryText = document.querySelector('.retry-text');
        if (retryText) {
            retryText.style.color = '#3964D8';
            retryText.addEventListener('click', function () {
                window.location.reload();
            });
        }

        // Если есть ошибка формата или размера
        if (formatError || sizeError) {
            // Выбираем элемент с классом 'loading-area' и устанавливаем стили для отображения ошибки
            const loadingArea = document.querySelector('.loading-area');
            loadingArea.style.borderRadius = '2px';
            loadingArea.style.border = '1px solid #FAE8EC';
            loadingArea.style.background = '#FAE8EC';
            loadingArea.style.display = 'flex';
            loadingArea.style.flexDirection = 'column';
            loadingArea.style.justifyContent = 'center';
            loadingArea.style.alignItems = 'center';
            loadingArea.style.textAlign = 'center';

            // Выбираем элемент с классом 'text-load' и устанавливаем текст ошибки и стили
            const textLoad = document.querySelector('.text-load');
            textLoad.textContent = 'Ошибка загрузки';
            textLoad.style.marginTop = '10px';
            textLoad.style.color = '#152247';

            // Выбираем элемент с классом 'text-annotation' и устанавливаем сообщение об ошибке
            const textAnnotation = document.querySelector('.text-annotation');

            if (formatError || sizeError) {
                let errorMessage = '';
                if (formatError && sizeError) {
                    errorMessage = 'Недопустимый формат и превышен размер файла. ';
                } else if (formatError) {
                    errorMessage = 'Недопустимый формат. ';
                } else if (sizeError) {
                    errorMessage = 'Превышен размер файла. ';
                }
                // Устанавливаем сообщение об ошибке и добавляем ссылку для перезагрузки страницы
                textAnnotation.innerHTML = errorMessage + '<span class="retry-text">Попробовать еще раз</span>';

                // Функция для сброса состояния ошибки
                function resetErrorState() {
                    // Сброс состояний ошибок
                    formatError = false;
                    sizeError = false;

                    // Сброс стилей и текстов для элементов, показывающих ошибку
                    const loadingArea = document.querySelector('.loading-area');
                    loadingArea.style.border = '1px dashed #828282';
                    loadingArea.style.background = 'none';

                    const textLoad = document.querySelector('.text-load');
                    // Создаем новую кнопку и конфигурируем ее
                    textLoad.innerHTML = 'Переместите файл в эту область, либо <button class="load-text">загрузите</button> его';
                    const newLoadButton = textLoad.querySelector('.load-text');
                    configureLoadButton(newLoadButton);

                    const textAnnotation = document.querySelector('.text-annotation');
                    textAnnotation.innerHTML = 'Формат файла jpg, jpeg или pdf, не более 5 Мб';
                }

                // Настройка обработчика событий для retryText
                const retryText = document.querySelector('.retry-text');
                if (retryText) {
                    retryText.style.color = '#3964D8';
                    retryText.addEventListener('click', function () {
                        resetErrorState();
                    });
                }
            }
        }

        // Получаем элементы, куда будем отображать имена файлов для каждого типа
        const fileNamePdfElement = document.getElementById('file-name-pdf');
        const fileNameJpgElement = document.getElementById('file-name-jpg');
        const fileNameJpegElement = document.getElementById('file-name-jpeg');
        // Фильтруем файлы по их расширению
        const pdfFiles = validFiles.filter(file => file.name.toLowerCase().endsWith('.pdf'));
        const jpgFiles = validFiles.filter(file => file.name.toLowerCase().endsWith('.jpg'));
        const jpegFiles = validFiles.filter(file => file.name.toLowerCase().endsWith('.jpeg'));

        // Функция сокращения названия файла
        function shortenFileName(fileName, maxLength = 15) {
            if (fileName.length > maxLength) {
                return fileName.substring(0, maxLength - 3) + '...';
            } else {
                return fileName;
            }
        }

        // Создаём и отображаем элементы type-file для каждого типа файла
        function createTypeFileElement(type, fileName) {
            // Создаем контейнер для элемента type-file
            const typeFileContainer = document.createElement('div');
            typeFileContainer.classList.add('type-file');
            typeFileContainer.style.display = 'flex'
            // Создаем кнопку удаления
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');

            // Добавляем обработчик события для кнопки удаления
            deleteButton.addEventListener('click', function () {
                // Удаляем элемент type-file из DOM
                typeFileContainer.remove();
                // Удаляем файл из массива validFiles
                const fileIndex = validFiles.findIndex(f => f.name === fileName);
                if (fileIndex > -1) {
                    validFiles.splice(fileIndex, 1);
                }
            });
            // Создаем изображение для кнопки удаления
            const deleteButtonImage = document.createElement('img');
            deleteButtonImage.src = 'trash-can%201.svg';
            deleteButtonImage.alt = 'svg';

            deleteButton.appendChild(deleteButtonImage);

            // Создаем элемент для отображения имени файла
            const textNameFile = document.createElement('p');
            textNameFile.classList.add('text-name-file');
            textNameFile.textContent = shortenFileName(fileName);

            // Создаем элемент для отображения типа файла
            const fileTypeText = document.createElement('p');
            fileTypeText.classList.add(`type-file-text-${type}`);
            fileTypeText.textContent = type.toUpperCase();

            // Добавляем элементы в контейнер type-file
            typeFileContainer.appendChild(deleteButton);
            typeFileContainer.appendChild(textNameFile);
            typeFileContainer.appendChild(fileTypeText);

            return typeFileContainer;
        }


        // Скрываем все элементы type-file
        document.querySelectorAll('.type-file').forEach(element => {
            element.style.display = 'none';
        });

        // Если есть файлы с расширением .pdf
        if (pdfFiles.length > 0) {
            // Отображаем имя первого файла в соответствующем элементе
            fileNamePdfElement.textContent = pdfFiles[0].name;
            // Добавляем элементы type-file для каждого файла .pdf
            pdfFiles.forEach(file => {
                const typeFileElement = createTypeFileElement('pdf', file.name);
                document.querySelector('.container-file-extension').appendChild(typeFileElement);
            });
        }

        if (jpgFiles.length > 0) {
            fileNameJpgElement.textContent = jpgFiles[0].name;
            jpgFiles.forEach(file => {
                const typeFileElement = createTypeFileElement('jpg', file.name);
                document.querySelector('.container-file-extension').appendChild(typeFileElement);
            });
        }

        if (jpegFiles.length > 0) {
            fileNameJpegElement.textContent = jpegFiles[0].name;
            jpegFiles.forEach(file => {
                const typeFileElement = createTypeFileElement('jpeg', file.name);
                document.querySelector('.container-file-extension').appendChild(typeFileElement);
            });
        }

        // Загружаем файлы на сервер
        console.log('Файл загружен');


        // Начало загрузки файлов, если нет ошибок формата и размера, и есть валидные файлы
        if (!formatError && !sizeError && validFiles.length > 0) {
            const loader = document.querySelector('.loader');
            const loadingPercent = document.querySelector('.loading-percent');
            const spinner = document.querySelector('.loader-spinner');

            // Отображаем элементы загрузки и скрываем текстовые сообщения
            loader.style.display = 'flex';
            spinner.style.display = 'flex';
            document.querySelector('.text-load').classList.add('hidden')
            document.querySelector('.text-annotation').classList.add('hidden')

            // Создаем объект FormData для передачи файлов
            const formData = new FormData();
            for (const file of files) {
                formData.append('files[]', file);
            }

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'какой то адрес');

            // Обработчик событий для отслеживания прогресса загрузки
            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    loadingPercent.textContent = `${percentComplete}%`;
                }
            };
            // Обработчик события при завершении загрузки
            xhr.onload = function () {
                if (xhr.status === 200) {
                    // Отображаем кнопку удаления файла
                    //document.querySelectorAll('.delete-button').forEach(button => {
                        //button.style.display = 'flex'})
                    console.log('Файлы успешно загружены');
                } else {
                    console.error('Ошибка при загрузке файлов');
                }

                document.querySelectorAll('.delete-button').forEach(button => {
                    button.style.display = 'flex'})
                // Скрываем элементы загрузки и восстанавливаем текстовые сообщения
                loader.style.display = 'none';
                spinner.style.display = 'none';
                document.querySelector('.text-load').classList.remove('hidden')
                document.querySelector('.text-annotation').classList.remove('hidden')
            };
            // Обработчик события при ошибке запроса
            xhr.onerror = function () {
                console.error('Ошибка запроса');
                // Скрываем элементы загрузки и восстанавливаем текстовые сообщения
                loader.style.display = 'none';
                spinner.style.display = 'none';
                document.querySelector('.text-load').classList.remove('hidden')
                document.querySelector('.text-annotation').classList.remove('hidden')
            }
            // Отправляем FormData на сервер
            xhr.send(formData);
        }
    }

    // Функция для создания элемента input для загрузки файлов
    function createFileInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg, image/jpg, application/pdf';
        fileInput.multiple = true;

        // Обработчик события при выборе файла
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
        return fileInput;
    }


    // Функция для создания и конфигурирования кнопки загрузки
    function configureLoadButton(buttonElement) {
        buttonElement.addEventListener('click', () => {
            const fileInput = createFileInput();
            fileInput.click();
        });
    }


    // Обработчик клика на кнопку "Загрузить"
    const loadButton = document.querySelector('.load-text');
    loadButton.addEventListener('click', () => {
        const fileInput = createFileInput();
        fileInput.click();
    });

    // Настройка зоны перетаскивания файлов (drag and drop)
    const dropArea = document.querySelector('.loading-area');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        dropArea.addEventListener(event, (e) => {
            e.preventDefault();
            // Добавляем класс 'drag-over' только для событий dragenter и dragover
            if (event === 'dragenter' || event === 'dragover') {
                dropArea.style.cursor = "url('file-medical 1.png'), auto";
                dropArea.classList.add('drag-over');
            } else {
                dropArea.classList.remove('drag-over');
            }
        });
    });
    // Обработчик события при перетаскивании файлов в зону
    dropArea.addEventListener('drop', (e) => {
        // Обрабатываем выбранные файлы и убираем класс 'drag-over'
        handleFiles(e.dataTransfer.files);
        dropArea.classList.remove('drag-over');
    });
});
