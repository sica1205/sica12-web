(() => {

  let initializedRoot = null;

  function initHexPicker() {

    const root = document.querySelector(".hex-picker");

    if (!root || initializedRoot === root) {
      return;
    }

    initializedRoot = root;


    const input =
      root.querySelector("#hex-input");

    const rgbOutput =
      root.querySelector("#hex-rgb");

    const hslOutput =
      root.querySelector("#hex-hsl");

    const randomButton =
      root.querySelector("#hex-random");

    const history =
      root.querySelector("#hex-history");

    const toast =
      root.querySelector("#hex-toast");

    const saturation =
      root.querySelector("#hex-saturation");

    const saturationPointer =
      root.querySelector("#hex-picker-pointer");

    const hue =
      root.querySelector("#hex-hue");

    const huePointer =
      root.querySelector("#hex-hue-pointer");

    const selectedDot =
      root.querySelector("#hex-selected-dot");


    if (
      !input ||
      !rgbOutput ||
      !hslOutput ||
      !randomButton ||
      !history ||
      !toast ||
      !saturation ||
      !saturationPointer ||
      !hue ||
      !huePointer ||
      !selectedDot
    ) {
      return;
    }


    let recentColors = [];
    let toastTimer = null;

    let hueValue = 35;
    let saturationValue = 89;
    let brightnessValue = 100;

    let draggingSaturation = false;
    let draggingHue = false;


    // ==========================================
    // HELPERS
    // ==========================================

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }


    function normalizeHex(hex) {

      if (typeof hex !== "string") {
        return null;
      }

      hex = hex.trim();

      if (!hex.startsWith("#")) {
        hex = "#" + hex;
      }

      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        return hex.toUpperCase();
      }

      return null;
    }


    function hexToRgb(hex) {

      const value =
        parseInt(hex.slice(1), 16);

      return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255
      };
    }


    function rgbToHex(r, g, b) {

      return (
        "#" +
        [r, g, b]
          .map(value =>
            clamp(Math.round(value), 0, 255)
              .toString(16)
              .padStart(2, "0")
          )
          .join("")
          .toUpperCase()
      );
    }


    function rgbToHsl(r, g, b) {

      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);

      let h = 0;
      let s = 0;

      const l = (max + min) / 2;


      if (max !== min) {

        const delta = max - min;

        s =
          l > 0.5
            ? delta / (2 - max - min)
            : delta / (max + min);


        switch (max) {

          case r:
            h =
              (g - b) / delta +
              (g < b ? 6 : 0);
            break;

          case g:
            h =
              (b - r) / delta + 2;
            break;

          case b:
            h =
              (r - g) / delta + 4;
            break;

        }

        h /= 6;

      }


      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    }


    function rgbToHsv(r, g, b) {

      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);

      const delta = max - min;

      let h = 0;

      if (delta !== 0) {

        if (max === r) {
          h = 60 * (((g - b) / delta) % 6);
        }

        else if (max === g) {
          h = 60 * (((b - r) / delta) + 2);
        }

        else {
          h = 60 * (((r - g) / delta) + 4);
        }

      }

      if (h < 0) {
        h += 360;
      }


      const s =
        max === 0
          ? 0
          : delta / max;


      return {
        h,
        s: s * 100,
        v: max * 100
      };
    }


    function hsvToRgb(h, s, v) {

      h =
        ((h % 360) + 360) % 360;

      s /= 100;
      v /= 100;

      const c = v * s;

      const x =
        c *
        (
          1 -
          Math.abs(
            ((h / 60) % 2) - 1
          )
        );

      const m = v - c;

      let r = 0;
      let g = 0;
      let b = 0;


      if (h < 60) {
        r = c;
        g = x;
      }

      else if (h < 120) {
        r = x;
        g = c;
      }

      else if (h < 180) {
        g = c;
        b = x;
      }

      else if (h < 240) {
        g = x;
        b = c;
      }

      else if (h < 300) {
        r = x;
        b = c;
      }

      else {
        r = c;
        b = x;
      }


      return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
      };
    }


    // ==========================================
    // HISTORY
    // ==========================================

    function addRecentColor(hex) {

      const normalized =
        normalizeHex(hex);

      if (!normalized) {
        return;
      }


      recentColors =
        recentColors.filter(
          color => color !== normalized
        );


      recentColors.unshift(
        normalized
      );


      recentColors =
        recentColors.slice(0, 8);


      renderHistory();

    }


    function renderHistory() {

      history.innerHTML = "";


      recentColors.forEach(hex => {

        const swatch =
          document.createElement("button");


        swatch.type =
          "button";

        swatch.className =
          "hex-swatch";

        swatch.dataset.color =
          hex;

        swatch.style.setProperty(
          "--swatch",
          hex
        );

        swatch.setAttribute(
          "aria-label",
          `Selectează ${hex}`
        );


        swatch.addEventListener(
          "click",
          () => {

            setColorFromHex(
              hex,
              true
            );

          }
        );


        history.appendChild(
          swatch
        );

      });

    }


    // ==========================================
    // UI UPDATE
    // ==========================================

    function renderFromHSV() {

      const rgb =
        hsvToRgb(
          hueValue,
          saturationValue,
          brightnessValue
        );


      const hex =
        rgbToHex(
          rgb.r,
          rgb.g,
          rgb.b
        );


      const hsl =
        rgbToHsl(
          rgb.r,
          rgb.g,
          rgb.b
        );


      root.style.setProperty(
        "--picker-color",
        hex
      );


      saturation.style.background =
        `hsl(${hueValue}, 100%, 50%)`;


      saturationPointer.style.left =
        `${saturationValue}%`;

      saturationPointer.style.top =
        `${100 - brightnessValue}%`;


      huePointer.style.left =
        `${hueValue / 3.6}%`;


      hue.setAttribute(
        "aria-valuenow",
        String(Math.round(hueValue))
      );


      selectedDot.style.background =
        hex;


      input.value =
        hex;


      rgbOutput.textContent =
        `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;


      hslOutput.textContent =
        `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;


      return hex;
    }


    function setColorFromHex(
      hex,
      addToHistory = false
    ) {

      const normalized =
        normalizeHex(hex);

      if (!normalized) {
        return false;
      }


      const rgb =
        hexToRgb(normalized);


      const hsv =
        rgbToHsv(
          rgb.r,
          rgb.g,
          rgb.b
        );


      /*
        Pentru alb/negru/gri, hue-ul nu este definit.
        Păstrăm hue-ul curent ca să nu sară sliderul aiurea.
      */

      if (hsv.s > 0) {
        hueValue = hsv.h;
      }


      saturationValue =
        hsv.s;

      brightnessValue =
        hsv.v;


      const renderedHex =
        renderFromHSV();


      if (addToHistory) {
        addRecentColor(renderedHex);
      }


      return true;
    }


    // ==========================================
    // POINTER POSITION
    // ==========================================

    function updateSaturationFromPointer(
      event
    ) {

      const rect =
        saturation.getBoundingClientRect();


      const x =
        clamp(
          event.clientX - rect.left,
          0,
          rect.width
        );


      const y =
        clamp(
          event.clientY - rect.top,
          0,
          rect.height
        );


      saturationValue =
        (x / rect.width) * 100;


      brightnessValue =
        100 -
        (y / rect.height) * 100;


      /*
        IMPORTANT:
        Doar actualizăm live.
        NU băgăm culoarea în RECENT aici.
      */

      renderFromHSV();

    }


    function updateHueFromPointer(
      event
    ) {

      const rect =
        hue.getBoundingClientRect();


      const x =
        clamp(
          event.clientX - rect.left,
          0,
          rect.width
        );


      hueValue =
        (x / rect.width) * 360;


      /*
        La fel: update live, fără history spam.
      */

      renderFromHSV();

    }


    // ==========================================
    // SATURATION POINTER EVENTS
    // ==========================================

    saturation.addEventListener(
      "pointerdown",
      event => {

        draggingSaturation = true;

        saturation.setPointerCapture(
          event.pointerId
        );

        updateSaturationFromPointer(
          event
        );

      }
    );


    saturation.addEventListener(
      "pointermove",
      event => {

        if (!draggingSaturation) {
          return;
        }

        updateSaturationFromPointer(
          event
        );

      }
    );


    function commitSaturation(
      event
    ) {

      if (!draggingSaturation) {
        return;
      }

      draggingSaturation = false;


      if (
        saturation.hasPointerCapture(
          event.pointerId
        )
      ) {
        saturation.releasePointerCapture(
          event.pointerId
        );
      }


      /*
        AICI intră o singură culoare în RECENT:
        exact culoarea finală la care ai dat drumul.
      */

      addRecentColor(
        input.value
      );

    }


    saturation.addEventListener(
      "pointerup",
      commitSaturation
    );


    saturation.addEventListener(
      "pointercancel",
      event => {

        draggingSaturation = false;

        if (
          saturation.hasPointerCapture(
            event.pointerId
          )
        ) {
          saturation.releasePointerCapture(
            event.pointerId
          );
        }

      }
    );


    // ==========================================
    // HUE POINTER EVENTS
    // ==========================================

    hue.addEventListener(
      "pointerdown",
      event => {

        draggingHue = true;

        hue.setPointerCapture(
          event.pointerId
        );

        updateHueFromPointer(
          event
        );

      }
    );


    hue.addEventListener(
      "pointermove",
      event => {

        if (!draggingHue) {
          return;
        }

        updateHueFromPointer(
          event
        );

      }
    );


    function commitHue(
      event
    ) {

      if (!draggingHue) {
        return;
      }

      draggingHue = false;


      if (
        hue.hasPointerCapture(
          event.pointerId
        )
      ) {
        hue.releasePointerCapture(
          event.pointerId
        );
      }


      addRecentColor(
        input.value
      );

    }


    hue.addEventListener(
      "pointerup",
      commitHue
    );


    hue.addEventListener(
      "pointercancel",
      event => {

        draggingHue = false;

        if (
          hue.hasPointerCapture(
            event.pointerId
          )
        ) {
          hue.releasePointerCapture(
            event.pointerId
          );
        }

      }
    );


    // ==========================================
    // KEYBOARD
    // ==========================================

    saturation.addEventListener(
      "keydown",
      event => {

        const step =
          event.shiftKey
            ? 5
            : 1;


        let changed = false;


        if (event.key === "ArrowLeft") {
          saturationValue -= step;
          changed = true;
        }

        if (event.key === "ArrowRight") {
          saturationValue += step;
          changed = true;
        }

        if (event.key === "ArrowUp") {
          brightnessValue += step;
          changed = true;
        }

        if (event.key === "ArrowDown") {
          brightnessValue -= step;
          changed = true;
        }


        if (!changed) {
          return;
        }


        event.preventDefault();


        saturationValue =
          clamp(
            saturationValue,
            0,
            100
          );


        brightnessValue =
          clamp(
            brightnessValue,
            0,
            100
          );


        const hex =
          renderFromHSV();


        addRecentColor(
          hex
        );

      }
    );


    hue.addEventListener(
      "keydown",
      event => {

        const step =
          event.shiftKey
            ? 10
            : 1;


        if (
          event.key !== "ArrowLeft" &&
          event.key !== "ArrowRight"
        ) {
          return;
        }


        event.preventDefault();


        hueValue +=
          event.key === "ArrowRight"
            ? step
            : -step;


        hueValue =
          ((hueValue % 360) + 360) % 360;


        const hex =
          renderFromHSV();


        addRecentColor(
          hex
        );

      }
    );


    // ==========================================
    // HEX INPUT
    // ==========================================

    input.addEventListener(
      "input",
      () => {

        const normalized =
          normalizeHex(
            input.value
          );


        /*
          Se actualizează live când HEX-ul devine valid,
          dar nu intră automat în RECENT la fiecare editare.
        */

        if (normalized) {

          setColorFromHex(
            normalized,
            false
          );

        }

      }
    );


    input.addEventListener(
      "keydown",
      event => {

        if (event.key !== "Enter") {
          return;
        }


        const normalized =
          normalizeHex(
            input.value
          );


        if (!normalized) {
          return;
        }


        setColorFromHex(
          normalized,
          true
        );


        input.blur();

      }
    );


    input.addEventListener(
      "blur",
      () => {

        const normalized =
          normalizeHex(
            input.value
          );


        if (normalized) {

          setColorFromHex(
            normalized,
            true
          );

        }

        else {

          /*
            Dacă user-ul lasă un HEX invalid,
            revenim la culoarea curentă reală.
          */

          renderFromHSV();

        }

      }
    );


    // ==========================================
    // RANDOM
    // ==========================================

    randomButton.addEventListener(
      "click",
      () => {

        const random =
          Math.floor(
            Math.random() * 0xffffff
          );


        const hex =
          "#" +
          random
            .toString(16)
            .padStart(6, "0")
            .toUpperCase();


        setColorFromHex(
          hex,
          true
        );

      }
    );


    // ==========================================
    // COPY
    // ==========================================

    async function copyText(text) {

      try {

        await navigator.clipboard.writeText(
          text
        );

        showToast(
          `COPIED ${text}`
        );

      }

      catch {

        const temporary =
          document.createElement(
            "textarea"
          );


        temporary.value =
          text;


        document.body.appendChild(
          temporary
        );


        temporary.select();


        document.execCommand(
          "copy"
        );


        temporary.remove();


        showToast(
          `COPIED ${text}`
        );

      }

    }


    root
      .querySelectorAll(".hex-copy")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const type =
              button.dataset.copy;


            if (type === "hex") {
              copyText(input.value);
            }

            if (type === "rgb") {
              copyText(rgbOutput.textContent);
            }

            if (type === "hsl") {
              copyText(hslOutput.textContent);
            }

          }
        );

      });


    // ==========================================
    // TOAST
    // ==========================================

    function showToast(
      text = "COPIED"
    ) {

      toast.textContent =
        text;


      toast.classList.add(
        "show"
      );


      clearTimeout(
        toastTimer
      );


      toastTimer =
        setTimeout(
          () => {

            toast.classList.remove(
              "show"
            );

          },
          1200
        );

    }


    // ==========================================
    // DEFAULT COLOR
    // ==========================================

    setColorFromHex(
      "#FF9F1C",
      true
    );

  }


  // ==========================================================
  // UNIVERSAL MODULE WATCHER
  // ==========================================================

  const observer =
    new MutationObserver(() => {

      const root =
        document.querySelector(
          ".hex-picker"
        );


      if (root) {

        initHexPicker();

      }

      else {

        initializedRoot = null;

      }

    });


  function start() {

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );


    initHexPicker();

  }


  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      start,
      {
        once: true
      }
    );

  }

  else {

    start();

  }

})();