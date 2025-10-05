class HY_YUMEDashboard {
    constructor() {
        this.socket = null;
        this.latestData = null;
        this.dataHistory = [];
        this.maxHistory = 10;
        
        this.initializeSocket();
        this.setupEventListeners();
    }

    initializeSocket() {
        this.socket = io();

        this.socket.on('connected', (data) => {
            this.updateConnectionStatus(true);
            console.log('Connected to server:', data);
        });

        this.socket.on('sensor_data', (data) => {
            this.handleSensorData(data);
        });

        this.socket.on('disconnect', () => {
            this.updateConnectionStatus(false);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.updateConnectionStatus(false);
        });
    }

    setupEventListeners() {
        // Request latest data on page load
        if (this.socket) {
            this.socket.emit('request_latest_data');
        }

        // Auto-refresh every 30 seconds
        setInterval(() => {
            if (this.socket && this.socket.connected) {
                this.socket.emit('request_latest_data');
            }
        }, 30000);
    }

    handleSensorData(data) {
        this.latestData = data;
        this.addToHistory(data);
        
        this.updateDashboard(data);
        this.updateDataTable();
    }

    updateDashboard(data) {
        // Update sensor values
        this.updateSensorValue('suhuValue', data.suhu, '°C');
        this.updateSensorValue('phValue', data.ph, '');
        this.updateSensorValue('tdsValue', data.tds, 'ppm');
        this.updateSensorValue('kelembabanValue', data.kelembaban || '--', '%');

        // Update status indicators
        this.updateStatus('suhuStatus', data.suhu, 22, 25, 'Suhu');
        this.updateStatus('phStatus', data.ph, 5.5, 6.5, 'pH');
        this.updateStatus('tdsStatus', data.tds, 560, 840, 'Nutrisi');
        
        if (data.kelembaban !== null) {
            this.updateStatus('kelembabanStatus', data.kelembaban, 40, 80, 'Kelembaban');
        }

        // Update overall system status
        this.updateSystemStatus(data);
    }

    updateSensorValue(elementId, value, unit) {
        const element = document.getElementById(elementId);
        if (element && value !== null && value !== undefined) {
            element.innerHTML = `${value} <span class="sensor-unit">${unit}</span>`;
        }
    }

    updateStatus(elementId, value, min, max, label) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (value === null || value === undefined) {
            element.textContent = 'Data tidak tersedia';
            element.className = 'status warning';
            return;
        }

        if (value >= min && value <= max) {
            element.textContent = `${label} Optimal`;
            element.className = 'status optimal';
        } else if (value < min) {
            element.textContent = `${label} Rendah`;
            element.className = 'status warning';
        } else {
            element.textContent = `${label} Tinggi`;
            element.className = 'status danger';
        }
    }

    updateSystemStatus(data) {
        const statusElement = document.getElementById('systemStatus');
        const overallStatusElement = document.getElementById('overallStatus');

        if (!data) {
            statusElement.textContent = 'Tidak Ada Data';
            overallStatusElement.textContent = 'Menunggu data sensor...';
            overallStatusElement.className = 'status warning';
            return;
        }

        const issues = [];
        
        if (data.suhu < 22 || data.suhu > 25) issues.push('Suhu');
        if (data.ph < 5.5 || data.ph > 6.5) issues.push('pH');
        if (data.tds < 560 || data.tds > 840) issues.push('Nutrisi');
        if (data.kelembaban && (data.kelembaban < 40 || data.kelembaban > 80)) {
            issues.push('Kelembaban');
        }

        if (issues.length === 0) {
            statusElement.textContent = 'SISTEM OPTIMAL';
            overallStatusElement.textContent = 'Semua parameter dalam kondisi optimal';
            overallStatusElement.className = 'status optimal';
        } else {
            statusElement.textContent = 'PERLU PERHATIAN';
            overallStatusElement.textContent = `Periksa: ${issues.join(', ')}`;
            overallStatusElement.className = 'status warning';
        }
    }

    addToHistory(data) {
        this.dataHistory.unshift(data);
        if (this.dataHistory.length > this.maxHistory) {
            this.dataHistory.pop();
        }
    }

    updateDataTable() {
        const tableBody = document.getElementById('dataTable');
        if (!tableBody) return;

        if (this.dataHistory.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Menunggu data...</td></tr>';
            return;
        }

        tableBody.innerHTML = this.dataHistory.map(data => `
            <tr>
                <td class="timestamp">${new Date(data.timestamp).toLocaleString('id-ID')}</td>
                <td>${data.suhu} °C</td>
                <td>${data.ph}</td>
                <td>${data.tds} ppm</td>
                <td>${data.kelembaban !== null ? data.kelembaban + '%' : '--'}</td>
                <td>
                    <span class="status ${this.getOverallStatus(data)}">
                        ${this.getOverallStatusText(data)}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    getOverallStatus(data) {
        const optimal = 
            data.suhu >= 22 && data.suhu <= 25 &&
            data.ph >= 5.5 && data.ph <= 6.5 &&
            data.tds >= 560 && data.tds <= 840;
        
        return optimal ? 'optimal' : 'warning';
    }

    getOverallStatusText(data) {
        return this.getOverallStatus(data) === 'optimal' ? 'Optimal' : 'Perhatian';
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            if (connected) {
                statusElement.textContent = '✅ Terhubung';
                statusElement.className = 'connection-status connected';
            } else {
                statusElement.textContent = '❌ Terputus';
                statusElement.className = 'connection-status disconnected';
            }
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new HY_YUMEDashboard();
});