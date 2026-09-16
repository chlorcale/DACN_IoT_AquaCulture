# Shrimp pond IoT - scope implemented in the web/API prototype

## System boundary

```text
pH + temperature probe --- RS485 ---+
DO probe (required, model TBD) --- RS485 ---+--> EPCB-IEC-ESP32-S3 --> IoT API/storage --> Web/mobile app
LH-IO404 (four relay outputs) --- RS485 ---+
Surface camera --- Wi-Fi/LAN ------------------> image upload --> colour/clarity assessment --> alert log
```

The camera assessment supplements the physical measurements. It must never be presented as a replacement for DO, pH, or temperature sensing.

## Hardware status

| Role | Device | Status | Project use |
|---|---|---|---|
| Gateway | EPCB-IEC-ESP32-S3 | selected | RS485 master, RTC scheduling, network uplink |
| pH + temperature | ES-PH-WT-01 | selected | read pH at `0x0001` and temperature at `0x0003` |
| Relay I/O | LH-IO404 | selected | coils 1-4: aerator, pump, feeder, reserve/alarm |
| DO | compatible pond-water DO sensor | **not selected** | required; choose model and calibration method before deployment |
| Vision | waterproof/moisture-resistant camera | **not selected** | fixed-frame periodic capture; upload image to server |

The selected pH probe supports RS485 Modbus RTU (default 4800 bps), 4-20 mA, automatic temperature compensation and IP68. The LH-IO404 offers four isolated relay outputs. The gateway has RS485, LAN/Wi-Fi, RTC, DI/DO and USB-C console/programming. See the manufacturer links in the Device and RS485 page for the source documents.

## API data contracts

| Endpoint | Purpose |
|---|---|
| `GET /api/dashboard` | current values and recent alerts |
| `GET /api/telemetry?limit=24` | timestamped DO, pH and temperature history plus configurable ranges |
| `POST /api/telemetry` | gateway ingestion: `dissolvedOxygen`, `ph`, `temperature`, optional `capturedAt` and `source` |
| `GET/POST /api/vision` | camera capture metadata and image-analysis result |
| `GET /api/devices` | real hardware registry, connection and pH Modbus map |
| `PATCH /api/relays/:id` | requested relay state; firmware must enforce real electrical interlocks |
| `GET /api/alerts` | threshold, communication and vision events |
| `GET /api/project` | system boundary, experiment plan and configuration |

The prototype persists telemetry, alert, relay and vision runtime state to `server/data/runtime-state.json`. This dependency-free JSON adapter is appropriate for a single-node demonstration; replace it with a server database before a multi-user or long-running deployment.

## Evaluation evidence to collect at the pond

1. Compare pH, temperature and DO against a reference instrument; save timestamp, location, device reading and reference reading.
2. Record calibration/cleaning events for every probe, especially the pH electrode.
3. Keep every camera capture paired with field observation (water colour/clarity), then report accuracy or agreement for the image classifier.
4. Test RS485 timeout, network outage and relay safety behavior. A relay command received by the API is not proof that the load changed; read-back/DI evidence should be added in firmware.
5. Record uptime, missing samples, alert delay and recovery time as reliability metrics.
