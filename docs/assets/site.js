(function () {
  const cookieName = "playkeep_lang";
  const languagePaths = {
    en: "/",
    it: "/it/",
    fr: "/fr/",
    de: "/de/",
    es: "/es/",
    ru: "/ru/",
    zh: "/zh/",
    ja: "/ja/"
  };

  function getCookie(name) {
    return document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1);
  }

  function setCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=31536000; Path=/; SameSite=Lax`;
  }

  function currentPathFor(lang) {
    return languagePaths[lang] || "/";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const select = document.querySelector(".language-select");
    if (!select) return;

    const savedLang = decodeURIComponent(getCookie(cookieName) || "");
    const currentLang = select.dataset.currentLang || "en";

    if (savedLang && savedLang !== currentLang && window.location.pathname === "/") {
      window.location.replace(currentPathFor(savedLang));
      return;
    }

    if (savedLang && languagePaths[savedLang]) {
      select.value = currentLang;
    }

    select.addEventListener("change", function () {
      const lang = select.value;
      setCookie(cookieName, lang);
      window.location.href = currentPathFor(lang);
    });
  });
})();

