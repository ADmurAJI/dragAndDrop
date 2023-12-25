document.addEventListener('DOMContentLoaded', () => {
    // Функция для проверки и обработки файлов
    async function handleFiles(files) {
        let formatError = false;
        let sizeError = false;

        if (files.length > 3) {
            alert('Вы можете выбрать не более 3 файлов одновременно');
            formatError = true;
            sizeError = true; // Устанавливаем обе ошибки, чтобы отобразить общее сообщение об ошибке
        }

        const validFiles = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Проверяем формат файла
            if (!formatError && (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'application/pdf')) {
                formatError = true;
            }

            // Проверяем размер файла
            if (!sizeError && file.size > 5 * 1024 * 1024) {
                sizeError = true;
            }

            if (!formatError && !sizeError) {
                validFiles.push(file);
            }
        }

        const retryText = document.querySelector('.retry-text');
        if (retryText) {
            retryText.style.color = '#3964D8';
            retryText.addEventListener('click', function() {
                window.location.reload();
            });
        }

        // Если есть ошибка формата или размера
        if (formatError || sizeError) {
            const loadingArea = document.querySelector('.loading-area');
            loadingArea.style.borderRadius = '2px';
            loadingArea.style.border = '1px solid #FAE8EC';
            loadingArea.style.background = '#FAE8EC';
            loadingArea.style.display = 'flex';
            loadingArea.style.flexDirection = 'column';
            loadingArea.style.justifyContent = 'center';
            loadingArea.style.alignItems = 'center';
            loadingArea.style.textAlign = 'center';

            const textLoad = document.querySelector('.text-load');
            textLoad.textContent = 'Ошибка загрузки';
            textLoad.style.marginTop = '10px';
            textLoad.style.color = '#152247';

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
                textAnnotation.innerHTML = errorMessage + '<span class="retry-text">Попробовать еще раз</span>';

                const retryText = document.querySelector('.retry-text');
                if (retryText) {
                    retryText.style.color = '#3964D8';
                    retryText.addEventListener('click', function() {
                        window.location.reload();
                    });
                }
            }
        }

        // Отобразите имя файлов из массива validFiles
        const fileNamePdfElement = document.getElementById('file-name-pdf');
        const fileNameJpgElement = document.getElementById('file-name-jpg');
        const fileNameJpegElement = document.getElementById('file-name-jpeg');

        const pdfFiles = validFiles.filter(file => file.name.toLowerCase().endsWith('.pdf'));
        const jpgFiles = validFiles.filter(file => file.name.toLowerCase().endsWith('.jpg'));
        const jpegFiles = validFiles.filter(file => file.name.toLowerCase().endsWith('.jpeg'));

        // Создать и отобразить элементы type-file для каждого типа файла
        function createTypeFileElement(type, fileName) {
            const typeFileContainer = document.createElement('div');
            typeFileContainer.classList.add('type-file');

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');

            const deleteButtonImage = document.createElement('img');
            deleteButtonImage.src = 'trash-can%201.svg';
            deleteButtonImage.alt = 'svg';

            deleteButton.appendChild(deleteButtonImage);

            const textNameFile = document.createElement('p');
            textNameFile.classList.add('text-name-file');
            textNameFile.textContent = fileName;

            const fileTypeText = document.createElement('p');
            fileTypeText.classList.add(`type-file-text-${type}`);
            fileTypeText.textContent = type.toUpperCase();

            typeFileContainer.appendChild(deleteButton);
            typeFileContainer.appendChild(textNameFile);
            typeFileContainer.appendChild(fileTypeText);

            return typeFileContainer;
        }


        // Скрыть все элементы type-file
        document.querySelectorAll('.type-file').forEach(element => {
            element.style.display = 'none';
        });

        if (pdfFiles.length > 0) {
            fileNamePdfElement.textContent = pdfFiles[0].name;
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

        // Начало загрузки файлов
        const loader = document.querySelector('.loader');
        const loadingPercent = document.querySelector('.loading-percent');
        const spinner = document.querySelector('.loader-spinner');
        loader.style.display = 'block';
        spinner.style.display = 'block';

        const formData = new FormData();
        for (const file of files) {
            formData.append('files[]', file);
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload-url');

        // Обработчик событий для отслеживания прогресса
        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                loadingPercent.textContent = `${percentComplete}%`;
            }
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('Файлы успешно загружены');
            } else {
                console.error('Ошибка при загрузке файлов');
            }
            loader.style.display = 'none';
            spinner.style.display = 'none';
        };

        xhr.onerror = function() {
            console.error('Ошибка запроса');
            loader.style.display = 'none';
            spinner.style.display = 'none';
        };

        xhr.send(formData);
    }


    // Функция создания элемента input
    function createFileInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg, image/jpg, application/pdf';
        fileInput.multiple = true;

        // Обработчик событий для выбора файла
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
        return fileInput;
    }

    // Обработчик клика на кнопку
    const loadButton = document.querySelector('.load-text');
    loadButton.addEventListener('click', () => {
        const fileInput = createFileInput();
        fileInput.click();
    });

    // Настройка зоны drag and drop
    const dropArea = document.querySelector('.loading-area');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        dropArea.addEventListener(event, (e) => {
            e.preventDefault();
            dropArea.classList.toggle('drag-over', event === 'dragenter' || event === 'dragover');
        });
    });

    dropArea.addEventListener('drop', (e) => {
        handleFiles(e.dataTransfer.files);
    });
});
