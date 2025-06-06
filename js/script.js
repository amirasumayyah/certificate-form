document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;

    //FORM PAGE
    if (path.includes('form.html')) {
    const form = document.getElementById('certificateForm');
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    alertContainer.className = 'alert-container';
    form.prepend(alertContainer);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearAlerts();

        if (!validateForm()) return;

        const formData = {
            persatuan: document.getElementById('persatuan').value,
            program: document.getElementById('program').value,
            tarikh: document.getElementById('tarikh').value,
            masa: document.getElementById('masa').value,
            tempat: document.getElementById('tempat').value,
            tarikhreport: document.getElementById('tarikhreport').value,
            penghargaan: document.getElementById('penghargaan').value,
            penyertaan: document.getElementById('penyertaan').value,
            namapemohon: document.getElementById('namapemohon').value,
            jawatan: document.getElementById('jawatan').value,
            kodkursus: document.getElementById('kodkursus').value,
            alamat: document.getElementById('alamat').value,
            phonenum: document.getElementById('phonenum').value,
        };

        localStorage.setItem('certificateData', JSON.stringify(formData));
        window.location.href = 'result.html';
    });

    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        clearAlerts();

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                field.style.borderColor = '#ccc';
            }
        });

        const phone = document.getElementById('phonenum').value;
        if (!/^\d+$/.test(phone)) {
            showAlert('Nombor telefon hanya boleh mengandungi nombor sahaja.');
            isValid = false;
        }

        const persatuan = document.getElementById('persatuan').value;
        if (!/^[A-Za-z\s]+$/.test(persatuan)) {
            showAlert('Nama persatuan hanya boleh mengandungi huruf sahaja.');
            isValid = false;
        }

        const tarikh = new Date(document.getElementById('tarikh').value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (tarikh >= today) {
            showAlert('Tarikh program mesti sebelum tarikh hari ini.');
            isValid = false;
        }

        const tarikhReport = new Date(document.getElementById('tarikhreport').value);
        if (tarikhReport <= tarikh) {
            showAlert('Tarikh hantar laporan mesti selepas tarikh program.');
            isValid = false;
        }

        const penghargaan = parseInt(document.getElementById('penghargaan').value);
        if (isNaN(penghargaan) || penghargaan < 0) {
            showAlert('Jumlah sijil penghargaan mesti 0 atau lebih.');
            isValid = false;
        }

        const penyertaan = parseInt(document.getElementById('penyertaan').value);
        if (isNaN(penyertaan) || penyertaan < 0) {
            showAlert('Jumlah sijil penyertaan mesti 0 atau lebih.');
            isValid = false;
        }

        if ((penghargaan === 0 || isNaN(penghargaan)) && (penyertaan === 0 || isNaN(penyertaan))) {
            showAlert('Jumlah sijil penyertaan dan penghargaan tidak boleh kedua-duanya kosong.');
            isValid = false;
        }


        const isChecked = document.getElementById('pengesahan').checked;
        if (!isChecked) {
            showAlert('Anda mesti mengakui kenyataan pengesahan.');
            isValid = false;
        }

        return isValid;
    } 

        function showAlert(message) {
            const alert = document.createElement('div');
            alert.textContent = message;
            alert.style.backgroundColor = '#f8d7da';
            alert.style.color = '#721c24';
            alert.style.padding = '10px';
            alert.style.marginTop = '10px';
            alert.style.marginBottom = '10px';
            alert.style.border = '1px solid #f5c6cb';

            const alertContainer = document.getElementById('alertContainer');
            alertContainer.appendChild(alert);
        }

        function clearAlerts() {
            const alertContainer = document.getElementById('alertContainer');
            alertContainer.innerHTML = '';
        }
    }

    //RESULT PAGE
    if (path.includes('result.html')) {
    const data = JSON.parse(localStorage.getItem('certificateData'));
    const resultDiv = document.getElementById('resultData');

        if (data) {
            let html = `
            <p><strong>Persatuan:</strong> ${data.persatuan}</p>
            <p><strong>Program:</strong> ${data.program}</p>
            <p><strong>Tarikh Program:</strong> ${data.tarikh}</p>
            <p><strong>Masa Program:</strong> ${data.masa}</p>
            <p><strong>Tempat:</strong> ${data.tempat}</p>
            <p><strong>Tarikh Hantar Laporan:</strong> ${data.tarikhreport}</p>
            <p><strong>Jumlah Sijil Penghargaan:</strong> ${data.penghargaan}</p>
            <p><strong>Jumlah Sijil Penyertaan:</strong> ${data.penyertaan}</p>
            <hr/> 
            <p><strong>Nama Pemohon:</strong> ${data.namapemohon}</p>
            <p><strong>Jawatan:</strong> ${data.jawatan}</p>
            <p><strong>Kod Kursus / Fakulti:</strong> ${data.kodkursus}</p>
            <p><strong>Alamat:</strong> ${data.alamat}</p>
            <p><strong>No. Tel:</strong> ${data.phonenum}</p>
            `;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = '<p>Tiada data permohonan dijumpai. Sila isi borang terlebih dahulu.</p>';
        }

        window.printResult = function () {
            window.print();
        };

        window.goBack = function () {
            window.history.back();
        };
    }
});
