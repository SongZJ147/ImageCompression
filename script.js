document.addEventListener('DOMContentLoaded', function() {
    const uploadInput = document.getElementById('upload');
    const uploadArea = document.getElementById('uploadArea');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');
    const compressionRatioInput = document.getElementById('compressionRatio');
    const changeButton = document.getElementById('changeButton');
    const originalSection = document.getElementById('originalSection');

    // Prevent page zooming with Ctrl + scroll
    window.addEventListener('wheel', function(event) {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, { passive: false });

    uploadArea.addEventListener('click', function() {
        uploadInput.click();
    });

    uploadArea.addEventListener('dragover', function(event) {
        event.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(event) {
        event.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = event.dataTransfer.files[0];
        handleFile(file);
    });

    uploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage.src = e.target.result;
                originalImage.onload = function() {
                    document.getElementById('originalSize').textContent = `原始大小: ${Math.round(file.size / 1024)} KB`;
                    originalSection.classList.remove('hidden'); // Show original image section
                    document.getElementById('compressedSection').classList.remove('hidden');
                    document.querySelector('.controls').classList.remove('hidden');
                    compressImage(); // Initial compression
                };
            };
            reader.readAsDataURL(file);
        }
    }

    compressionRatioInput.addEventListener('input', compressImage);

    changeButton.addEventListener('click', function() {
        uploadInput.click(); // Trigger file input to change image
    });

    function compressImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const compressionRatio = compressionRatioInput.value;

        canvas.width = originalImage.width * compressionRatio;
        canvas.height = originalImage.height * compressionRatio;
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            compressedImage.src = url;
            document.getElementById('compressedSize').textContent = `压缩后大小: ${Math.round(blob.size / 1024)} KB`;

            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = url;
        }, 'image/jpeg', compressionRatio);
    }

    originalImage.addEventListener('click', function() {
        modalImage.src = originalImage.src;
        modal.style.display = 'flex';
    });

    compressedImage.addEventListener('click', function() {
        modalImage.src = compressedImage.src;
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Zoom in/out on modal image with mouse wheel
    let scale = 1;
    modalImage.addEventListener('wheel', function(event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            scale *= 1.1; // Zoom in
        } else {
            scale *= 0.9; // Zoom out
        }
        modalImage.style.transform = `scale(${scale})`;
    });
});