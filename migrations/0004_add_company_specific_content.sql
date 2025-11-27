-- 企業専用コンテンツ対応のためのカラム追加
-- is_company_specific: 1 = 企業専用コンテンツ, 0 = 共有コンテンツ
-- target_company_id: 企業専用コンテンツの場合、対象企業のID

ALTER TABLE contents ADD COLUMN is_company_specific INTEGER DEFAULT 0;
ALTER TABLE contents ADD COLUMN target_company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE;

-- 既存のコンテンツは全て共有コンテンツとして設定
UPDATE contents SET is_company_specific = 0 WHERE is_company_specific IS NULL;
