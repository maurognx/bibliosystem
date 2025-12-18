INSERT INTO system_settings (setting_key, setting_value) VALUES ('app_base_url', 'http://localhost:5173')
ON DUPLICATE KEY UPDATE setting_key=setting_key;
