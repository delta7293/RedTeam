(function () {
    function getDriverType() {
      try {
        // ✅ Basic: Check WebDriver flag
        if (navigator.webdriver) return "Selenium";
  
        // ✅ Headless browsers often have 0 plugins
        if (!navigator.plugins || navigator.plugins.length === 0) return "Headless";
  
        // ✅ Puppeteer often disables languages
        if (navigator.languages === "" || navigator.language === "") return "Puppeteer";
  
        // ✅ HeadlessChrome in UA string
        if (navigator.userAgent.includes("HeadlessChrome")) return "HeadlessChrome";
  
        // ✅ PhantomJS detection
        if (navigator.userAgent.includes("PhantomJS")) return "PhantomJS";
  
        // ✅ Playwright: abnormal permissions behavior
        if (navigator.permissions && navigator.permissions.query) {
          try {
            navigator.permissions.query({ name: "notifications" }).then((result) => {
              if (result.state === "denied") {
                return "Playwright";
              }
            });
          } catch (e) {
            return "Playwright";
          }
        }
  
        // ✅ WebGL Renderer Fingerprinting
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl");
        if (!gl) return "NoWebGL";
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "";
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "";
        if (
          vendor.toLowerCase().includes("swiftshader") ||
          renderer.toLowerCase().includes("software")
        ) {
          return "FakeWebGL";
        }
  
        // ✅ Audio Fingerprinting
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(10000, audioCtx.currentTime);
        const analyser = audioCtx.createAnalyser();
        oscillator.connect(analyser);
        oscillator.start(0);
        const freqData = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(freqData);
        let sum = 0;
        for (let i = 0; i < freqData.length; i++) {
          sum += freqData[i];
        }
        if (isNaN(sum) || sum === 0) return "FakeAudio";
  
        // ✅ Detect modified native functions (patched browser)
        const fnToString = Function.prototype.toString;
        const isFakeToString =
          fnToString.call(navigator.permissions.query).includes("[native code]") === false;
        if (isFakeToString) return "PatchedBot";
  
        // ✅ Check for common bot artifacts
        for (let prop of ["chrome", "cdc_", "_Selenium_IDE_"]) {
          if (window[prop] !== undefined) {
            return "InjectedBot";
          }
        }
  
        return "Human";
      } catch (e) {
        return "Error";
      }
    }
  
    const driver = getDriverType();
    localStorage.setItem("driver", driver);
  })();
  