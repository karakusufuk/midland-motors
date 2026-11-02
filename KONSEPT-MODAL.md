# Konsept modalı — kaldırıldı (2026-11-02)

"Concept site by Ufuk Karakuş" modalı tamamen kaldırıldı (`ConceptModal.astro`, `concept-modal.js`, `config.ts`).

Kural: demo eylemleri hiçbir şey yapmaz, mesaj göstermez, asla arama başlatmaz.
- Telefon (header, sticky bar, mobil menü, footer "Call the workshop") ve adres/harita/"Get directions": `data-concept` taşır, `href` yok. `app.js` capture aşamasında tıklamayı yutar. `<meta name="format-detection" content="telephone=no, address=no, email=no">` iOS'un numarayı kendi bağlantısına çevirmesini engeller.
- Akışların son butonu görünür, etiketli, soluk ve pasif (`disabled`, `.btn:disabled`): "Confirm test drive", "Get my estimate", "Reserve for €200". Arkasında başarı ekranı yok.
- Test sürüşü ve takas panellerinde hiçbir seçenek önceden seçili gelmez.
