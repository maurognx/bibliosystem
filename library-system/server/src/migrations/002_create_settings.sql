CREATE TABLE IF NOT EXISTS system_settings (
  setting_key VARCHAR(50) PRIMARY KEY,
  setting_value VARCHAR(255)
);

INSERT INTO system_settings (setting_key, setting_value) VALUES ('allow_registration', 'true')
ON DUPLICATE KEY UPDATE setting_key=setting_key;
