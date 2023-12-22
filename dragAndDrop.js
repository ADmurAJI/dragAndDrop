document.addEventListener('DOMContentLoaded', () => {
    // Функция для проверки и обработки файлов
    function handleFiles(files) {
        if (files.length > 5) {
            alert('Вы можете выбрать не более 5 файлов одновременно');
            return;
        }

        const validFiles = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Проверяем формат файла и размер
            if ((file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'application/pdf') &&
                file.size <= 5 * 1024 * 1024) {
                validFiles.push(file);
            }
        }

        if (validFiles.length === 0) {
            alert('Неподдерживаемый формат файла или размер файла превышает 5 МБ');
            return;
        }

        // Загружаем файлы на сервер
        console.log('Файл загружен');
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
