# Hướng dẫn đưa WBL lên WordPress (WPBakery native — không raw HTML base64)

Bộ file v2 (thay cho `shortcodes.txt` cũ dùng base64):

| File | Dán vào đâu |
|---|---|
| `wbl-custom.css` | Essentials → Theme Options → **Layout → Custom CSS** (dán toàn bộ, `@import` phải ở dòng đầu) |
| `wbl-custom.js` | Theme Options → **Layout → Advanced → Custom JS (in Footer)** |
| `shortcodes-native.txt` | Nội dung trang (xem bước 3) |

## Bước 1 — Chọn ảnh bằng chuột (Design Options)
Không cần sửa URL trong code. Upload 3 ảnh vào Media rồi chọn qua giao diện WPBakery:

1. **Hero**: Edit row đầu tiên (`wbl-hero-row`) → tab **Design Options** → Background → bấm dấu **+** chọn ảnh từ Media → Background style: **Cover**.
2. **Card Youth**: trong section Portals, edit **cột** có class `pcard-col youth` (Edit this column) → tab **Design Options** → chọn ảnh → Cover.
3. **Card Enterprise**: tương tự với cột `pcard-col ent`.

CSS đã ép `background-size: cover` sẵn nên kể cả quên chọn Cover vẫn hiển thị đúng. Đổi ảnh sau này chỉ cần vào lại Design Options.

## Bước 2 — Dán CSS + JS
1. Theme Options → Layout → **Custom CSS**: dán toàn bộ `wbl-custom.css` (không chứa `@import` — pixfort không nhận).
2. **Custom JS (in Footer)**: dán toàn bộ `wbl-custom.js`. Font Noto Sans Lao + Space Grotesk được load tự động bằng JS ở đầu file này (mục 0), không cần `<link>` hay `@import`.
   - Cách khác (tùy chọn, ổn định hơn vì không chờ JS): cài plugin **WPCode**, thêm snippet PHP:
     ```php
     add_action('wp_enqueue_scripts', function () {
       wp_enqueue_style('wbl-fonts', 'https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap', [], null);
     });
     ```
3. Save → xóa cache SpeedyCache.

## Bước 3 — Tạo trang
1. Pages → Add New → đặt tên "WBL".
2. Page Attributes / Theme settings: chọn template **full-width, không sidebar**; tắt page title của theme.
3. Mở **WPBakery Backend Editor** → góc trên có nút chuyển **Classic Mode** (hoặc icon `</>` để xem code) → dán toàn bộ nội dung `shortcodes-native.txt` (bỏ phần ghi chú đầu file).
4. Update. Quay lại Backend Editor: mọi section giờ là **row/column/element thật** — bạn sửa chữ trực tiếp trong từng Text Block / Custom Heading, không còn base64.

## Bước 4 — Form (Contact Form 7)
Trang dùng 2 form CF7. Cài plugin Contact Form 7, tạo 2 form rồi thay `THAY_ID_FORM_YOUTH` / `THAY_ID_FORM_ENTERPRISE` trong section Apply bằng shortcode ID thật.

Form Youth (mẫu):
```
<div class="fgrid">
<div class="field"><label>ຊື່ ແລະ ນາມສະກຸນ *</label>[text* your-name placeholder "ຊື່ເຕັມຂອງເຈົ້າ"]</div>
<div class="field"><label>ອາຍຸ / ວັນເດືອນປີເກີດ *</label>[text* your-age placeholder "ຕົວຢ່າງ: 19 ປີ / 2007"]</div>
<div class="field"><label>ເບີ WhatsApp *</label>[tel* your-phone placeholder "020 XX XXX XXX"]</div>
<div class="field"><label>ແຂວງ / ເມືອງ</label>[text your-city placeholder "ບ່ອນຢູ່ປະຈຸບັນ"]</div>
</div>
<div class="field full"><label>ສາຂາອາຊີບທີ່ສົນໃຈ *</label>[select* your-field "ການກໍ່ສ້າງ" "ໄຟຟ້າ & ແອ" "ຍານຍົນ & EV" "ກົນຈັກ" "ການຜະລິດ" "ສາງສິນຄ້າ" "ຂາຍຍ່ອຍ & ບໍລິການ"]</div>
<div class="field full"><label>ແນບໄຟລ໌ຮູບເອກະສານ</label>[file your-doc filetypes:jpg|png|pdf]</div>
[submit "ສົ່ງໃບສະໝັກ →"]
```

Form Enterprise (mẫu):
```
<div class="fgrid">
<div class="field"><label>ຊື່ວິສາຫະກິດ / ບໍລິສັດ *</label>[text* company-name]</div>
<div class="field"><label>ຂະແໜງທຸລະກິດ *</label>[select* company-sector "ການກໍ່ສ້າງ" "ໄຟຟ້າ & ເຄື່ອງປັບອາກາດ" "ຍານຍົນ & EV" "ກົນຈັກ" "ການຜະລິດ" "ສາງສິນຄ້າ & ໂລຈິສຕິກ" "ຂາຍຍ່ອຍ & ບໍລິການລູກຄ້າ" "ອື່ນໆ"]</div>
<div class="field"><label>ຊື່ຜູ້ປະສານງານ *</label>[text* contact-name]</div>
<div class="field"><label>ເບີໂທ / WhatsApp *</label>[tel* contact-phone]</div>
<div class="field"><label>ອີເມວ</label>[email contact-email]</div>
<div class="field"><label>ຈຳນວນນັກຮຽນ *</label>[select* student-count "1–2 ຄົນ" "3–5 ຄົນ" "6–10 ຄົນ" "ຫຼາຍກວ່າ 10 ຄົນ"]</div>
</div>
<div class="field full"><label>ຄວາມຕ້ອງການແຮງງານ / ໝາຍເຫດ</label>[textarea your-message]</div>
[submit "ສົ່ງ EOI →"]
```
Gửi mail qua GoSMTP bạn đã cài sẵn.

## Bước 5 — Nav & Footer
Không nằm trong page content — dùng **Essentials Theme Builder**:

- **Header**: tạo header trong Theme Builder, logo "WBL", menu anchor: `#about`, `#cycle`, `#youth`, `#enterprise`, `#proof`, nút CTA màu `#FFB020` link `#apply`. Bật sticky + transparent-on-top nếu theme hỗ trợ.
- **Footer**: dựng 3 cột (liên hệ / đường dẫn / đăng ký) theo nội dung gốc trong `WBL Website.html` (phần `<footer>`), nền `#15171C`.

## Cấu trúc trang (9 row)
1. Hero (`#hero`) 2. Marquee strip 3. About + stat trio (`#about`) 4. Problem (`#problem`) 5. Cycle (`#cycle`) 6. Portals (`#portals`) 7. Youth (`#youth`) 8. Enterprise (`#enterprise`) 9. Proof (`#proof`) 10. Apply (`#apply`)

Tất cả hiệu ứng (đếm số, vòng tròn %, bar, donut, tab form) chạy bằng `wbl-custom.js` — không phụ thuộc page builder.

## Lưu ý
- Nếu WPBakery tự thêm khoảng cách giữa các element: Settings → WPBakery → Design Options → bỏ "Use custom design options" hoặc chỉnh margin = 0 (CSS đã có reset sẵn).
- Nếu chữ Lào không hiển thị đúng font: kiểm tra font Noto Sans Lao đã load (tab Network) — xem lại Bước 2.
- Sau mỗi thay đổi Theme Options, xóa cache SpeedyCache.
