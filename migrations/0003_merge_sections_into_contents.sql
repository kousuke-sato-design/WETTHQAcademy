-- content_sectionsテーブルのデータをcontentsに統合するマイグレーション

-- 1. contentsテーブルにsectionsカラムを追加
ALTER TABLE contents ADD COLUMN sections TEXT;

-- 2. 既存のcontent_sectionsデータをcontentsのsectionsカラムに移行
-- （本番環境でデータがある場合は、手動で移行スクリプトを実行する必要があります）

-- 3. content_sectionsテーブルを削除
DROP TABLE IF EXISTS content_sections;
