import { FuzzyMatchResult } from '@/types/companion';

const KOREAN_CHOSUNG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

export function getChosung(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const chosungIndex = Math.floor((code - 0xac00) / 588);
      result += KOREAN_CHOSUNG[chosungIndex];
    } else {
      result += str[i];
    }
  }
  return result;
}

export function isChosungSearch(query: string): boolean {
  return query.split('').every((char) => KOREAN_CHOSUNG.includes(char) || char === ' ');
}

export function fuzzySearchItems<T extends { titleKo: string; titleEn: string; summaryKo: string; relatedKeywords?: string[] }>(
  items: T[],
  query: string
): FuzzyMatchResult<T>[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const results: FuzzyMatchResult<T>[] = [];
  const queryChosung = getChosung(cleanQuery);
  const isQueryChosungOnly = isChosungSearch(cleanQuery);

  for (const item of items) {
    const titleKo = item.titleKo.toLowerCase();
    const titleEn = item.titleEn.toLowerCase();
    const summaryKo = item.summaryKo.toLowerCase();
    const titleChosung = getChosung(titleKo);

    let score = 0;
    let matchedField: 'titleKo' | 'titleEn' | 'summaryKo' | 'keyword' | 'jamo' = 'titleKo';

    // 1. Korean Title Exact match or Includes match
    if (titleKo === cleanQuery) {
      score = 100;
      matchedField = 'titleKo';
    } else if (titleKo.includes(cleanQuery)) {
      score = 80;
      matchedField = 'titleKo';
    }
    // 2. English Title Includes match
    else if (titleEn.includes(cleanQuery)) {
      score = 75;
      matchedField = 'titleEn';
    }
    // 3. Korean Chosung Match (e.g. "ㅂㅍ" -> "부패")
    else if (isQueryChosungOnly && titleChosung.includes(queryChosung)) {
      score = 70;
      matchedField = 'jamo';
    }
    // 4. Related Keywords match
    else if (item.relatedKeywords?.some((kw) => kw.toLowerCase().includes(cleanQuery))) {
      score = 60;
      matchedField = 'keyword';
    }
    // 5. Summary text includes match
    else if (summaryKo.includes(cleanQuery)) {
      score = 50;
      matchedField = 'summaryKo';
    }

    if (score > 0) {
      results.push({ item, score, matchedField });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
