-- マスター管理者を作成
INSERT OR IGNORE INTO admins (login_id, password_hash, name)
VALUES ('kousuke-sato@sipe-selye.co.jp', '$2b$10$dj3wf1uYMb6hkB9Wy.edQuU0ctomfKZI3Ki3mfVbBS2X1zOVLKYuG', 'システム管理者');
