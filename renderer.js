const fs = require('fs');
const path = require('path');

const log = document.getElementById('log');

// 1. ADIM: SENİN BİLGİSAYARINDA ÇALIŞACAK
document.getElementById('saveBtn').addEventListener('click', () => {
    const anaYol = document.getElementById('yol').value.trim().replace(/^"(.*)"$/, '$1');
    if (!fs.existsSync(anaYol)) return alert("Geçerli bir yol girin!");

    const liste = [];
    function tara(dizin, alt) {
        const dosyalar = fs.readdirSync(path.join(dizin, alt));
        dosyalar.forEach(f => {
            const yeniAlt = path.join(alt, f);
            if (fs.lstatSync(path.join(dizin, yeniAlt)).isDirectory()) {
                tara(dizin, yeniAlt);
            } else {
                liste.push(yeniAlt);
            }
        });
    }

    tara(anaYol, "");
    fs.writeFileSync('liste.json', JSON.stringify(liste, null, 2));
    log.innerHTML = "<b>liste.json oluşturuldu!</b> Bunu arkadaşına gönder.";
});

// 2. ADIM: ARKADAŞININ BİLGİSAYARINDA ÇALIŞACAK
document.getElementById('checkBtn').addEventListener('click', () => {
    const anaYol = document.getElementById('yol').value.trim().replace(/^"(.*)"$/, '$1');
    if (!fs.existsSync('liste.json')) return alert("Önce liste.json dosyasını buraya koyun!");

    const anaListe = JSON.parse(fs.readFileSync('liste.json', 'utf8'));
    log.innerHTML = "<b>Karşılaştırılıyor...</b><br>";

    anaListe.forEach(dosya => {
        if (!fs.existsSync(path.join(anaYol, dosya))) {
            log.innerHTML += `<div class="eksik">[EKSİK] ${dosya}</div>`;
        }
    });
});