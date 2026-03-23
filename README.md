<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Xem trước giao diện — Trang chủ ADN Huyết Thống</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Be Vietnam Pro", system-ui, sans-serif;
      background: linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%);
      color: #1f2937;
      min-height: 100vh;
    }
    .wrap { max-width: 80rem; margin: 0 auto; padding: 0 1rem; }
    header {
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid #e0e7ff;
      padding: 0.75rem 0;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .nav { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
    .logo { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: #1d4ed8; }
    .nav-links { display: flex; gap: 1.25rem; flex-wrap: wrap; font-size: 0.9rem; }
    .nav-links a { color: #4b5563; text-decoration: none; }
    .nav-links a:hover { color: #2563eb; }
    .hero {
      padding: 4rem 0 3rem;
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: center;
    }
    @media (min-width: 768px) {
      .hero { grid-template-columns: 1fr 1fr; padding: 5rem 0; }
    }
    .hero h1 {
      font-size: clamp(1.75rem, 4vw, 2.75rem);
      line-height: 1.2;
      margin-bottom: 1rem;
      text-align: center;
    }
    @media (min-width: 768px) { .hero h1 { text-align: left; } }
    .hero h1 span { color: #2563eb; }
    .hero p { color: #4b5563; margin-bottom: 1.5rem; max-width: 32rem; text-align: center; margin-left: auto; margin-right: auto; }
    @media (min-width: 768px) { .hero p { text-align: left; margin-left: 0; } }
    .btn {
      display: inline-block;
      background: #2563eb;
      color: #fff !important;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 600;
      text-decoration: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn:hover { background: #1d4ed8; }
    .hero-visual {
      display: flex;
      justify-content: center;
    }
    .dna-wrap {
      width: 16rem; height: 16rem;
      border-radius: 50%;
      background: rgba(37, 99, 235, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    @media (min-width: 768px) { .dna-wrap { width: 20rem; height: 20rem; } }
    .dna-wrap svg { width: 70%; height: 70%; color: #2563eb; }
    .features {
      background: #fff;
      padding: 3rem 0;
    }
    .features h2 { text-align: center; font-size: 1.5rem; margin-bottom: 2rem; }
    @media (min-width: 768px) { .features h2 { font-size: 1.875rem; } }
    .grid-4 {
      display: grid;
      gap: 1rem;
      grid-template-columns: 1fr;
    }
    @media (min-width: 640px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .grid-4 { grid-template-columns: repeat(4, 1fr); } }
    .card {
      border: 1px solid #bfdbfe;
      border-radius: 0.5rem;
      padding: 1.5rem;
      text-align: center;
      background: #eff6ff;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.07);
    }
    .card h3 { font-size: 1.125rem; margin: 0.75rem 0 0.5rem; }
    .card p { font-size: 0.875rem; color: #4b5563; }
    .process {
      padding: 3rem 0;
      background: #eff6ff;
    }
    .process h2 { text-align: center; font-size: 1.5rem; margin-bottom: 2rem; }
    .steps { display: grid; gap: 1.5rem; grid-template-columns: 1fr; }
    @media (min-width: 768px) { .steps { grid-template-columns: repeat(4, 1fr); } }
    .step { text-align: center; }
    .step .icon {
      width: 4rem; height: 4rem; margin: 0 auto 1rem;
      border-radius: 50%;
      background: rgba(37, 99, 235, 0.1);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
    }
    .cta {
      background: #fff;
      padding: 3rem 0;
      text-align: center;
    }
    .cta h2 { font-size: 1.5rem; margin-bottom: 1rem; max-width: 40rem; margin-left: auto; margin-right: auto; }
    .cta p { color: #4b5563; margin-bottom: 1.5rem; }
    footer {
      background: #1e3a8a;
      color: #e0e7ff;
      padding: 2rem 0;
      text-align: center;
      font-size: 0.875rem;
    }
    .badge {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.35rem 0.75rem;
      background: #fef3c7;
      color: #92400e;
      border-radius: 9999px;
      font-size: 0.75rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="wrap nav">
      <div class="logo">🧬 ADN Huyết Thống</div>
      <nav class="nav-links">
        <a href="#">Trang chủ</a>
        <a href="#">Về chúng tôi</a>
        <a href="#">Dịch vụ</a>
        <a href="#">Tin tức</a>
        <a href="#">Liên hệ</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero wrap">
      <div>
        <h1>Kết nối gia đình qua<br /><span>Xét nghiệm ADN</span></h1>
        <p>Xác định quan hệ huyết thống với độ chính xác 99.99%. Kết quả nhanh, bảo mật tuyệt đối, hỗ trợ tận tình.</p>
        <div style="text-align:center">
          <button type="button" class="btn" style="margin:0 auto;display:inline-block">Đặt lịch xét nghiệm</button>
        </div>
        <p class="badge">Bản xem trước tĩnh — mở <code>npm run dev</code> để xem app Next.js thật</p>
      </div>
      <div class="hero-visual">
        <div class="dna-wrap">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M8 2c0 4-2 6-2 10s2 6 2 10" stroke-linecap="round"/>
            <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="20" r="1.5" fill="currentColor"/>
            <path d="M16 2c0 4 2 6 2 10s-2 6-2 10" stroke-linecap="round"/>
            <circle cx="16" cy="4" r="1.5" fill="currentColor"/>
            <circle cx="16" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="16" cy="20" r="1.5" fill="currentColor"/>
            <line x1="8" y1="4" x2="16" y2="4" stroke-width="1" opacity="0.8"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke-width="1" opacity="0.8"/>
            <line x1="8" y1="20" x2="16" y2="20" stroke-width="1" opacity="0.8"/>
          </svg>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="wrap">
        <h2>Vì sao chọn dịch vụ xét nghiệm ADN của chúng tôi?</h2>
        <div class="grid-4">
          <div class="card"><div style="font-size:2rem">🛡️</div><h3>Độ chính xác 99.99%</h3><p>Công nghệ phân tích ADN tiên tiến đảm bảo kết quả đáng tin cậy.</p></div>
          <div class="card"><div style="font-size:2rem">🔒</div><h3>Bảo mật tuyệt đối</h3><p>Dữ liệu được mã hóa, tuân thủ tiêu chuẩn bảo mật quốc tế.</p></div>
          <div class="card"><div style="font-size:2rem">🚀</div><h3>Kết quả nhanh chóng</h3><p>Nhận kết quả trong 3-5 ngày làm việc, hỗ trợ giao tận nơi.</p></div>
          <div class="card"><div style="font-size:2rem">👥</div><h3>Hỗ trợ chuyên gia</h3><p>Đội ngũ tư vấn 24/7, giải đáp mọi thắc mắc về xét nghiệm.</p></div>
        </div>
      </div>
    </section>

    <section class="process">
      <div class="wrap">
        <h2>Quy trình xét nghiệm ADN huyết thống</h2>
        <div class="steps">
          <div class="step"><div class="icon">📅</div><h3>Đặt lịch</h3><p>Đăng ký trực tuyến hoặc liên hệ để đặt lịch lấy mẫu.</p></div>
          <div class="step"><div class="icon">🧪</div><h3>Lấy mẫu</h3><p>Lấy mẫu ADN đơn giản tại cơ sở hoặc tại nhà.</p></div>
          <div class="step"><div class="icon">🧬</div><h3>Phân tích</h3><p>Mẫu được phân tích trong phòng thí nghiệm hiện đại.</p></div>
          <div class="step"><div class="icon">📄</div><h3>Nhận kết quả</h3><p>Kết quả được gửi qua email bảo mật hoặc giao trực tiếp.</p></div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="wrap">
        <h2>Đặt lịch xét nghiệm ADN ngay hôm nay để nhận kết quả chính xác, bảo mật.</h2>
        <p>Hỗ trợ 24/7 từ đội ngũ chuyên gia.</p>
        <button type="button" class="btn">Đặt lịch ngay</button>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap">© ADN Huyết Thống — Tài liệu xem trước giao diện (docs/homepage-preview.html)</div>
  </footer>
</body>
</html>