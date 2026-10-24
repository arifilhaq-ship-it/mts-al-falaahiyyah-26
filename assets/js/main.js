/**
 * MTs Al Falaahiyyah - Main JavaScript Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initStatsCounter();
  initFaqAccordion();
  initPpdbForm();
  initGalleryFilter();
  initNewsFilter();
  initModals();
});

// Mobile Navigation Toggle
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-mobile-menu');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
      backdrop.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Sticky Header & Active Navigation
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-md', 'bg-white/95');
      header.classList.remove('bg-white');
    } else {
      header.classList.remove('shadow-md');
      header.classList.add('bg-white');
    }
  });
}

// Stats Counter Animation
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.innerText = target + (counter.getAttribute('data-suffix') || '');
              clearInterval(timer);
            } else {
              counter.innerText = Math.floor(current) + (counter.getAttribute('data-suffix') || '');
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all others
      faqItems.forEach(otherItem => {
        const otherContent = otherItem.querySelector('.faq-content');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherContent) otherContent.classList.add('hidden');
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// PPDB Online Registration Logic
function initPpdbForm() {
  const form = document.getElementById('ppdb-registration-form');
  if (!form) return;

  // Jalur Beasiswa & Biaya Simulation
  const jalurSelect = document.getElementById('jalur-pendaftaran');
  const programSelect = document.getElementById('program-pilihan');
  const estBiayaDisplay = document.getElementById('estimasi-biaya');

  function calculateEstBiaya() {
    if (!estBiayaDisplay) return;
    let base = 2500000; // Biaya dasar pendaftaran & seragam
    const program = programSelect ? programSelect.value : 'reguler';
    const jalur = jalurSelect ? jalurSelect.value : 'reguler';

    if (program === 'boarding') base += 1200000;
    if (program === 'tahfidz') base += 300000;

    let diskon = 0;
    if (jalur === 'prestasi-tahfidz') diskon = 0.50; // 50% discount
    if (jalur === 'prestasi-akademik') diskon = 0.30; // 30% discount
    if (jalur === 'dhuafa') diskon = 0.70; // 70% discount / beasiswa

    const total = base * (1 - diskon);
    estBiayaDisplay.innerText = 'Rp ' + total.toLocaleString('id-ID');
  }

  if (jalurSelect) jalurSelect.addEventListener('change', calculateEstBiaya);
  if (programSelect) programSelect.addEventListener('change', calculateEstBiaya);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nama = document.getElementById('nama-lengkap')?.value.trim();
    const nisn = document.getElementById('nisn')?.value.trim();
    const asalSekolah = document.getElementById('asal-sekolah')?.value.trim();
    const namaWali = document.getElementById('nama-wali')?.value.trim();
    const noHp = document.getElementById('no-hp')?.value.trim();
    const jalur = jalurSelect?.value || 'Reguler';
    const program = programSelect?.value || 'Reguler';

    if (!nama || !nisn || !asalSekolah || !noHp) {
      alert('Mohon lengkapi seluruh formulir wajib bertanda bintang (*)');
      return;
    }

    // Generate Registration Code
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const regCode = `PPDB-2026-ALF-${randomNum}`;
    const tanggalDaftar = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Populate Print Slip
    const slipNama = document.getElementById('slip-nama');
    const slipNisn = document.getElementById('slip-nisn');
    const slipAsal = document.getElementById('slip-asal');
    const slipWali = document.getElementById('slip-wali');
    const slipHp = document.getElementById('slip-hp');
    const slipJalur = document.getElementById('slip-jalur');
    const slipProgram = document.getElementById('slip-program');
    const slipNoDaftar = document.getElementById('slip-no-daftar');
    const slipTanggal = document.getElementById('slip-tanggal');

    if (slipNama) slipNama.innerText = nama;
    if (slipNisn) slipNisn.innerText = nisn;
    if (slipAsal) slipAsal.innerText = asalSekolah;
    if (slipWali) slipWali.innerText = namaWali || '-';
    if (slipHp) slipHp.innerText = noHp;
    if (slipJalur) slipJalur.innerText = jalur.toUpperCase();
    if (slipProgram) slipProgram.innerText = program.toUpperCase();
    if (slipNoDaftar) slipNoDaftar.innerText = regCode;
    if (slipTanggal) slipTanggal.innerText = tanggalDaftar;

    // Show Success Modal
    const modal = document.getElementById('ppdb-success-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    // Save to LocalStorage
    try {
      const submissions = JSON.parse(localStorage.getItem('mts_ppdb_submissions') || '[]');
      submissions.push({
        code: regCode,
        nama,
        nisn,
        asalSekolah,
        namaWali,
        noHp,
        jalur,
        program,
        date: tanggalDaftar
      });
      localStorage.setItem('mts_ppdb_submissions', JSON.stringify(submissions));
    } catch(err) {
      console.warn('Storage error', err);
    }

    form.reset();
  });
}

// Gallery Filtering
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterBtns.forEach(b => {
        b.classList.remove('bg-emerald-700', 'text-white', 'shadow-md');
        b.classList.add('bg-gray-100', 'text-gray-700');
      });
      btn.classList.add('bg-emerald-700', 'text-white', 'shadow-md');
      btn.classList.remove('bg-gray-100', 'text-gray-700');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// News Filtering
function initNewsFilter() {
  const newsBtns = document.querySelectorAll('.news-filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  if (!newsBtns.length || !newsCards.length) return;

  newsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      newsBtns.forEach(b => {
        b.classList.remove('bg-emerald-700', 'text-white');
        b.classList.add('bg-white', 'text-gray-700');
      });
      btn.classList.add('bg-emerald-700', 'text-white');
      btn.classList.remove('bg-white', 'text-gray-700');

      const category = btn.getAttribute('data-category');

      newsCards.forEach(card => {
        const itemCat = card.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Modals Handling (Video Profil, Lightbox, etc.)
function initModals() {
  // Video Modal
  const openVideoBtn = document.getElementById('btn-open-video');
  const closeVideoBtn = document.getElementById('btn-close-video');
  const videoModal = document.getElementById('video-profile-modal');

  if (openVideoBtn && videoModal) {
    openVideoBtn.addEventListener('click', () => {
      videoModal.classList.remove('hidden');
      videoModal.classList.add('flex');
    });
  }

  if (closeVideoBtn && videoModal) {
    closeVideoBtn.addEventListener('click', () => {
      videoModal.classList.add('hidden');
      videoModal.classList.remove('flex');
    });
  }

  // Success Modal PPDB
  const closePpdbModal = document.getElementById('btn-close-ppdb-modal');
  const ppdbModal = document.getElementById('ppdb-success-modal');
  if (closePpdbModal && ppdbModal) {
    closePpdbModal.addEventListener('click', () => {
      ppdbModal.classList.add('hidden');
      ppdbModal.classList.remove('flex');
    });
  }

  // Print Slip Button
  const btnPrintSlip = document.getElementById('btn-print-slip');
  if (btnPrintSlip) {
    btnPrintSlip.addEventListener('click', () => {
      window.print();
    });
  }
}
