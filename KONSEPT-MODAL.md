# Konsept modalı

Girişte uyarı yok. Modal yalnız kullanıcı eylemiyle açılır. Bileşen: `src/components/ConceptModal.astro` (Base.astro'da bir kez), istemci: `src/scripts/concept-modal.js` (olay delegasyonu, `window.ConceptModal.open(kind, {from, onClose})`), bağlantı: `src/config.ts` -> `CASE_STUDY_URL`.

## Tetikleyiciler (src/scripts/app.js)
- Test sürüşü son onay "Confirm test drive" (`tdconfirm`, drawPanel/testDrive adımı 1) -> `testdrive`; kapanınca panel başarı ekranına geçer.
- Trade-in son adım "Get my estimate" (`value`, adım 6) -> `tradein`; kapanınca mevcut hesaplama/sonuç ekranı sürer.
- "Reserve for €200" (araç detayı, `data-concept="reserve"`) -> `reserve`, panel hiç açılmaz.
- Telefon: header ve sticky bar `.phone` (artık `<a href="tel:">`), mobil menü "Call 090 555 0187", footer "Call the workshop" -> `phone`.
- Adres: footer adres satırı, harita, "Get directions", mobil menüdeki "Dublin Road, Athlone" -> `address`.
- Genel yakalayıcı: herhangi bir `a[href^=tel:]`, `a[href^=mailto:]`, `a[href*="google.com/maps"]` otomatik modal açar (capture aşamasında, preventDefault).
- E-posta: sitede tıklanabilir e-posta yok; `email` metni modülde hazır, mailto: eklenirse otomatik çalışır.

## Gövde metinleri ("In a live build, ...")
reserve, testdrive, tradein, phone, address: brief'teki metinler. Ek hazır: `finance` (başvuru lender'lara gider), `enquiry` (satış ekibine ulaşır), `email`, `other`.

## Kaldırılanlar
- Rezervasyon paneli (`reserve()`: ad/telefon formu, "Hold this car", "yours until" onay ekranı) tamamen silindi. Zaten kart/ödeme alanı yoktu. fetch/endpoint çağrısı yoktu.
- `site.json` `mapsUrl` (artık kullanılmıyor), footer'daki "Concept site" ve sağdaki "Designed by" (alt şeride taşındı), Base.astro'daki eski "Case study by Ufuk." şeridi.

## Telefon / e-posta
- Telefon `090 555 0187` değiştirilmedi: 555 bloğu gerçek bir abonelik gibi görünmüyor ama doğrulanamaz; Athlone alan kodu (090) tutarlılık için korundu. İstenirse 01 234 5xxx'e çevrilebilir (Athlone ile çelişir).
- `site.json` e-postası `sales@midlandmotors.ie` (gerçek olabilecek alan adı) -> `sales@midland.ufuk.ie`. Ekranda kullanılmıyor.

## Belirsiz / eksik
- Finans sayfasında başvuru formu yok (yalnız hesaplayıcı + "Show cars up to" filtresi), bu yüzden finans tetikleyicisi bağlı değil.
- Enquiry/iletişim formu yok.
- Gizlilik/finans sayfalarındaki placeholder metinlerine dokunulmadı.
- Modal açıkken arka plandaki panel altta kalır; kapanınca akış devam eder.
