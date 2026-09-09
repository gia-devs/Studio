document.addEventListener("DOMContentLoaded", () => {
    const mainTitle = document.getElementById("mainTitle");
    const sizeRange = document.getElementById("sizeRange");
    const sizeValue = document.getElementById("sizeValue");
    const weightRange = document.getElementById("weightRange");
    const weightValue = document.getElementById("weightValue");
    const clearBtn = document.getElementById("clearBtn");
    const caseBtns = document.querySelectorAll(".case-btn");
    const styleOptions = document.querySelectorAll(".style-option");
    const keys = document.querySelectorAll("[data-key]");

    let currentText = "EXO 2";
    let isUpperCase = true;

    // =========================
    // 🎙️ Sistema de Audio e IA (Alta Presencia)
    // =========================
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playBeep(freq = 400, duration = 0.08) {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        osc.connect(gain); 
        gain.connect(audioCtx.destination);
        osc.start(); 
        osc.stop(audioCtx.currentTime + duration);
    }

    let voice = null;
    function loadVoices() {
        const voices = speechSynthesis.getVoices();
        voice = voices.find(v => v.lang.startsWith("es") && v.name.includes("Google")) || 
                voices.find(v => v.lang.startsWith("es"));
    }
    
    if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }

    function speak(text) {
        playBeep(600, 0.05);
        if (typeof speechSynthesis === 'undefined') return;
        const msg = new SpeechSynthesisUtterance(text);
        if (voice) msg.voice = voice;
        msg.pitch = 0.7; // Tono grave de computadora de nave
        msg.rate = 1.02;
        speechSynthesis.cancel(); // Corta el audio anterior para hablar de inmediato
        speechSynthesis.speak(msg);
    }

    // Actualizar texto del título principal con efecto glitch
    function updateDisplay(text) {
        currentText = text || "EXO 2";
        mainTitle.textContent = isUpperCase ? currentText.toUpperCase() : currentText.toLowerCase();
        mainTitle.setAttribute("data-text", mainTitle.textContent);
        
        mainTitle.classList.add("glitching");
        setTimeout(() => mainTitle.classList.remove("glitching"), 400);
    }

    // 1. Control de Tamaño (Slider)
    sizeRange.addEventListener("input", (e) => {
        const val = e.target.value;
        sizeValue.textContent = val;
        mainTitle.style.fontSize = `${val}px`;
        playBeep(300 + parseInt(val), 0.03);
    });
    
    sizeRange.addEventListener("change", (e) => {
        speak(`Escala ajustada a ${e.target.value} píxeles.`);
    });

    // 2. Control de Peso Tipográfico (Slider Vertical)
    weightRange.addEventListener("input", (e) => {
        const val = e.target.value;
        weightValue.textContent = val;
        mainTitle.style.fontWeight = val;
        playBeep(200 + (val / 3), 0.03);
    });

    weightRange.addEventListener("change", (e) => {
        speak(`Densidad tipográfica modificada a ${e.target.value}.`);
    });

    // 3. Botón CLEAR
    clearBtn.addEventListener("click", () => {
        playBeep(150, 0.15);
        updateDisplay("EXO 2");
        speak("Memoria purificada. Sistema restablecido al valor por defecto.");
    });

    // 4. Botones de Mayúsculas / Minúsculas (ABC / abc)
    caseBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            playBeep(450, 0.05);
            caseBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            isUpperCase = btn.dataset.case === "upper";
            updateDisplay(currentText);
            
            speak(isUpperCase ? "Modo mayúsculas activado." : "Modo minúsculas activado.");
        });
    });

    // 5. Botones de Estilo (Italic / Normal)
    styleOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            playBeep(500, 0.05);
            styleOptions.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            
            const isItalic = opt.dataset.style === "italic";
            mainTitle.style.fontStyle = isItalic ? "italic" : "normal";
            
            speak(isItalic ? "Vector inclinado activado." : "Vector normal restablecido.");
        });
    });

    // 6. Interacción con el Teclado HUD Inferior
    keys.forEach(key => {
        key.addEventListener("click", () => {
            const keyValue = key.getAttribute("data-key");
            
            key.classList.add("pressed");
            setTimeout(() => key.classList.remove("pressed"), 280);

            if (currentText === "EXO 2" || currentText === "exo 2") {
                currentText = ""; 
            }

            if (keyValue === " ") {
                currentText += " ";
                playBeep(250, 0.08);
                speak("Espacio");
            } else {
                currentText += keyValue;
                const charCode = keyValue.charCodeAt(0);
                playBeep(200 + charCode, 0.08);
                speak(`Glifo ${keyValue}`);
            }

            updateDisplay(currentText);
        });
    });

    // 7. Saludo inicial inmersivo de la IA
    setTimeout(() => {
        speak("Sistemas HUD en línea. Bienvenida, Usuario. Hemos detectado una tipografía variable Exo 2, con diseño geométrico, soporte para pesos de 100 a 900 y una densidad de renderizado óptima. Ubicación actual en el sector espacial: coordenadas X 018.32, Y 073.14, Z 042.08. Consola lista.");
    }, 1200);
});