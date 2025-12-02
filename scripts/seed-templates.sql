INSERT INTO mail_templates (title, subject, body, description, category, is_company_specific, target_company_id, created_at, updated_at) VALUES
('生徒ログイン案内', '【WEBTHQAcademy】ログイン情報のお知らせ', '{{名前}} 様

お疲れ様です。
WEBTHQAcademyのログイン情報をお送りいたします。

■ログイン情報
ログインURL: {{ログインURL}}
ログインID: {{ログインID}}
パスワード: {{パスワード}}

上記URLにアクセスし、ログインIDとパスワードを入力してログインしてください。

ご不明な点がございましたら、担当者までお問い合わせください。

よろしくお願いいたします。', '新規生徒へのログイン情報案内テンプレート', 'login', 0, NULL, datetime('now'), datetime('now'));

INSERT INTO mail_templates (title, subject, body, description, category, is_company_specific, target_company_id, created_at, updated_at) VALUES
('受講リマインダー', '【WEBTHQAcademy】受講のお願い', '{{名前}} 様

お疲れ様です。
WEBTHQAcademyの受講状況についてご連絡いたします。

まだ受講が完了していないコンテンツがございます。
お時間のある時に、下記URLよりログインして受講を進めてください。

ログインURL: {{ログインURL}}

ご不明な点がございましたら、担当者までお問い合わせください。

よろしくお願いいたします。', '受講促進のリマインダーテンプレート', 'reminder', 0, NULL, datetime('now'), datetime('now'));

INSERT INTO mail_templates (title, subject, body, description, category, is_company_specific, target_company_id, created_at, updated_at) VALUES
('パスワードリセット案内', '【WEBTHQAcademy】パスワード再設定のお知らせ', '{{名前}} 様

お疲れ様です。
パスワードを再設定いたしましたのでお知らせいたします。

■新しいログイン情報
ログインURL: {{ログインURL}}
ログインID: {{ログインID}}
パスワード: {{パスワード}}

ログイン後、必要に応じてパスワードを変更してください。

ご不明な点がございましたら、担当者までお問い合わせください。

よろしくお願いいたします。', 'パスワードリセット時の案内テンプレート', 'login', 0, NULL, datetime('now'), datetime('now'));
