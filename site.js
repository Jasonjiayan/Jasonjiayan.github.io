(function () {
  function openNav() {
    if (window.innerWidth <= 1200) {
      document.getElementById('layout-menu').style.width = '280px';
      document.getElementById('layout-content-container').style.marginLeft = '280.8px';
      document.getElementById('layout-content-container').style.position = 'fixed';
    }
  }

  function closeNav() {
    if (window.innerWidth <= 1200) {
      document.getElementById('layout-menu').style.width = '0';
      document.getElementById('layout-content-container').style.position = 'static';
      document.getElementById('layout-content-container').style.marginLeft = '0px';
      setTimeout(function () {
        window.location.reload();
      }, 500);
    }
  }

  function ordinalSuffix(day) {
    var j = day % 10;
    var k = day % 100;
    if (j === 1 && k !== 11) {
      return day + 'st';
    }
    if (j === 2 && k !== 12) {
      return day + 'nd';
    }
    if (j === 3 && k !== 13) {
      return day + 'rd';
    }
    return day + 'th';
  }

  function formatTimeZone(date) {
    var formatter = Intl.DateTimeFormat([], { timeZoneName: 'short' });
    var parts = formatter.formatToParts(date);
    for (var i = 0; i < parts.length; i += 1) {
      if (parts[i].type === 'timeZoneName') {
        return parts[i].value;
      }
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  function updateLastModified() {
    var lastModified = new Date(document.lastModified);
    if (isNaN(lastModified.getTime())) {
      return;
    }

    var month = lastModified.toLocaleString('en-US', { month: 'long' });
    var dayString = ordinalSuffix(lastModified.getDate());
    var year = lastModified.getFullYear();
    var time = lastModified.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    var dateString = month + ' ' + dayString + ' ' + year + ' ' + time;
    var timeZoneString = formatTimeZone(lastModified);

    var dateTargets = document.querySelectorAll('[data-last-modified-date]');
    var tzTargets = document.querySelectorAll('[data-last-modified-tz]');

    dateTargets.forEach(function (el) {
      el.textContent = dateString;
    });
    tzTargets.forEach(function (el) {
      el.textContent = timeZoneString;
    });
  }

  function loadVisitorGlobe() {
    var container = document.querySelector('[data-visitor-globe]');
    if (!container) {
      return;
    }

    var config = window.siteConfig || {};
    var src = config.visitorGlobeSrc;

    if (!src || src.indexOf('REPLACE_WITH_YOUR_KEY') !== -1) {
      container.innerHTML = '<p style="font-size: 0.85em; color: #888; margin: 0;">Configure your visitor globe in <code>site-config.js</code>.</p>';
      return;
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';
    container.appendChild(script);
  }

  window.openNav = openNav;
  window.closeNav = closeNav;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      updateLastModified();
      loadVisitorGlobe();
    });
  } else {
    updateLastModified();
    loadVisitorGlobe();
  }
})();
