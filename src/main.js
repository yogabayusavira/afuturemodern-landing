// Interactive Smooth Scrolling for anchors
document.querySelectorAll('.topnav nav a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.getElementById(this.getAttribute('href').slice(1));
    if (target) {
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});

document.querySelectorAll('.mobile-overlay nav a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.getElementById(this.getAttribute('href').slice(1));
    if (target) {
      e.preventDefault();
      document.getElementById('mobileOverlay').classList.remove('open');
      var top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});
