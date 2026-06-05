// === Presentation Controller ===
let currentSlide = 1;
const totalSlides = 27;

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const prev = document.querySelector('.slide.active');
    
    if (n < 1) n = 1;
    if (n > totalSlides) n = totalSlides;
    
    if (prev) {
        prev.classList.remove('active');
        prev.classList.add('exit-left');
        setTimeout(() => prev.classList.remove('exit-left'), 500);
    }
    
    currentSlide = n;
    const next = document.getElementById(`slide-${n}`);
    setTimeout(() => next.classList.add('active'), 50);
    
    // Update progress
    document.getElementById('progressBar').style.width = `${(n / totalSlides) * 100}%`;
    document.getElementById('slideCounter').textContent = `${n} / ${totalSlides}`;
    
    // Update nav buttons
    document.getElementById('prevBtn').style.opacity = n === 1 ? '0.3' : '1';
    document.getElementById('nextBtn').style.opacity = n === totalSlides ? '0.3' : '1';
}

function nextSlide() {
    if (currentSlide < totalSlides) showSlide(currentSlide + 1);
}

function prevSlide() {
    if (currentSlide > 1) showSlide(currentSlide - 1);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
    }
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
    }
    if (e.key === 'Home') {
        e.preventDefault();
        showSlide(1);
    }
    if (e.key === 'End') {
        e.preventDefault();
        showSlide(totalSlides);
    }
});

// Touch support
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});
document.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
    }
});

// === Cascade Demo (Slide 17) ===
function startCascadeDemo() {
    const services = ['svc-d1', 'svc-c1', 'svc-b1', 'svc-a1'];
    const info = document.getElementById('cascadeInfo');
    
    info.innerHTML = '<p style="color: var(--danger)">⚠️ La base de datos no responde...</p>';
    
    services.forEach((id, i) => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove('ok');
                el.classList.add('failing');
            }
            
            const messages = [
                '💥 DB: Connection timeout - no responde',
                '🔥 Servicio Banco: Esperando DB... timeout! Threads agotados',
                '🔥 Servicio Pagos: No puede conectar con Banco. Cola llena.',
                '🔥 API Gateway: Todo el sistema caído. Usuarios sin servicio.'
            ];
            info.innerHTML = `<p style="color: var(--danger)">${messages[i]}</p>`;
        }, (i + 1) * 800);
    });
}

function resetCascadeDemo() {
    ['svc-a1', 'svc-b1', 'svc-c1', 'svc-d1'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('failing');
            el.classList.add('ok');
        }
    });
    document.getElementById('cascadeInfo').innerHTML = 
        '<p>Haz clic en "Simular Fallo" para ver la diferencia.</p>';
}

// === States Animation (Slide 18) ===
function animateStates() {
    const states = ['state-closed', 'state-open', 'state-half-open', 'state-closed'];
    let i = 0;
    
    document.querySelectorAll('.state-node').forEach(n => n.classList.remove('active-state'));
    
    function next() {
        if (i > 0) {
            const prevEl = document.getElementById(states[i-1]);
            if (prevEl) prevEl.classList.remove('active-state');
        }
        if (i < states.length) {
            const el = document.getElementById(states[i]);
            if (el) el.classList.add('active-state');
            i++;
            setTimeout(next, 1500);
        }
    }
    next();
}

// === Circuit Breaker Simulator (Slide 27) ===
const simulator = {
    state: 'CLOSED',
    failureCount: 0,
    successCount: 0,
    totalSuccess: 0,
    totalFail: 0,
    totalRejected: 0,
    openTimestamp: null,
    halfOpenAttempts: 0
};

function getConfig() {
    return {
        threshold: parseInt(document.getElementById('threshold').value),
        timeout: parseInt(document.getElementById('timeout').value),
        failRate: parseInt(document.getElementById('failRate').value)
    };
}

// Update range displays
document.addEventListener('DOMContentLoaded', () => {
    const thresholdEl = document.getElementById('threshold');
    const timeoutEl = document.getElementById('timeout');
    const failRateEl = document.getElementById('failRate');
    
    if (thresholdEl) {
        thresholdEl.addEventListener('input', function() {
            document.getElementById('thresholdVal').textContent = this.value;
        });
    }
    if (timeoutEl) {
        timeoutEl.addEventListener('input', function() {
            document.getElementById('timeoutVal').textContent = this.value;
        });
    }
    if (failRateEl) {
        failRateEl.addEventListener('input', function() {
            document.getElementById('failRateVal').textContent = this.value + '%';
        });
    }
    
    updateSimUI();
});

function updateSimUI() {
    const stateEl = document.getElementById('simState');
    if (!stateEl) return;
    
    const lightClass = simulator.state === 'CLOSED' ? 'closed' : 
                       simulator.state === 'OPEN' ? 'open' : 'half-open';
    const stateLabel = simulator.state.replace('_', '-');
    
    stateEl.innerHTML = `<div class="status-light ${lightClass}"></div><span>${stateLabel}</span>`;
    document.getElementById('successCount').textContent = simulator.totalSuccess;
    document.getElementById('failCount').textContent = simulator.totalFail;
    document.getElementById('rejectedCount').textContent = simulator.totalRejected;
}

function addLog(message, type) {
    const log = document.getElementById('simLog');
    if (!log) return;
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('p');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${time}] ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
    
    while (log.children.length > 50) {
        log.removeChild(log.firstChild);
    }
}

function sendRequest() {
    const config = getConfig();
    
    if (simulator.state === 'OPEN') {
        const elapsed = Date.now() - simulator.openTimestamp;
        if (elapsed >= config.timeout) {
            simulator.state = 'HALF_OPEN';
            simulator.halfOpenAttempts = 0;
            addLog('⏱️ Timeout expirado → HALF-OPEN', 'info');
        } else {
            simulator.totalRejected++;
            addLog(`🚫 RECHAZADO (circuito abierto, ${Math.ceil((config.timeout - elapsed)/1000)}s restantes)`, 'rejected');
            updateSimUI();
            return;
        }
    }
    
    const fails = Math.random() * 100 < config.failRate;
    
    if (simulator.state === 'HALF_OPEN') {
        simulator.halfOpenAttempts++;
        if (fails) {
            simulator.state = 'OPEN';
            simulator.openTimestamp = Date.now();
            simulator.totalFail++;
            addLog('❌ Fallo en HALF-OPEN → Vuelve a OPEN', 'error');
        } else {
            simulator.totalSuccess++;
            if (simulator.halfOpenAttempts >= 3) {
                simulator.state = 'CLOSED';
                simulator.failureCount = 0;
                addLog('✅ Recuperado → CLOSED', 'success');
            } else {
                addLog(`✅ Éxito HALF-OPEN (${simulator.halfOpenAttempts}/3)`, 'success');
            }
        }
    } else if (simulator.state === 'CLOSED') {
        if (fails) {
            simulator.failureCount++;
            simulator.totalFail++;
            addLog(`❌ Falló (${simulator.failureCount}/${config.threshold})`, 'error');
            
            if (simulator.failureCount >= config.threshold) {
                simulator.state = 'OPEN';
                simulator.openTimestamp = Date.now();
                addLog(`🔴 CIRCUITO ABIERTO — ${config.threshold} fallos alcanzados`, 'error');
            }
        } else {
            simulator.totalSuccess++;
            simulator.failureCount = Math.max(0, simulator.failureCount - 1);
            addLog('✅ Éxito', 'success');
        }
    }
    
    updateSimUI();
}

function sendBurst() {
    let i = 0;
    const interval = setInterval(() => {
        if (i >= 10) {
            clearInterval(interval);
            return;
        }
        sendRequest();
        i++;
    }, 300);
}

function resetSimulator() {
    simulator.state = 'CLOSED';
    simulator.failureCount = 0;
    simulator.successCount = 0;
    simulator.totalSuccess = 0;
    simulator.totalFail = 0;
    simulator.totalRejected = 0;
    simulator.openTimestamp = null;
    simulator.halfOpenAttempts = 0;
    
    const log = document.getElementById('simLog');
    if (log) log.innerHTML = '<p class="log-entry info">Simulador reiniciado.</p>';
    updateSimUI();
}
