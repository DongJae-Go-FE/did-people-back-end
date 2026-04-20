-- 선택 교구 컬럼을 인천교구/제주교구 두 값으로만 정규화.
-- 기존의 '서울교구', '수원교구', '부산교구' 등은 id 기준 분산(홀수=인천, 짝수=제주)해서 매핑.
-- NULL 값은 그대로 둔다.

UPDATE "members"
SET "chosen_diocese" = CASE
  WHEN "chosen_diocese" IN ('인천교구', '제주교구') THEN "chosen_diocese"
  WHEN ("id" % 2) = 0 THEN '제주교구'
  ELSE '인천교구'
END
WHERE "chosen_diocese" IS NOT NULL
  AND "chosen_diocese" NOT IN ('인천교구', '제주교구');

-- 결과 확인용
SELECT "chosen_diocese", COUNT(*) AS count
FROM "members"
GROUP BY "chosen_diocese"
ORDER BY count DESC;
